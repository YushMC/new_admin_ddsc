export default defineNuxtRouteMiddleware((to, from) => {
  const { decodeToken } = useAuth();

  const token = decodeToken();

  if (token.role === "uploader") {
    return navigateTo("/");
  }
});
