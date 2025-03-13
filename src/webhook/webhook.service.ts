import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OverpassService } from '../overpass/overpass.service';
import { WebhookDto } from './dto/webhook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Landmark } from '../landmarks/landmark.entity/landmark.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly overpassService: OverpassService,
    @InjectRepository(Landmark)
    private readonly landmarkRepository: Repository<Landmark>,
    private readonly cacheService: CacheService,
  ) {}

  validateAuthHeader(authHeader: string): boolean {
    const WEBHOOK_SECRET = this.configService.get<string>('WEBHOOK_SECRET');
    return authHeader === `Bearer ${WEBHOOK_SECRET}`;
  }

  async processCoordinates(payload: WebhookDto): Promise<any> {
    const { lat, lng } = payload;

    const attractions = await this.overpassService.getNearbyAttractions(
      lat,
      lng,
    );

    let landmarks: Landmark[];

    if (attractions.length > 0) {
      landmarks = attractions.map((attraction) => {
        const landmark = new Landmark();
        landmark.name = attraction.tags?.name;
        landmark.type = attraction.type;
        landmark.lat = attraction.lat || lat;
        landmark.lng = attraction.lon || lng;
        landmark.originalRequest = false;
        return landmark;
      });

      await this.landmarkRepository.save(landmarks);
    } else {
      const landmark = new Landmark();
      landmark.name = 'No Attractions Found';
      landmark.type = 'fallback';
      landmark.lat = lat;
      landmark.lng = lng;
      landmark.originalRequest = true;

      await this.landmarkRepository.save(landmark);
      landmarks = [landmark];
    }

    const cacheKey = this.cacheService.getCacheKey(lat, lng);
    this.cacheService.set(cacheKey, landmarks);

    return landmarks;
  }
}
