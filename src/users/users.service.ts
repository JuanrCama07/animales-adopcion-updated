import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
  ) {}

  async create(dto: CreateUserDto) {
    try {
      const user = this.userRepo.create(dto);
      return await this.userRepo.save(user);
    } catch (err) {
      this.handleError(err);
    }
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['favorites', 'registeredAnimals'],
    });

    if (!user) {
      throw new NotFoundException(`User ${id} no encontrado`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    this.userRepo.merge(user, dto);
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
    return { message: 'Usuario eliminado' };
  }

  async addFavorite(userId: string, animalId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} no encontrado`);
    }

    const animal = await this.animalRepo.findOne({
      where: { id: animalId },
    });

    if (!animal) {
      throw new NotFoundException(`Animal ${animalId} no encontrado`);
    }

    const alreadyFavorited = user.favorites.some((a) => a.id === animalId);

    if (!alreadyFavorited) {
      user.favorites.push(animal);
    }

    return this.userRepo.save(user);
  }

  async getFavorites(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favorites', 'favorites.location'],
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} no encontrado`);
    }

    return user.favorites;
  }

  async removeFavorite(userId: string, animalId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} no encontrado`);
    }

    user.favorites = user.favorites.filter((a) => a.id !== animalId);
    return this.userRepo.save(user);
  }

  private handleError(err: any): never {
    if (err.code === '23505') {
      throw new BadRequestException(`Email duplicado: ${err.detail}`);
    }

    throw new InternalServerErrorException('Error inesperado');
  }
}
