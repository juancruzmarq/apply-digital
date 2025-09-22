import { Module } from '@nestjs/common';
import { ColorService } from './color.service';

@Module({
  providers: [ColorService],
})
export class ColorModule {}
