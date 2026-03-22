const fetchAllGenres = async () => {
  return await getFetchWithToken<GenreResponse[]>("GENRES-ADMIN", "all");
};

const fetchSaveGenre = async (name: string) => {
  return await postFetchWithToken<GenreResponse>("GENRES", "", { name });
};

const useGenres = () => {
  return {
    fetchAllGenres,
    fetchSaveGenre,
  };
};

export default useGenres;
