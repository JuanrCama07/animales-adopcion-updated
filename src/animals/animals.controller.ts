import {
  FileTypeValidator,
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Patch,
  Param,
  Delete,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseUUIDPipe,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { QueryAnimalsDto } from './dto/query-animals.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@ApiTags('animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @ApiOperation({ summary: 'Registrar un nuevo animal' })
  @ApiResponse({ status: 201, description: 'Animal creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos invalidos o DTO invalido' })
  @ApiResponse({
    status: 404,
    description: 'Ubicacion o usuario registrador no encontrado',
  })
  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(createAnimalDto);
  }

  @ApiOperation({ summary: 'Listar animales con filtros y paginacion' })
  @ApiQuery({ name: 'especie', required: false, type: String })
  @ApiQuery({
    name: 'estado',
    required: false,
    enum: ['disponible', 'adoptado'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de animales: { data, total, page, limit }',
  })
  @Get()
  findAll(@Query() query: QueryAnimalsDto) {
    return this.animalsService.findAll(query);
  }

  // ParseUUIDPipe valida que :id sea un UUID válido
  @ApiOperation({ summary: 'Obtener un animal por UUID' })
  @ApiParam({ name: 'id', description: 'UUID del animal' })
  @ApiResponse({ status: 200, description: 'Animal encontrado' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.animalsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar datos de un animal' })
  @ApiParam({ name: 'id', description: 'UUID del animal' })
  @ApiResponse({ status: 200, description: 'Animal actualizado' })
  @ApiResponse({ status: 400, description: 'Datos invalidos o DTO invalido' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAnimalDto: UpdateAnimalDto,
  ) {
    return this.animalsService.update(id, updateAnimalDto);
  }

  @ApiOperation({ summary: 'Subir o reemplazar la foto del animal' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID del animal',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Imagen del animal (JPEG, PNG o WebP · max 2 MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Animal con campo image actualizado',
  })
  @ApiResponse({
    status: 400,
    description: 'Archivo invalido (tipo o tamano incorrecto)',
  })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })
  @ApiResponse({
    status: 500,
    description: 'Credenciales de Cloudinary faltantes en variables de entorno',
  })
  @ApiResponse({ status: 502, description: 'Cloudinary rechazo la imagen' })
  @UseInterceptors(FileInterceptor('image'))
  @Post(':id/image')
  @HttpCode(200)
  uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType: /image\/(jpeg|png|webp)$/,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.animalsService.uploadImage(id, file);
  }

  @ApiOperation({ summary: 'Eliminar un animal' })
  @ApiParam({ name: 'id', description: 'UUID del animal' })
  @ApiResponse({ status: 200, description: 'Animal eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.animalsService.remove(id);
  }
}
