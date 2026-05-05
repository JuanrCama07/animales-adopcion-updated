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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @ApiResponse({ status: 400, description: 'DTO invalido' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Listar usuarios' })
  @ApiResponse({ status: 200, description: 'Array de usuarios' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un usuario por id' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  // --- Favoritos (ManyToMany) ----------------------

  // POST /api/users/:id/favorites/:animalId
  @ApiOperation({ summary: 'Agregar un animal a favoritos' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiParam({ name: 'animalId', description: 'UUID del animal' })
  @ApiResponse({ status: 201, description: 'Favorito agregado o actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario o animal no encontrado' })
  @Post(':id/favorites/:animalId')
  addFavorite(
    @Param('id', ParseUUIDPipe) userId: string,
    @Param('animalId', ParseUUIDPipe) animalId: string,
  ) {
    return this.usersService.addFavorite(userId, animalId);
  }

  // GET /api/users/:id/favorites
  @ApiOperation({ summary: 'Listar favoritos de un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de animales favoritos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id/favorites')
  getFavorites(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getFavorites(id);
  }

  // DELETE /api/users/:id/favorites/:animalId
  @ApiOperation({ summary: 'Quitar un animal de favoritos' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiParam({ name: 'animalId', description: 'UUID del animal' })
  @ApiResponse({ status: 200, description: 'Favorito eliminado o actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':id/favorites/:animalId')
  removeFavorite(
    @Param('id', ParseUUIDPipe) userId: string,
    @Param('animalId', ParseUUIDPipe) animalId: string,
  ) {
    return this.usersService.removeFavorite(userId, animalId);
  }
}
