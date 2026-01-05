export interface ApiError {
  status?: number;
  message: string;
  code?: string;
  response?: {
    status: number;
    data?: unknown;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  return 'message' in error && typeof (error as ApiError).message === 'string';
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
