interface LoginResponse {
  access_token: string;
  token_type: string;
}

const login = async (username: string, password: string) => {
  try {
    const response = await postFetchWithToken<LoginResponse>("USERS", "login", {
      username,
      password,
    });
    if (response.success === true && response.data) {
      return {
        success: true,
        message: response.message,
        data: response.data.access_token,
      };
    } else {
      return { success: false, message: response.message, data: null };
    }
  } catch (error) {
    return { success: false, message: (error as Error).message, data: null };
  }
};

const create = async (username: string, password: string, role: rolesNames) => {
  try {
    const response = await postFetchWithToken<LoginResponse>("USERS", "", {
      name: username,
      password,
      role,
    });
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message, data: null };
  }
};

export const useLogin = () => {
  const { isAuthenticated } = useAuth();

  return {
    login,
    isAuthenticated,
    create,
  };
};
