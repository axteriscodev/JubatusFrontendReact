export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface ApiRequestParams {
  api: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: BodyInit | null;
  needAuth?: boolean;
  contentType?: string;
}

export interface ActionResult<T = null> {
  success: boolean;
  data: T | null;
}
