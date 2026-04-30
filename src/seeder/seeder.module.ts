import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { Location } from '../locations/entities/location.entity';
import { User } from '../users/entities/user.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: Number(configService.getOrThrow('DB_PORT')),
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        entities: [Location, User, Animal],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Location, User, Animal]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
