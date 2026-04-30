import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const logger = new Logger('Seeder');
  const app = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['error', 'warn', 'log'],
  });

  let exitCode = 0;

  try {
    const seeder = app.get(SeederService);
    let seeded = false;

    if (process.argv.includes('--fresh')) {
      logger.warn('Modo --fresh: limpiando tablas...');
      seeded = await seeder.clearAndSeed();
    } else {
      logger.log('Insertando datos...');
      seeded = await seeder.seed();
    }

    if (seeded) {
      logger.log('Proceso finalizado');
    }
  } catch (error) {
    logger.error('Error durante el seed', error);
    exitCode = 1;
  } finally {
    await app.close();
    process.exit(exitCode);
  }
}

void bootstrap();
