import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OverpassService } from './overpass/overpass.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService, WebhookService, OverpassService],
})
export class AppModule {}
