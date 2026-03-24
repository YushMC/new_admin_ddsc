type methodsAlloweds = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
type prefixAlloweds =
  | "MODS"
  | "MODS-ADMIN"
  | "USERS"
  | "USERS-ADMIN"
  | "GENRES"
  | "GENRES-ADMIN"
  | "IMAGES"
  | "IMAGES-ADMIN"
  | "CREDITS"
  | "CREDITS-ADMIN"
  | "NOTIFICATIONS"
  | "STATISTICS"
  | "STATISTICS-ADMIN"
  | "COLLECTIONS"
  | "COLLECTIONS-ADMIN"
  | "MODS-COLLECTIONS"
  | "MODS-COLLECTIONS-ADMIN"
  | "MODS-GENRES"
  | "MODS-GENRES-ADMIN";

import CONSTANTS from "./constants";

const END_POINTS = {
  base: CONSTANTS.API_BASE_URL,
  mods: `${CONSTANTS.API_BASE_URL}/mod`,
  modsAdmin: `${CONSTANTS.API_BASE_URL}/mod/admin`,
  users: `${CONSTANTS.API_BASE_URL}/users`,
  usersAdmin: `${CONSTANTS.API_BASE_URL}/users/admin`,
  genres: `${CONSTANTS.API_BASE_URL}/genres`,
  genresAdmin: `${CONSTANTS.API_BASE_URL}/genres/admin`,
  images: `${CONSTANTS.API_BASE_URL}/images`,
  imagesAdmin: `${CONSTANTS.API_BASE_URL}/images/admin`,
  credits: `${CONSTANTS.API_BASE_URL}/credits`,
  creditsAdmin: `${CONSTANTS.API_BASE_URL}/credits/admin`,
  notifications: `${CONSTANTS.API_BASE_URL}/notifications`,
  statistics: `${CONSTANTS.API_BASE_URL}/statistics`,
  statisticsAdmin: `${CONSTANTS.API_BASE_URL}/statistics/admin`,
  collections: `${CONSTANTS.API_BASE_URL}/collections`,
  collectionsAdmin: `${CONSTANTS.API_BASE_URL}/collections/admin`,
  modsCollections: `${CONSTANTS.API_BASE_URL}/mods-collections`,
  modsCollectionsAdmin: `${CONSTANTS.API_BASE_URL}/mods-collections/admin`,
  modsGenres: `${CONSTANTS.API_BASE_URL}/mods-genres`,
  modsGenresAdmin: `${CONSTANTS.API_BASE_URL}/mods-genres/admin`,
};

const PREFIX_TO_ENDPOINT: Record<prefixAlloweds, string> = {
  MODS: END_POINTS.mods,
  "MODS-ADMIN": END_POINTS.modsAdmin,
  USERS: END_POINTS.users,
  "USERS-ADMIN": END_POINTS.usersAdmin,
  GENRES: END_POINTS.genres,
  "GENRES-ADMIN": END_POINTS.genresAdmin,
  IMAGES: END_POINTS.images,
  "IMAGES-ADMIN": END_POINTS.imagesAdmin,
  CREDITS: END_POINTS.credits,
  "CREDITS-ADMIN": END_POINTS.creditsAdmin,
  NOTIFICATIONS: END_POINTS.notifications,
  STATISTICS: END_POINTS.statistics,
  "STATISTICS-ADMIN": END_POINTS.statisticsAdmin,
  COLLECTIONS: END_POINTS.collections,
  "COLLECTIONS-ADMIN": END_POINTS.collectionsAdmin,
  "MODS-COLLECTIONS": END_POINTS.modsCollections,
  "MODS-COLLECTIONS-ADMIN": END_POINTS.modsCollectionsAdmin,
  "MODS-GENRES": END_POINTS.modsGenres,
  "MODS-GENRES-ADMIN": END_POINTS.modsGenresAdmin,
};

const setBaseUrl = (prefix: prefixAlloweds): string =>
  PREFIX_TO_ENDPOINT[prefix] ?? END_POINTS.base;

export const fetchWithToken = async <T = any>(
  methhodFetch: methodsAlloweds,
  prefix: prefixAlloweds,
  endPoint: string,
  dataToSend?: Record<string, any>,
): Promise<
  ReturnDataFromFetch<T> | { data?: T; success: false; message: string }
> => {
  let selectedEndPoint = setBaseUrl(prefix);

  try {
    if (endPoint && endPoint.trim() !== "") {
      selectedEndPoint = `${selectedEndPoint}/${endPoint}`;
    }
    const token = localStorage.getItem("auth_token") ?? "";
    const response = await $fetch<responseDataFromFetch<T>>(selectedEndPoint, {
      method: methhodFetch,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body:
        dataToSend && dataToSend !== undefined
          ? JSON.stringify(dataToSend)
          : undefined,
    });
    if (!response) {
      return {
        success: false,
        message: "Ocurrio un error",
      };
    }
    if (!response.data && methhodFetch === "DELETE") {
      return {
        success: true,
        message: response.message,
      };
    }
    return {
      success: true,
      message: response.message,
      data: response.data!,
    };
  } catch (error: any) {
    const apiError = error?.data;
    const detail = apiError?.detail;

    let message = "Error desconocido";

    if (Array.isArray(detail)) {
      message = detail.map((e: any) => e.msg).join(", ");
    } else if (typeof detail === "string") {
      message = detail;
    } else if (typeof detail === "object" && detail !== null) {
      message = detail.msg || JSON.stringify(detail);
    } else {
      message = error.message;
    }
    return {
      success: false,
      message: message,
    };
  }
};
/*TODO: Wrapers de fetch */
export const getFetchWithToken = async <T = any>(
  prefix: prefixAlloweds,
  endPoint: string,
) => {
  return await fetchWithToken<T>("GET", prefix, endPoint);
};

export const postFetchWithToken = async <T = any>(
  prefix: prefixAlloweds,
  endPoint: string,
  dataToSend: Record<string, any>,
) => {
  return await fetchWithToken<T>("POST", prefix, endPoint, dataToSend);
};

export const putFetchWithToken = async <T = any>(
  prefix: prefixAlloweds,
  endPoint: string,
  dataToSend?: Record<string, any>,
) => {
  return await fetchWithToken<T>("PUT", prefix, endPoint, dataToSend);
};

export const patchFetchWithToken = async <T = any>(
  prefix: prefixAlloweds,
  endPoint: string,
  dataToSend: Record<string, any>,
) => {
  return await fetchWithToken<T>("PATCH", prefix, endPoint, dataToSend);
};

export const deleteFetchWithToken = async <T = any>(
  prefix: prefixAlloweds,
  endPoint: string,
  dataToSend?: Record<string, any>,
) => {
  return await fetchWithToken<T>(
    "DELETE",
    prefix,
    endPoint,
    dataToSend ? dataToSend : undefined,
  );
};

export const saveImagesToBD = async <T = any>(
  prefix: prefixAlloweds,
  endPoint: string,
  methhodFetch: methodsAlloweds,
  file: File,
): Promise<{ data?: T; success: boolean; message: string }> => {
  let selectedEndPoint = setBaseUrl(prefix);

  if (endPoint && endPoint.trim() !== "") {
    selectedEndPoint = `${selectedEndPoint}/${endPoint}`;
  }

  try {
    const token = localStorage.getItem("auth_token") ?? "";
    const formData = new FormData();
    formData.append("file", file);

    const response = await $fetch<T>(selectedEndPoint, {
      method: methhodFetch,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response) {
      return {
        success: false,
        message: "correcto",
      };
    }

    return {
      success: true,
      message: "correcto",
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: String(error),
    };
  }
};
