const getToken = () => {
  return localStorage.getItem("auth_token");
};

const clearToken = () => {
  localStorage.removeItem("auth_token");
};

const decodeToken = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return {} as tokenData;
  try {
    const payload = token.split(".")[1];
    if (!payload) return {} as tokenData;
    return JSON.parse(atob(payload)) as tokenData;
  } catch (e) {
    return {} as tokenData;
  }
};

const isAuthenticated = () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  const decoded = decodeToken() as tokenData;

  if (!decoded || typeof decoded !== "object" || !("exp" in decoded)) {
    clearToken();
    return false;
  }

  const currentTime = Math.floor(Date.now() / 1000);

  if (decoded.exp < currentTime) {
    clearToken();
    return false;
  }

  return true;
};

export const useAuth = () => {
  return {
    getToken,
    clearToken,
    isAuthenticated,
    decodeToken,
  };
};
