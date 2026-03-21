const fetchAllUsers = async () => {
  return await getFetchWithToken<User[]>("USERS", "");
};

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
  return await postFetchWithToken("USERS", "profile", file);
};

const fetchUpdateLogo = async (file: File) => {
  return await patchFetchWithToken("USERS", "profile", file);
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

const fetchUpdateRole = async (role: rolesNames, id: number) => {
  return await patchFetchWithToken("USERS-ADMIN", `role/${id}`, { role });
};

const fetchRestorePassword = async (new_password: string, id: number) => {
  return await patchFetchWithToken("USERS-ADMIN", `restore/password/${id}`, {
    new_password,
  });
};

export const useUsers = () => {
  return {
    fetchAllUsers,
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
  };
};
