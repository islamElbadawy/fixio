export interface ApiMeta {
  count?: number;
  [key: string]: unknown;
}

export class ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: ApiMeta;
  timestamp: string;

  private constructor(partial: Partial<ApiResponse<T>>) {
    this.success = partial.success ?? true;
    this.data = partial.data;
    this.message = partial.message;
    this.meta = partial.meta;
    this.timestamp = new Date().toISOString();
  }

  static ok<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse({ success: true, data, message });
  }

  static list<T>(data: T[], message?: string): ApiResponse<T[]> {
    return new ApiResponse({
      success: true,
      data,
      message,
      meta: { count: data.length },
    });
  }

  static created<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse({
      success: true,
      data,
      message: message ?? 'Created successfully',
    });
  }

  static noContent(message?: string): ApiResponse<null> {
    return new ApiResponse({
      success: true,
      data: null,
      message: message ?? 'Operation completed successfully',
    });
  }
}
