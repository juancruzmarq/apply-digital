export interface StandardResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  statusText: string;
}

export interface ExternalAPIResponse {
  sys: Sys;
  total: number;
  skip: number;
  limit: number;
  items: Item[];
}

export interface Sys {
  type: string;
}

export interface Item {
  metadata: Metadata;
  sys: Sys2;
  fields: Fields;
}

export interface Metadata {
  tags: any[];
  concepts: any[];
}

export interface Sys2 {
  space: Space;
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: Environment;
  publishedVersion: number;
  revision: number;
  contentType: ContentType;
  locale: string;
}

export interface Space {
  sys: Sys3;
}

export interface Sys3 {
  type: string;
  linkType: string;
  id: string;
}

export interface Environment {
  sys: Sys4;
}

export interface Sys4 {
  id: string;
  type: string;
  linkType: string;
}

export interface ContentType {
  sys: Sys5;
}

export interface Sys5 {
  type: string;
  linkType: string;
  id: string;
}

export interface Fields {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
}
