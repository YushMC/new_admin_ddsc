const fetchAllModsCollection = async (modID: number) =>
  await getFetchWithToken<ModsCollectionResponse[]>(
    "MODS-COLLECTIONS-ADMIN",
    `mod/${modID}`,
  );

const fetchCreateModCollection = async (modID: number, collectionID: number) =>
  await postFetchWithToken("MODS-COLLECTIONS", "", {
    mod_id: modID,
    collection_id: collectionID,
  });

const fetchUpdateModStatusCollection = async (
  modID: number,
  is_active: boolean,
) =>
  await patchFetchWithToken("MODS-COLLECTIONS-ADMIN", `status/${modID}`, {
    is_active,
  });

const fetchUpdateModCollection = async (modID: number, collection_id: number) =>
  await putFetchWithToken("MODS-COLLECTIONS", String(modID), {
    collection_id,
  });

const useModsCollections = () => {
  return {
    fetchAllModsCollection,
    fetchCreateModCollection,
    fetchUpdateModStatusCollection,
    fetchUpdateModCollection,
  };
};

export default useModsCollections;
