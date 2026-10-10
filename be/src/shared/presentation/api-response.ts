import type { Response } from 'express';
import type { ApiResponse as ApiResponseBody } from 'shared/types/api';
import { HTTP_STATUS } from '~/shared/presentation/http-status';

/**
 * Serializes successful responses into the shared API envelope.
 * Lives in the presentation layer — it depends on Express.
 */
export const ApiResponse = {
  ok<T>(res: Response, data: T | null = null, message = 'OK') {
    const body: ApiResponseBody<T> = { success: true, message, data };
    return res.status(HTTP_STATUS.OK).json(body);
  },

  created<T>(res: Response, data: T | null = null, message = 'Created') {
    const body: ApiResponseBody<T> = { success: true, message, data };
    return res.status(HTTP_STATUS.CREATED).json(body);
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
    const body: ApiResponseBody<T> = {
      success: true,
      message,
      data,
      pagination: {
        ...pagination,
        totalPages: Math.ceil(pagination.totalItems / pagination.limit),
      },
    };
    return res.status(HTTP_STATUS.OK).json(body);
  },
};
