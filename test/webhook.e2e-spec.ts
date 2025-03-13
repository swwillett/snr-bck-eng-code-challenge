import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from '../src/common/filters/http-exception/http-exception.filter';

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
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/webhook (POST) - Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/webhook')
      .set('Authorization', `Bearer ${WEBHOOK_SECRET}`)
      .send({ lat: 48.8584, lng: 2.2945 })
      .expect(201);

    expect(response.body.message).toBe('Coordinates processed successfully');
  });

  it('/webhook (POST) - Unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .post('/webhook')
      .send({ lat: 48.8584, lng: 2.2945 })
      .expect(401);

    expect(response.body.message).toContain('Invalid authorization token');
  });

  it('/webhook (POST) - Bad Request', async () => {
    const response = await request(app.getHttpServer())
      .post('/webhook')
      .set('Authorization', `Bearer ${WEBHOOK_SECRET}`)
      .send({ lat: 'invalid', lng: 'invalid' })
      .expect(400);

    expect(response.body.message).toContain('lat must be a number');
    expect(response.body.message).toContain('lng must be a number');
  });

  it('/webhook (POST) - Bad Request', async () => {
    const response = await request(app.getHttpServer())
      .post('/webhook')
      .set('Authorization', `Bearer ${WEBHOOK_SECRET}`)
      .send({ lat: 12.4356 })
      .expect(400);

    expect(response.body.message).toContain('lng should not be empty');
  });
});
