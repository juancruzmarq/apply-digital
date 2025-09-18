import { SetMetadata } from '@nestjs/common';
export const RAW_RESPONSE_KEY = 'SKIP_WRAP';
export const RawResponse = () => SetMetadata(RAW_RESPONSE_KEY, true);
