import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ArrayOfStringValidationPipe implements PipeTransform<any> {
  transform(value: string): string[] {
    if (!value) return [];

    const str = value.trim().split(',');

    for (const s of str) {
      if (typeof s !== 'string' || s.trim() === '') {
        throw new BadRequestException(`Not a valid string: ${s}`);
      }
    }

    return value.split(',').map((s) => s.trim());
  }
}
