import { ApiResponse, ResponseStatus } from "types/api-response";

function inferResponseStatus(code: number): ResponseStatus {
  return code >= 200 && code < 300 ? 'success' : 'error';
}

export function createResponse<T extends object = {}>(
  code: number,
  message: string,
  data?: T
): ApiResponse<T> {
  return {
    code,
    status: inferResponseStatus(code),
    data: {
      message,
      ...(data ?? {}) as T
    }
  };
}

// === Success Responses ===

/**
 * Returns a 200 OK API response with a message and optional data payload.
 *
 * @param message - A message describing the response outcome. Defaults to "OK".
 * @param data - Optional additional data to include in the response payload.
 * @returns An API response object.
 */
export function OK(message?: string): ApiResponse<{}>;
export function OK<T extends object>(message: string, data: T): ApiResponse<T>;
export function OK<T extends object>(
  message: string = 'OK',
  data?: T
): ApiResponse<T | {}> {
  return createResponse(200, message, data ?? {} as T);
}

/**
 * Returns a 201 Created API response with a message and optional data payload.
 *
 * @param message - A message describing the response outcome. Defaults to "Created".
 * @param data - Optional additional data to include in the response payload.
 * @returns An API response object.
 */
export function Created(message?: string): ApiResponse<{}>;
export function Created<T extends object>(message: string, data: T): ApiResponse<T>;
export function Created<T extends object>(
  message: string = 'Created',
  data?: T
): ApiResponse<T | {}> {
  return createResponse(201, message, data ?? {} as T);
}

// === Client Error Responses ===

/**
 * Returns a 400 Bad Request API response with a message and optional data payload.
 *
 * @param message - A message describing the response outcome. Defaults to "Bad Request".
 * @param data - Optional additional data to include in the response payload.
 * @returns An API response object.
 */
export function BadRequest(message?: string): ApiResponse<{}>;
export function BadRequest<T extends object>(message: string, data: T): ApiResponse<T>;
export function BadRequest<T extends object>(
  message: string = 'Bad Request',
  data?: T
): ApiResponse<T | {}> {
  return createResponse(400, message, data ?? {} as T);
}

/**
 * Returns a 401 Unauthorized API response with a message and optional data payload.
 *
 * @param message - A message describing the response outcome. Defaults to "Unauthorized".
 * @param data - Optional additional data to include in the response payload.
 * @returns An API response object.
 */
export function Unauthorized(message?: string): ApiResponse<{}>;
export function Unauthorized<T extends object>(message: string, data: T): ApiResponse<T>;
export function Unauthorized<T extends object>(
  message: string = 'Unauthorized',
  data?: T
): ApiResponse<T | {}> {
  return createResponse(401, message, data ?? {} as T);
}

/**
 * Returns a 403 Forbidden API response with a message and optional data payload.
 *
 * @param message - A message describing the response outcome. Defaults to "Forbidden".
 * @param data - Optional additional data to include in the response payload.
 * @returns An API response object.
 */
export function Forbidden(message?: string): ApiResponse<{}>;
export function Forbidden<T extends object>(message: string, data: T): ApiResponse<T>;
export function Forbidden<T extends object>(
  message: string = 'Forbidden',
  data?: T
): ApiResponse<T | {}> {
  return createResponse(403, message, data ?? {} as T);
}

/**
 * Returns a 404 Not Found API response with a message and optional data payload.
 *
 * @param message - A message describing the response outcome. Defaults to "Not Found".
 * @param data - Optional additional data to include in the response payload.
 * @returns An API response object.
 */
export function NotFound(message?: string): ApiResponse<{}>;
export function NotFound<T extends object>(message: string, data: T): ApiResponse<T>;
export function NotFound<T extends object>(
  message: string = 'Not Found',
  data?: T
): ApiResponse<T | {}> {
  return createResponse(404, message, data ?? {} as T);
}

/**
 * Returns a 429 Too Many Requests API response with a message and optional data payload.
 *
 * @param message - A message describing the response outcome. Defaults to "Too Many Requests, Try Again Later".
 * @param data - Optional additional data to include in the response payload.
 * @returns An API response object.
 */
export function TooManyRequests(message?: string): ApiResponse<{}>;
export function TooManyRequests<T extends object>(message: string, data: T): ApiResponse<T>;
export function TooManyRequests<T extends object>(
  message: string = 'Too Many Requests, Try Again Later',
  data?: T
): ApiResponse<T | {}> {
  return createResponse(429, message, data ?? {} as T);
}

// === Server Error Responses ===

/**
 * Returns a 500 Internal Server Error API response with a message and optional data payload.
 *
 * @param message - A message describing the response outcome. Defaults to "Internal Server Error".
 * @param data - Optional additional data to include in the response payload.
 * @returns An API response object.
 */
export function InternalServerError(message?: string): ApiResponse<{}>;
export function InternalServerError<T extends object>(message: string, data: T): ApiResponse<T>;
export function InternalServerError<T extends object>(
  message: string = 'Internal Server Error',
  data?: T
): ApiResponse<T | {}> {
  return createResponse(500, message, data ?? {} as T);
}

/**
 * Returns a 501 Not Implemented API response with a message and optional data payload.
 *
 * @param message - A message describing the response outcome. Defaults to "Not Implemented".
 * @param data - Optional additional data to include in the response payload.
 * @returns An API response object.
 */
export function NotImplemented(message?: string): ApiResponse<{}>;
export function NotImplemented<T extends object>(message: string, data: T): ApiResponse<T>;
export function NotImplemented<T extends object>(
  message: string = 'Not Implemented',
  data?: T
): ApiResponse<T | {}> {
  return createResponse(501, message, data ?? {} as T);
}