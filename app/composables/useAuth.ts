const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

const clearToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
};

const decodeToken = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("auth_token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload)) as tokenData;
  } catch (e) {
    return null;
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
