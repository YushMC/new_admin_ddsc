type responseStatusData = "success" | "error";

type rolesNames = "editor" | "uploader";

interface InfoDetail {
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  is_active: boolean;
  deleted_at?: string;
  deleted_by?: string;
}

interface ReturnDataFromFetch<T = any> {
  data?: T;
  success: boolean;
  message: string;
}

interface responseDataFromFetch<T = any> {
  data: T | null;
  response: responseStatusData;
  message: string;
}
