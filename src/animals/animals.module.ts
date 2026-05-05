import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { memoryStorage } from 'multer';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Location } from '../locations/entities/location.entity';
import { User } from '../users/entities/user.entity';
import { Animal } from './entities/animal.entity';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Animal, Location, User]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    CloudinaryModule,
  ],
  controllers: [AnimalsController],
  providers: [AnimalsService],
})
export class AnimalsModule {}
