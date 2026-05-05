import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario.',
    example: 'Nicolas Hernandez',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Correo unico del usuario.',
    example: 'nicolas@correo.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Telefono de contacto.',
    example: '+57 3000000000',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
