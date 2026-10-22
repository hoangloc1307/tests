import { request } from 'undici';

export interface HttpClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
  auth?: {
    username: string;
    password: string;
  };
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly timeout: number;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout ?? 10000;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (config.auth) {
      const credentials = Buffer.from(`${config.auth.username}:${config.auth.password}`).toString(
        'base64',
      );
      this.headers['Authorization'] = `Basic ${credentials}`;
    }
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<HttpResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(this.toStringParams(params)).toString()
      : '';
    return this.request<T>('GET', `${url}${queryString}`);
  }

  async post<T>(url: string, data?: unknown): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, data);
  }

  async put<T>(url: string, data?: unknown): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, data);
  }

  async delete<T>(url: string, params?: Record<string, unknown>): Promise<HttpResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(this.toStringParams(params)).toString()
      : '';
    return this.request<T>('DELETE', `${url}${queryString}`);
  }

  private async request<T>(method: string, url: string, body?: unknown): Promise<HttpResponse<T>> {
    const response = await request(`${this.baseUrl}${url}`, {
      method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
      bodyTimeout: this.timeout,
      headersTimeout: this.timeout,
    });

    const status = response.statusCode;

    const text = await response.body.text();
    if (!text) {
      return { data: undefined as T, status };
    }

    const data = JSON.parse(text) as T;
    return { data, status };
  }

  private toStringParams(params: Record<string, unknown>): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        result[key] = String(value);
      }
    }
    return result;
  }
}
