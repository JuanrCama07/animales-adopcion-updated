import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../locations/entities/location.entity';
import { User } from '../users/entities/user.entity';
import { Animal } from './entities/animal.entity';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, Location, User])],
  controllers: [AnimalsController],
  providers: [AnimalsService],
})
export class AnimalsModule {}
