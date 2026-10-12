import type { Response } from 'express';
import type { ApiResponse as ApiResponseBody, Pagination } from 'shared/types/api';
import { HTTP_STATUS, type HttpStatus } from '~/shared/presentation/http-status';

const send = <T>(
  res: Response,
  status: HttpStatus,
  message: string,
  data?: T | null,
  pagination?: Pagination,
) => {
  const body: ApiResponseBody<T> = {
    success: true,
    message,
    data: data ?? null,
    ...(pagination && { pagination }),
  };
  return res.status(status).json(body);
};

export const ApiResponse = {
  ok<T>(res: Response, data?: T | null, message = 'OK') {
    return send(res, HTTP_STATUS.OK, message, data);
  },

  created<T>(res: Response, data?: T | null, message = 'Created') {
    return send(res, HTTP_STATUS.CREATED, message, data);
  },

  deleted(res: Response) {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  },

  paginated<T>(
    res: Response,
    data: T,
    pagination: { page: number; limit: number; totalItems: number },
    message = 'OK',
  ) {
    return send(res, HTTP_STATUS.OK, message, data, {
      ...pagination,
      totalPages: Math.ceil(pagination.totalItems / pagination.limit),
    });
  },
};
