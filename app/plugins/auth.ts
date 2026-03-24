export default defineNuxtPlugin((nuxtApp) => {
  // Solo ejecutar en el cliente

  const router = useRouter();
  const { checkAuth } = useAuthState();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login"];

  // Inicializar estado de autenticación
  checkAuth();

  // Hook que se ejecuta ANTES de navegar a una ruta
  router.beforeEach((to, from, next) => {
    // Verificar estado actual de autenticación
    const isUserAuthenticated = checkAuth();
    const isPublicRoute = publicRoutes.includes(to.path);

    // Caso 1: Ruta privada SIN autenticación → Redirigir a login
    if (!isUserAuthenticated && !isPublicRoute) {
      return navigateTo("/login");
    }

    // Caso 2: Usuario autenticado intentando acceder a login → Redirigir a dashboard
    if (isUserAuthenticated && to.path === "/login") {
      return navigateTo("/");
    }

    // Caso 3: Permitir acceso
    next();
  });
});
