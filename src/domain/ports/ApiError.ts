export type ApiErrorStatus = 400 | 401 | 404 | 409 | 500;

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'EMAIL_ALREADY_EXISTS'
  | 'SUBDOMAIN_ALREADY_EXISTS'
  | 'NETWORK_ERROR';

export interface ApiErrorPayload {
  readonly status: ApiErrorStatus;
  readonly code: ApiErrorCode;
  readonly message: string;
}

/**
 * Error normalizado de frontera para contratos de API del CMS ShopMaker.
 */
export class ApiError extends Error implements ApiErrorPayload {
  readonly status: ApiErrorStatus;
  readonly code: ApiErrorCode;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.status = payload.status;
    this.code = payload.code;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
