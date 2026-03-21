type NotificationsStatus = "UNREAD" | "READ";
type NotificationsType =
  | "MOD_PENDING_REVIEW"
  | "MOD_APPROVED"
  | "MOD_REJECTED"
  | "MOD_DELETED"
  | "MOD_RESTORED";

interface NotificationsData {
  id: number;
  id_mod: number;
  id_user: number;
  title: string;
  message: string;
  mod_name: string;
  status: NotificationsTypem;
  type: NotificationsType;
  created_at: string;
  action_by: string;
  read_at: string;
  updated_at: string;
  is_active: boolean;
}
