import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';

@ApiTags('App')
@Public()
@Controller()
export class AppController {
  @Get('/health')
  getHealth(): string {
    return 'OK';
  }
}
