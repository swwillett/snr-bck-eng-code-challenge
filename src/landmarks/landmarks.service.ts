import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Landmark } from './landmark.entity/landmark.entity';
import { CacheService } from '../cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LandmarksService {
  constructor(
    @InjectRepository(Landmark)
    private readonly landmarkRepository: Repository<Landmark>,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  async getLandmarks(lat: number, lng: number): Promise<any> {
    const OVERPASS_RADIUS = this.configService.get<number>('OVERPASS_RADIUS');

    const cacheKey = this.cacheService.getCacheKey(lat, lng);
    const cachedLandmarks = this.cacheService.get(cacheKey);

    if (cachedLandmarks) {
      return {
        message: 'Landmarks retrieved from cache',
        landmarksCount: cachedLandmarks.length,
        landmarks: cachedLandmarks,
      };
    }

    const landmarks = await this.landmarkRepository
      .createQueryBuilder('landmark')
      .where(
        `
        ABS(
          6371000 * 2 * ASIN(SQRT(
            POWER(SIN((RADIANS(:lat - landmark.lat)) / 2), 2) +
            COS(RADIANS(landmark.lat)) * COS(RADIANS(:lat)) *
            POWER(SIN((RADIANS(:lng - landmark.lng)) / 2), 2)
          ))
        ) <= :radius
      `,
        { lat, lng, radius: Number(OVERPASS_RADIUS) },
      )
      .getMany();

    if (landmarks.length === 0) {
      return {
        message: 'No landmarks found',
        landmarksCount: 0,
        landmarks: [],
      };
    }

    this.cacheService.set(cacheKey, landmarks);

    return {
      message: 'Landmarks retrieved from database',
      landmarksCount: landmarks.length,
      landmarks,
    };
  }
}
