import {
  Body,
  Controller,
  Post,
  Headers,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookDto } from './dto/webhook.dto';
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Secret key for authentication',
  })
  @ApiBody({ type: WebhookDto })
  @ApiResponse({
    status: 200,
    description: 'Coordinates processed successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async handleWebhook(
    @Body() payload: WebhookDto,
    @Headers('Authorization') authHeader: string,
  ) {
    if (!this.webhookService.validateAuthHeader(authHeader)) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    const attractions = await this.webhookService.processCoordinates(payload);
    return { message: 'Coordinates processed successfully', attractions };
  }
}
