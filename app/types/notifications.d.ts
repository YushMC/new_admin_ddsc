type NotificationsStatus = "unread" | "read";
type NotificationsType =
  | "mod_pending_review"
  | "mod_approved"
  | "mod_rejected"
  | "mod_deleted"
  | "mod_restored";

interface NotificationsData {
  id: number;
  id_mod: number;
  id_user: number;
  title: string;
  message: string;
  mod_name: string;
  status: NotificationsStatus;
  type: NotificationsType;
  created_at: string;
  action_by: string;
  read_at: string;
  updated_at: string;
  is_active: boolean;
}
