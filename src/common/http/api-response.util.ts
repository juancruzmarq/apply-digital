import { PaginationMeta, ApiSuccess, ApiError } from './api-response.types';

export function ok<T>(
  data: T,
  statusCode = 200,
  message?: string,
  meta?: PaginationMeta | Record<string, any>,
): ApiSuccess<T> {
  return {
    ok: true,
    statusCode,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
}

export function created<T>(data: T, message = 'Created'): ApiSuccess<T> {
  return ok<T>(data, 201, message);
}

export function paginated<T>(
  items: T[],
  total: number,
  skip?: number,
  take?: number,
  message = 'Fetched',
): ApiSuccess<T[]> {
  const count = items.length;
  const meta: PaginationMeta = {
    total,
    skip: skip ?? 0,
    take: take ?? 0,
    count,
    hasMore: total > (skip ?? 0) + count,
  };
  return ok<T[]>(items, 200, message, meta);
}

export function err(
  statusCode: number,
  message: string,
  error: string,
  details?: any,
): ApiError {
  return {
    ok: false,
    statusCode,
    message,
    error,
    details,
    timestamp: new Date().toISOString(),
  };
}
