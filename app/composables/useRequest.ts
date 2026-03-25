const fetchApproveOrRejectMod = async (
  modID: number,
  data: { status: "approve" | "reject"; comments?: string },
) =>
  await putFetchWithToken("MODS", `status/request/${modID}`, {
    status: data.status,
    comments: data.comments ?? null,
  });

const fetchMyModsInRevision = async () =>
  await getFetchWithToken<ModResponse[]>("MODS", `my-mods/revision`);

const getMyModInRevision = async (id_mod: number) =>
  await getFetchWithToken<ModResponse>("MODS", `my-mods/revision/${id_mod}`);

const fetchAllModsInRevision = async () =>
  await getFetchWithToken<ModResponse[]>("MODS-ADMIN", `revision`);

const useRequest = () => {
  return {
    fetchApproveOrRejectMod,
    fetchMyModsInRevision,
    getMyModInRevision,
    fetchAllModsInRevision,
  };
};

export default useRequest;
