import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OverpassService } from './overpass/overpass.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Landmark } from './landmarks/landmark.entity/landmark.entity';
import { CacheService } from './cache/cache.service';
import { LandmarksController } from './landmarks/landmarks.controller';
import { LandmarksService } from './landmarks/landmarks.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH'),
        entities: [Landmark],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Landmark]),
  ],
  controllers: [AppController, WebhookController, LandmarksController],
  providers: [AppService, WebhookService, OverpassService, CacheService, LandmarksService],
})
export class AppModule {}
