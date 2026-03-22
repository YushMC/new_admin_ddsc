type allRolesUser = "owner" | "editor" | "uploader";
type allTypesCredits = "original_creator" | "translator" | "porter";

interface tokenData {
  exp: number;
  sub: string;
  name: string;
  role: allRolesUser;
  logo: string;
  about_me: string;
  contact: string;
}

interface User {
  id: number;
  name: string;
  logo: string | null;
  role: allRolesUser;
  contact: string | null;
  about_me: string | null;
  is_active: boolean;
}

interface Credit {
  id_user: number | null;
  name: string | null;
  type: allTypesCredits;
}
