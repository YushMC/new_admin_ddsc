type Status =
  | "under_development"
  | "stable"
  | "beta"
  | "legacy"
  | "abandoned"
  | "unknown"
  | "archived"
  | "on_ice";

type Duration =
  | "short"
  | "very_short"
  | "medium"
  | "long"
  | "very_long"
  | "endless"
  | "unknown";

type Images = "logo" | "main" | "screenshot";

type Character = "monika" | "sayori" | "natsuki" | "yuri" | "mc" | "oc";

type ModType = "translation" | "original";

interface Mod {
  id: number;
  name: string;
  description: string;
  slug: string;
  duration: Duration;
  character: Character;
  status: Status;
  type: ModType;
  images: ImagesInterface[];
  genres: string[];
  required_revision: boolean;
  download_pc: string | null;
  download_android: string | null;
  created_at?: string;
  comments?: string | null;
}

interface ImagesInterface {
  url: string;
  type: Images;
  id: number;
  mod_id: number;
}

interface ModResponse {
  resource: Mod;
  info: InfoDetail;
  credits: CreditsResponse;
}

interface CreditsResponse {
  creators: string[];
  porters: string[];
  translators: string[];
}
