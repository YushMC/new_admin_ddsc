const fetchAllCollections = async () => {
  return await getFetchWithToken<CollectionResponse[]>(
    "COLLECTIONS-ADMIN",
    "all",
  );
};

const fetchAllCollectionsWithSkipAndLimit = async (
  skip: number,
  limit: number,
) => {
  return await getFetchWithToken<CollectionResponse[]>(
    "COLLECTIONS-ADMIN",
    `all?skip=${skip}&limit=${limit}`,
  );
};

const fetchSaveCollection = async (data: Collection) => {
  return await postFetchWithToken<CollectionResponse>("COLLECTIONS", "", data);
};

const fetchUpdateCollection = async (id: number, data: Collection) => {
  return await putFetchWithToken<CollectionResponse>(
    "COLLECTIONS",
    `${id}`,
    data,
  );
};

const fetchUpdateStatusCollection = async (id: number, is_active: boolean) => {
  return await patchFetchWithToken<CollectionResponse>(
    "COLLECTIONS",
    `status/${id}`,
    {
      is_active,
    },
  );
};

const useCollections = () => {
  return {
    fetchAllCollections,
    fetchSaveCollection,
    fetchUpdateCollection,
    fetchUpdateStatusCollection,
    fetchAllCollectionsWithSkipAndLimit,
  };
};

export default useCollections;
