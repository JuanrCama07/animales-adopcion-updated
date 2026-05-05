import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateAdoptionRequestDto {
  @ApiProperty({
    description: 'Nuevo estado de la solicitud.',
    example: 'aprobada',
    enum: ['aprobada', 'rechazada'],
  })
  @IsIn(['aprobada', 'rechazada'])
  status: string;
}
