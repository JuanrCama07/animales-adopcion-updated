import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    description: 'Nombre del refugio o ubicacion.',
    example: 'Fundacion Patitas',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Ciudad donde se encuentra.',
    example: 'Bogota',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Direccion fisica.',
    example: 'Calle 123 #45-67',
  })
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: 'Telefono del refugio.',
    example: '+57 6011234567',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
