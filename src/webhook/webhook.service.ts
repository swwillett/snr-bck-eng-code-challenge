import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OverpassService } from '../overpass/overpass.service';
import { WebhookDto } from './dto/webhook.dto';
import { LandmarksService } from '../landmarks/landmarks.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly overpassService: OverpassService,
    private readonly landmarksService: LandmarksService,
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
    let landmarks;

    if (attractions.length > 0) {
      landmarks = await this.landmarksService.createLandmarks(
        attractions,
        lat,
        lng,
      );
    } else {
      landmarks = [
        await this.landmarksService.createFallbackLandmark(lat, lng),
      ];
    }

    return landmarks;
  }
}
