import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OverpassService } from '../overpass/overpass.service';
import { WebhookDto } from './dto/webhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly overpassService: OverpassService,
  ) {}

  validateAuthHeader(authHeader: string): boolean {
    const secret = this.configService.get<string>('WEBHOOK_SECRET');
    return authHeader === `Bearer ${secret}`;
  }

  async processCoordinates(payload: WebhookDto): Promise<any> {
    const { lat, lng } = payload;

    const attractions = await this.overpassService.getNearbyAttractions(
      lat,
      lng,
    );

    console.log('Nearby attractions:', attractions);

    return attractions;
  }
}
