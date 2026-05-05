import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdoptionRequestsService } from './adoption-requests.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { UpdateAdoptionRequestDto } from './dto/update-adoption-request.dto';

@ApiTags('adoption-requests')
@Controller('adoption-requests')
export class AdoptionRequestsController {
  constructor(
    private readonly adoptionRequestsService: AdoptionRequestsService,
  ) {}

  @ApiOperation({ summary: 'Crear una solicitud de adopcion' })
  @ApiResponse({ status: 201, description: 'Solicitud creada' })
  @ApiResponse({ status: 400, description: 'DTO invalido' })
  @ApiResponse({
    status: 409,
    description: 'Solicitud duplicada o animal ya adoptado',
  })
  @ApiResponse({ status: 404, description: 'Usuario o animal no encontrado' })
  @Post()
  create(@Body() createAdoptionRequestDto: CreateAdoptionRequestDto) {
    return this.adoptionRequestsService.create(createAdoptionRequestDto);
  }

  @ApiOperation({ summary: 'Listar solicitudes de adopcion' })
  @ApiResponse({ status: 200, description: 'Array de solicitudes' })
  @Get()
  findAll() {
    return this.adoptionRequestsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una solicitud por id' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adoptionRequestsService.findOne(id);
  }

  @ApiOperation({ summary: 'Aprobar o rechazar una solicitud' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 400, description: 'Estado invalido en el body' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdoptionRequestDto: UpdateAdoptionRequestDto,
  ) {
    return this.adoptionRequestsService.updateStatus(
      id,
      updateAdoptionRequestDto,
    );
  }

  @ApiOperation({ summary: 'Eliminar una solicitud de adopcion' })
  @ApiParam({ name: 'id', description: 'UUID de la solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud eliminada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adoptionRequestsService.remove(id);
  }
}
