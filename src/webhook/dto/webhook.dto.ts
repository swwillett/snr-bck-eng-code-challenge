import { IsNumber, IsNotEmpty } from 'class-validator';

export class WebhookDto {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;
}
