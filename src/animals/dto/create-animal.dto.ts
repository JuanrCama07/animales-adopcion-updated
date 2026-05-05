import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAnimalDto {
  @ApiProperty({
    description: 'Nombre del animal.',
    example: 'Luna',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Especie del animal.',
    example: 'perro',
  })
  @IsString()
  especie: string;

  @ApiProperty({
    description: 'Edad del animal.',
    example: 18,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  edad: number;

  @ApiProperty({
    description: 'Descripcion del animal.',
    example: 'Labradora dorada, muy activa y carinosa.',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Estado actual del animal.',
    example: 'disponible',
    enum: ['disponible', 'adoptado'],
    default: 'disponible',
  })
  @IsOptional()
  @IsIn(['disponible', 'adoptado'])
  estado?: string;

  @ApiPropertyOptional({
    description:
      'URL de la imagen. Normalmente se llena desde el endpoint de upload.',
    example: 'https://res.cloudinary.com/demo/image/upload/animal.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Correo de contacto.',
    example: 'contacto@refugio.com',
  })
  @IsEmail()
  contacto: string;

  @ApiPropertyOptional({
    description: 'UUID de la ubicacion.',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({
    description: 'UUID del usuario que registra.',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsOptional()
  @IsUUID()
  registeredById?: string;
}
