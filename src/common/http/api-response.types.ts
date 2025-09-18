export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface ApiSuccess<T> {
  ok: true;
  statusCode: number;
  message?: string;
  data: T;
  meta?: PaginationMeta | Record<string, any>;
  timestamp: string;
  path?: string;
  requestId?: string;
}

export interface ApiError {
  ok: false;
  statusCode: number;
  message: string;
  error: string;
  details?: any;
  timestamp: string;
  path?: string;
  requestId?: string;
}

export interface PaginationMeta {
  total: number;
  skip: number; // offset
  take: number; // limit
  count: number; // items
  hasMore: boolean;
}
