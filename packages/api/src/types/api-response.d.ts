export type ResponseStatus = 'success' | 'error';

export interface ApiResponse<T = {}> {
  code: number;
  status: ResponseStatus;
  data: {
    message: string;
  } & T;
}