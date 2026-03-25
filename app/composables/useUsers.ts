const fetchAllUsersAdmin = async () => {
  return await getFetchWithToken<User[]>("USERS-ADMIN", "all");
};

const fetchAllSaveCredits = async (data: any) => {
  return await postFetchWithToken("CREDITS", "batch", data);
};

const fetchUpdateInfoUser = async (data: {
  name: string;
  about_me: string;
}) => {
  return await putFetchWithToken("USERS", `profile`, data);
};

const fetchGetUserById = async (id: number) => {
  return await getFetchWithToken<User>("USERS", String(id));
};

const fetchUploadLogo = async (file: File) => {
  return await saveImagesToBD("USERS", "logo", "POST", file);
};

const fetchUpdateLogo = async (file: File) => {
  return await saveImagesToBD("USERS", "logo", "PATCH", file);
};

const fetchUpdatePassword = async (data: {
  current_password: string;
  new_password: string;
}) => {
  return await patchFetchWithToken("USERS", "password", data);
};

const fetchUpdateContact = async (contact: string) => {
  return await patchFetchWithToken("USERS", "contact", { contact });
};

const fetchUpdateRole = async (id: number, role: rolesNames) => {
  return await patchFetchWithToken("USERS-ADMIN", `role/${id}`, { role });
};

const fetchRestorePassword = async (id: number, new_password: string) => {
  return await patchFetchWithToken("USERS-ADMIN", `restore/password/${id}`, {
    new_password,
  });
};

const fetchUpdateStatus = async (id: number, is_active: boolean) => {
  return await patchFetchWithToken("USERS-ADMIN", `status/${id}`, {
    is_active,
  });
};

export const useUsers = () => {
  return {
    fetchAllSaveCredits,
    fetchUpdateInfoUser,
    fetchGetUserById,
    fetchUploadLogo,
    fetchUpdateLogo,
    fetchUpdatePassword,
    fetchUpdateContact,
    fetchUpdateRole,
    fetchRestorePassword,
    fetchAllUsersAdmin,
    fetchUpdateStatus,
  };
};
