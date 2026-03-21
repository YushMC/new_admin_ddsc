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

export const useMods = () => {
  return {
    fetchMods,
    fetchModsAdmin,
    fetchModByIDAdmin,
    fetchModByID,
  };
};
