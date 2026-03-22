type responseStatusData = "success" | "error";

type rolesNames = "editor" | "uploader" | "owner";

interface InfoDetail {
  created_at: string;
  updated_at: string;
  created_by: User;
  updated_by: User;
  is_active: boolean;
  deleted_at?: string;
  deleted_by?: User;
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
