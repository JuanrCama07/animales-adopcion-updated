import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiOperation({ summary: 'Crear una ubicacion o refugio' })
  @ApiResponse({ status: 201, description: 'Ubicacion creada' })
  @ApiResponse({ status: 400, description: 'Refugio duplicado o DTO invalido' })
  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @ApiOperation({ summary: 'Listar ubicaciones' })
  @ApiResponse({ status: 200, description: 'Array de ubicaciones' })
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una ubicacion por id' })
  @ApiParam({ name: 'id', description: 'UUID de la ubicacion' })
  @ApiResponse({ status: 200, description: 'Ubicacion encontrada' })
  @ApiResponse({ status: 404, description: 'Ubicacion no encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.locationsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una ubicacion' })
  @ApiParam({ name: 'id', description: 'UUID de la ubicacion' })
  @ApiResponse({ status: 200, description: 'Ubicacion actualizada' })
  @ApiResponse({ status: 404, description: 'Ubicacion no encontrada' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar una ubicacion' })
  @ApiParam({ name: 'id', description: 'UUID de la ubicacion' })
  @ApiResponse({ status: 200, description: 'Ubicacion eliminada' })
  @ApiResponse({ status: 404, description: 'Ubicacion no encontrada' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.locationsService.remove(id);
  }
}
