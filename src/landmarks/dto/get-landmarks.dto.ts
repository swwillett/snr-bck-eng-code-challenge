import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLandmarksDto {
  @IsNumber({}, { message: 'lat must be a number' })
  @IsNotEmpty()
  @Type(() => Number)
  lat: number;

  @IsNumber({}, { message: 'lat must be a number' })
  @IsNotEmpty()
  @Type(() => Number)
  lng: number;
}
