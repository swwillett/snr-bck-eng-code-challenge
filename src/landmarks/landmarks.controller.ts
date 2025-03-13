import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LandmarksService } from './landmarks.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetLandmarksDto } from './dto/get-landmarks.dto';

@ApiTags('landmarks')
@Controller('landmarks')
export class LandmarksController {
  constructor(private readonly landmarksService: LandmarksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'lat', type: Number, required: true })
  @ApiQuery({ name: 'lng', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Landmarks retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getLandmarks(@Query() query: GetLandmarksDto) {
    const { lat, lng } = query;
    return this.landmarksService.getLandmarks(lat, lng);
  }
}
