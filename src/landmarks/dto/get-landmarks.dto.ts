import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLandmarksDto {
  @IsNumber({}, { message: 'lat must be a number' })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber({}, { message: 'lat must be a number' })
  @IsNotEmpty()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  lng: number;
}
