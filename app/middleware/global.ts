export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente

  const { isAuthenticated } = useAuth();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login"];

  const isUserAuthenticated = isAuthenticated();
  const isPublicRoute = publicRoutes.includes(to.path);

  // Caso 1: Ruta privada SIN autenticación → Redirigir a login
  if (!isUserAuthenticated && !isPublicRoute) {
    return navigateTo("/login");
  }

  // Caso 2: Usuario autenticado intentando acceder a login → Redirigir a dashboard
  if (isUserAuthenticated && to.path === "/login") {
    return navigateTo("/");
  }
});
