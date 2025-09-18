import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ExternalAPIResponse } from '../../common/types/response.types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductFetcher {
  private readonly logger: Logger = new Logger(ProductFetcher.name);
  private readonly apiUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    const spaceId = this.config.get<string>('CONTENTFUL_SPACE_ID');
    const environment = this.config.get<string>('CONTENTFUL_ENVIRONMENT');
    const accessToken = this.config.get<string>('CONTENTFUL_ACCESS_TOKEN');
    const contentType = this.config.get<string>('CONTENTFUL_CONTENT_TYPE');

    this.apiUrl = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=${contentType}`;
  }

  async fetchProducts() {
    this.logger.log(`Fetching products from ${this.apiUrl}`);

    try {
      const data = await firstValueFrom(
        this.http.get<ExternalAPIResponse>(this.apiUrl),
      ).then((response) => response.data);

      return data;
    } catch (error) {
      this.logger.error('Error fetching products', error);
      throw error;
    }
  }
}
