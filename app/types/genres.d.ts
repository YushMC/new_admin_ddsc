interface Genre {
  id: number;
  name: string;
  identifier: string;
}

interface GenreResponse {
  resource: Genre;
  info: InfoDetail;
}
