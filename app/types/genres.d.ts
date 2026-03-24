interface Genre {
  id: number;
  name: string;
  identifier: string;
}

interface GenreResponse {
  resource: Genre;
  info: InfoDetail;
}

interface ModGenre {
  id: number;
  mod_id: number;
  genre: Genre;
}

interface ModGenreResponse {
  resource: ModGenre;
  info: InfoDetail;
}
