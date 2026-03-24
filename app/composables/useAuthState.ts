import { ref, watch } from "vue";

const authState = ref({
  isAuthenticated: false,
  token: null as string | null,
  user: null as any,
});

export const useAuthState = () => {
  const { getToken, isAuthenticated } = useAuth();

  // Inicializar estado
  const initializeAuth = () => {
    if (!process.client) return false;
    const token = getToken();
    const isAuth = isAuthenticated();

    authState.value = {
      isAuthenticated: isAuth,
      token,
      user: null,
    };

    return isAuth;
  };

  // Verificar estado actual
  const checkAuth = () => {
    if (!process.client) return false;
    const isAuth = isAuthenticated();
    authState.value.isAuthenticated = isAuth;
    authState.value.token = isAuth ? getToken() : null;
    return isAuth;
  };

  // Solo inicializar en el cliente
  if (process.client) {
    initializeAuth();
  }

  return {
    authState,
    initializeAuth,
    checkAuth,
  };
};
