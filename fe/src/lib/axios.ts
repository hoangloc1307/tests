import axios from 'axios';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { toast } from '~/components/ui/toast';
import CONFIG from '~/configs/app';
import { HttpClient } from '~/lib/http-client';
import { buildUrl } from '~/lib/utils';
import { useAuthStore } from '~/stores/auth';

// ============================================================
// API chính (backend ITAM)
// ============================================================

const REFRESH_URL = buildUrl(ENDPOINTS.AUTH.PREFIX, ENDPOINTS.AUTH.REFRESH);

/**
 * 401 từ các route này không phải do access token hết hạn (đăng nhập sai, refresh token
 * hết hạn...) nên không refresh; riêng REFRESH_URL còn để tránh vòng lặp refresh.
 */
const SKIP_REFRESH_URLS = [
  buildUrl(ENDPOINTS.AUTH.PREFIX, ENDPOINTS.AUTH.LOGIN),
  buildUrl(ENDPOINTS.AUTH.PREFIX, ENDPOINTS.AUTH.LOGIN_WITH_CARD),
  REFRESH_URL,
];

/** Lỗi do hết phiên (refresh thất bại): interceptor đã báo toast + chuyển về login. */
const sessionExpiredErrors = new WeakSet<object>();

const markSessionExpired = (error: unknown) => {
  if (typeof error === 'object' && error !== null) sessionExpiredErrors.add(error);
};

export const isSessionExpiredError = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && sessionExpiredErrors.has(error);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
}

const api = new HttpClient(
  {
    baseURL: CONFIG.MAIN_API_URL,
    withCredentials: true,
  },
  (ins) => {
    ins.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    ins.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status !== 401 ||
          originalRequest._retry ||
          SKIP_REFRESH_URLS.some((url) => originalRequest.url?.includes(url))
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return ins(originalRequest);
          });
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const { data } = await axios.post(
            `${ins.defaults.baseURL}${REFRESH_URL}`,
            {},
            { withCredentials: true },
          );
          const newToken = data.data.token;
          useAuthStore.getState().setToken(newToken);
          //   if (data.data.permissions) {
          //     useAuthStore.getState().setPermissions(data.data.permissions);
          //   }
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return ins(originalRequest);
        } catch (refreshError) {
          // Đánh dấu trước khi reject để global error handler không hiện thêm toast;
          // các request đang chờ trong queue cũng reject bằng chính lỗi này.
          markSessionExpired(refreshError);
          processQueue(refreshError, null);
          useAuthStore.getState().logout();
          toast.add({ type: 'error', title: 'Phiên đăng nhập hết hạn' });
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      },
    );
  },
);

// ============================================================
// HR API
// ============================================================

export const hrApi = new HttpClient({
  baseURL: CONFIG.HR_API_URL,
});

// ============================================================
// Master API
// ============================================================

export const masterApi = new HttpClient(
  {
    baseURL: CONFIG.MASTER_API_URL,
  },
  (ins) => {
    ins.interceptors.request.use((config) => {
      const vnnToken = useAuthStore.getState().vnnToken;
      if (vnnToken) {
        config.headers.Authorization = `Bearer ${vnnToken}`;
      }
      return config;
    });
  },
);

// ============================================================

export default api;
