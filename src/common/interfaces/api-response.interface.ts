export interface PaginatedData<T> {
  count: number;
  limit: number;
  page: number;
  pages: number;
  rows: T[];
}

export interface ApiResponseData<T> {
  data: T | null;
  message: string;
  status: number;
}
