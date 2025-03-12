import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

describe('WebhookController (e2e)', () => {
  let app: INestApplication;
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'DEFAULT_SECRET';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/webhook (POST) - Success', () => {
    return request(app.getHttpServer())
      .post('/webhook')
      .set('Authorization', `Bearer ${WEBHOOK_SECRET}`)
      .send({ lat: 48.8584, lng: 2.2945 })
      .expect(200)
      .expect('Coordinates processed successfully');
  });

  it('/webhook (POST) - Unauthorized', () => {
    return request(app.getHttpServer())
      .post('/webhook')
      .send({ lat: 48.8584, lng: 2.2945 })
      .expect(401)
      .expect({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid authorization token',
      });
  });

  it('/webhook (POST) - Bad Request', () => {
    return request(app.getHttpServer())
      .post('/webhook')
      .set('Authorization', `Bearer ${WEBHOOK_SECRET}`)
      .send({ lat: 'invalid', lng: 'invalid' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['lat must be a number', 'lng must be a number'],
        error: 'Bad Request',
      });
  });

  it('/webhook (POST) - Bad Request', () => {
    return request(app.getHttpServer())
      .post('/webhook')
      .set('Authorization', `Bearer ${WEBHOOK_SECRET}`)
      .send({ lat: 12.4356 })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['lng should not be empty', 'lng must be a number'],
        error: 'Bad Request',
      });
  });
});
