const fetchModsAdmin = async (): Promise<
  ReturnDataFromFetch<ModResponse[]>
> => {
  try {
    return await getFetchWithToken<ModResponse[]>("MODS-ADMIN", `all`);
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

const fetchModsAdminWithSkipAndLimit = async (skip: number, limit: number) => {
  try {
    return await getFetchWithToken<ModResponse[]>(
      "MODS-ADMIN",
      `all?skip=${skip}&limit=${limit}`,
    );
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

const fetchAllModsInRevision = async () =>
  await getFetchWithToken<ModResponse[]>("MODS-ADMIN", "revision");

const fetchAllModsInRevisionWithSkipAndLimit = async (
  skip: number,
  limit: number,
) =>
  await getFetchWithToken<ModResponse[]>(
    "MODS-ADMIN",
    `revision?skip=${skip}&limit=${limit}`,
  );

const fetchModByIDAdmin = async (
  id: number,
): Promise<ReturnDataFromFetch<ModResponse>> => {
  try {
    return await getFetchWithToken<ModResponse>("MODS-ADMIN", String(id));
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

const fetchMods = async (): Promise<ReturnDataFromFetch<ModResponse[]>> => {
  try {
    return await getFetchWithToken<ModResponse[]>("MODS", `all`);
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

const fetchModByID = async (
  id: number,
): Promise<ReturnDataFromFetch<ModResponse>> => {
  try {
    return await getFetchWithToken<ModResponse>("MODS", String(id));
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

const fetchMyMods = async () =>
  await getFetchWithToken<ModResponse[]>("MODS", "my-mods");

const fetchMyModsWithSkipAndLimit = async (skip: number, limit: number) =>
  await getFetchWithToken<ModResponse[]>(
    "MODS",
    `my-mods?skip=${skip}&limit=${limit}`,
  );

export const useMods = () => {
  return {
    fetchMods,
    fetchModsAdmin,
    fetchModByIDAdmin,
    fetchModByID,
    fetchMyMods,
    fetchMyModsWithSkipAndLimit,
    fetchAllModsInRevision,
    fetchAllModsInRevisionWithSkipAndLimit,
    fetchModsAdminWithSkipAndLimit,
  };
};
