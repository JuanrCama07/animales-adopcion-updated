import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryAnimalsDto {
  @ApiPropertyOptional({
    description: 'Pagina actual. Default: 1.',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Resultados por pagina. Default: 10.',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por especie.',
    example: 'perro',
  })
  @IsOptional()
  @IsString()
  especie?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado.',
    example: 'disponible',
    enum: ['disponible', 'adoptado'],
  })
  @IsOptional()
  @IsIn(['disponible', 'adoptado'])
  estado?: string;
}
