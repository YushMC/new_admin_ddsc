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
    const isAuth = isAuthenticated();
    authState.value.isAuthenticated = isAuth;
    authState.value.token = isAuth ? getToken() : null;
    return isAuth;
  };

  // Inicializar en la primera carga

  initializeAuth();

  return {
    authState,
    initializeAuth,
    checkAuth,
  };
};
