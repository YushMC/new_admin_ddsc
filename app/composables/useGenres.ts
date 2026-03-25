const fetchAllGenres = async () => {
  return await getFetchWithToken<GenreResponse[]>("GENRES-ADMIN", "all");
};

const fetchAllGenresForSelect = async () =>
  await getFetchWithToken<GenreResponse[]>("GENRES", "");

const fetchSaveGenre = async (name: string) => {
  return await postFetchWithToken<GenreResponse>("GENRES", "", { name });
};

const fetchUpdateGenre = async (id: number, name: string) => {
  return await putFetchWithToken<GenreResponse>("GENRES", `${id}`, { name });
};

const fetchUpdateStatusGenre = async (id: number, is_active: boolean) => {
  return await patchFetchWithToken<GenreResponse>("GENRES", `status/${id}`, {
    is_active,
  });
};

const fetchAddGenreToMod = async (modId: number, genre_ids: number[]) =>
  await postFetchWithToken("MODS", `${modId}/genres`, { genre_ids });

const useGenres = () => {
  return {
    fetchAllGenres,
    fetchSaveGenre,
    fetchUpdateGenre,
    fetchUpdateStatusGenre,
    fetchAllGenresForSelect,
    fetchAddGenreToMod,
  };
};

export default useGenres;
