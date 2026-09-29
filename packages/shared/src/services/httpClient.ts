export interface HttpClientConfig {
  baseUrl?: string;
}

export interface HttpResponse<T = unknown> {
  data: T;
  ok: boolean;
  status: number;
}

export function createHttpClient(config: HttpClientConfig = {}) {
  const baseUrl = config.baseUrl ?? '';
  const buildUrl = (path: string) =>
    /^https?:\/\//.test(path) ? path : `${baseUrl}${path}`;

  return {
    async get<T = unknown>(path: string): Promise<HttpResponse<T>> {
      const response = await fetch(buildUrl(path));
      const data = (await response.json().catch(() => null)) as T;
      return {data, ok: response.ok, status: response.status};
    },
  };
}
