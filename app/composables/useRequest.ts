const fetchApproveOrRejectMod = async (
  modID: number,
  data: { status: "approve" | "reject"; comments?: string },
) =>
  await putFetchWithToken("MODS", `status/request/${modID}`, {
    status: data.status,
    comments: data.comments ?? null,
  });

const fetchMyModsInRevisionWithSkipAndLimit = async (
  skip: number,
  limit: number,
) =>
  await getFetchWithToken<ModResponse[]>(
    "MODS",
    `my-mods/revision?skip=${skip}&limit=${limit}`,
  );

const getMyModInRevision = async (id_mod: number) =>
  await getFetchWithToken<ModResponse>("MODS", `my-mods/revision/${id_mod}`);

const fetchAllModsInRevisionWithSkipAndLimit = async (
  skip: number,
  limit: number,
) =>
  await getFetchWithToken<ModResponse[]>(
    "MODS-ADMIN",
    `revision?skip=${skip}&limit=${limit}`,
  );

const useRequest = () => {
  return {
    fetchApproveOrRejectMod,
    fetchMyModsInRevisionWithSkipAndLimit,
    getMyModInRevision,
    fetchAllModsInRevisionWithSkipAndLimit,
  };
};

export default useRequest;
