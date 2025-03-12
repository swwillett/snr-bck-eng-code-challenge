import { IsNumber, IsNotEmpty } from 'class-validator';

export class WebhookDto {
  @IsNumber({}, { message: 'lat must be a number' })
  @IsNotEmpty()
  lat: number;

  @IsNumber({}, { message: 'lng must be a number' })
  @IsNotEmpty()
  lng: number;
}
