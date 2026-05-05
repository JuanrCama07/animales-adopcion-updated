import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/entities/user.entity';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { UpdateAdoptionRequestDto } from './dto/update-adoption-request.dto';
import { AdoptionRequest } from './entities/adoption-request.entity';

@Injectable()
export class AdoptionRequestsService {
  private readonly logger = new Logger('AdoptionRequestsService');

  constructor(
    @InjectRepository(AdoptionRequest)
    private readonly requestRepo: Repository<AdoptionRequest>,
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateAdoptionRequestDto) {
    const animal = await this.animalRepo.findOne({
      where: { id: dto.animalId },
    });

    if (!animal) {
      throw new NotFoundException(`Animal ${dto.animalId} no encontrado`);
    }

    if (animal.estado === 'adoptado') {
      throw new ConflictException(
        'Este animal ya fue adoptado y no está disponible',
      );
    }

    const user = await this.userRepo.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User ${dto.userId} no encontrado`);
    }

    const existing = await this.requestRepo.findOne({
      where: { user: { id: dto.userId }, animal: { id: dto.animalId } },
    });

    if (existing) {
      throw new ConflictException(
        'Ya existe una solicitud pendiente para este animal',
      );
    }

    try {
      const request = this.requestRepo.create({
        message: dto.message,
        user,
        animal,
      });

      return await this.requestRepo.save(request);
    } catch (err) {
      this.handleError(err);
    }
  }

  async findAll() {
    return this.requestRepo.find();
  }

  async findOne(id: string) {
    const request = await this.requestRepo.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Solicitud ${id} no encontrada`);
    }

    return request;
  }

  async updateStatus(id: string, dto: UpdateAdoptionRequestDto) {
    const request = await this.findOne(id);

    request.status = dto.status;

    try {
      if (dto.status === 'aprobada') {
        await this.animalRepo.update(request.animal.id, { estado: 'adoptado' });
      }

      return await this.requestRepo.save(request);
    } catch (err) {
      this.handleError(err);
    }
  }

  async remove(id: string) {
    const request = await this.findOne(id);

    try {
      await this.requestRepo.remove(request);
      return { message: 'Solicitud eliminada' };
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: any): never {
    this.logger.error(err);
    throw new InternalServerErrorException('Error inesperado');
  }
}
