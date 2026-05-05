import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appController: AppController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    appController = app.get(AppController);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    expect(appController.getHello()).toBe('Hello World!');
  });
});
