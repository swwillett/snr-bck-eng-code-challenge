import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class WebhookDto {
  @IsNumber({}, { message: 'lat must be a number' })
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber({}, { message: 'lng must be a number' })
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  lng: number;
}
