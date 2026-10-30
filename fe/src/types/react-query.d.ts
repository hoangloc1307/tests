import '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from 'shared/types/api';

interface GlobalErrorMeta extends Record<string, unknown> {
  skipGlobalError?: boolean;
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError<ApiResponse<unknown>>;
    queryMeta: GlobalErrorMeta;
    mutationMeta: GlobalErrorMeta;
  }
}
