const fetchAllModsGenres = async (modID: number) =>
  await getFetchWithToken("MODS-GENRES-ADMIN", `mod/${modID}`);

const fetchCreateModGenre = async (modID: number, genreID: number) =>
  await postFetchWithToken("MODS-GENRES", "", {
    mod_id: modID,
    genre_id: genreID,
  });

const fetchUpdateStatusModGenre = async (modID: number, is_active: boolean) =>
  await patchFetchWithToken("MODS-GENRES-ADMIN", `status/${modID}`, {
    is_active,
  });

const fetchUpdateModGenre = async (modID: number, genre_id: number) =>
  await putFetchWithToken("MODS-GENRES", String(modID), {
    genre_id,
  });

const useModsGenres = () => {
  return {
    fetchAllModsGenres,
    fetchCreateModGenre,
    fetchUpdateStatusModGenre,
    fetchUpdateModGenre,
  };
};

export default useModsGenres;
