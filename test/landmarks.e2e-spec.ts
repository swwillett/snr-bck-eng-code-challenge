import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { HttpExceptionFilter } from '../src/common/filters/http-exception/http-exception.filter';

describe('Landmarks E2E', () => {
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

  it('should retrieve landmarks by lat and lng', async () => {
    const response = await request(app.getHttpServer())
      .get('/landmarks')
      .query({ lat: 40.7128, lng: -74.006 })
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('landmarksCount');
    expect(Array.isArray(response.body.landmarks)).toBe(true);
  });

  it('should return no landmarks found for invalid coordinates', async () => {
    const response = await request(app.getHttpServer())
      .get('/landmarks')
      .query({ lat: -90, lng: -180 })
      .expect(200);

    expect(response.body.message).toBe('No landmarks found');
    expect(response.body.landmarksCount).toBe(0);
  });

  it('should create and retrieve fallback landmark', async () => {
    await request(app.getHttpServer())
      .post('/webhook')
      .set('Authorization', `Bearer ${WEBHOOK_SECRET}`)
      .send({ lat: 0, lng: 0 })
      .expect(201);

    const fallbackResponse = await request(app.getHttpServer())
      .get('/landmarks')
      .query({ lat: 0, lng: 0 })
      .expect(200);

    expect(fallbackResponse.body.message).toBe(
      'Landmarks retrieved from database',
    );
    expect(fallbackResponse.body.landmarks[0].name).toBe(
      'No Attractions Found',
    );
    expect(fallbackResponse.body.landmarks[0].originalRequest).toBe(true);
  });

  it('should retrieve landmarks from cache', async () => {
    await request(app.getHttpServer())
      .post('/webhook')
      .set('Authorization', `Bearer ${WEBHOOK_SECRET}`)
      .send({ lat: 40.7128, lng: -74.006 })
      .expect(201);

    await request(app.getHttpServer())
      .get('/landmarks')
      .query({ lat: 40.7128, lng: -74.006 })
      .expect(200);

    const cachedResponse = await request(app.getHttpServer())
      .get('/landmarks')
      .query({ lat: 40.7128, lng: -74.006 })
      .expect(200);

    expect(cachedResponse.body.message).toBe('Landmarks retrieved from cache');
  });

  it('should handle requests with missing query parameters', async () => {
    const response = await request(app.getHttpServer())
      .get('/landmarks')
      .expect(400);

    expect(response.body.message).toContain('lat should not be empty');
    expect(response.body.message).toContain('lng should not be empty');
  });

  it('should handle invalid lat and lng types', async () => {
    const response = await request(app.getHttpServer())
      .get('/landmarks')
      .query({ lat: 'invalid', lng: 'invalid' })
      .expect(400);

    expect(response.body.message).toContain('lat must be a number');
    expect(response.body.message).toContain('lng must be a number');
  });

  it('should return 400 for out-of-range latitude values', async () => {
    const response = await request(app.getHttpServer())
      .get('/landmarks')
      .query({ lat: 91, lng: -74.006 })
      .expect(400);

    expect(response.body.message).toContain('lat must not be greater than 90');
  });
});
