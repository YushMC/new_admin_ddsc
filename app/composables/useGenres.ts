const fetchAllGenres = async () => {
  return await getFetchWithToken<GenreResponse[]>("GENRES-ADMIN", "all");
};

const fetchAllGenresWithSkipAndLimit = async (skip: number, limit: number) => {
  return await getFetchWithToken<GenreResponse[]>(
    "GENRES-ADMIN",
    `all?skip=${skip}&limit=${limit}`,
  );
};

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

const useGenres = () => {
  return {
    fetchAllGenres,
    fetchSaveGenre,
    fetchUpdateGenre,
    fetchUpdateStatusGenre,
    fetchAllGenresWithSkipAndLimit,
  };
};

export default useGenres;
