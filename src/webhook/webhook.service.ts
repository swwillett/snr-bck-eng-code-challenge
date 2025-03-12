import { Injectable } from '@nestjs/common';
import { WebhookDto } from './dto/webhook.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  constructor(private readonly configService: ConfigService) {}

  validateAuthHeader(authHeader: string): boolean {
    const secret = this.configService.get<string>('WEBHOOK_SECRET');
    return authHeader === `Bearer ${secret}`;
  }

  processCoordinates(payload: WebhookDto): string {
    console.log('Received coordinates:', payload);
    return 'Coordinates processed successfully';
  }
}
