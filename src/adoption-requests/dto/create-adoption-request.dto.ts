import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateAdoptionRequestDto {
  @ApiProperty({
    description: 'UUID del usuario.',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'UUID del animal.',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  animalId: string;

  @ApiPropertyOptional({
    description: 'Mensaje opcional del usuario.',
    example: 'Tengo patio grande y experiencia con perros.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
