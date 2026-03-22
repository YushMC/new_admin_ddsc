interface Stats {
  id: number;
  mod_name: string;
  searchs: number;
  download_android: number;
  download_pc: number;
}

interface StatsResponse {
  resource: Stats;
  info: InfoDetail;
}
