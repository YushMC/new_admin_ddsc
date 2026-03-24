<template>
  <UApp :locale="es">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import CONSTANTS from "./utils/constants";
import useToastAlerts from "./utils/toastAlerts";
const { closeAllToasts } = useToastAlerts();
const { decodeToken } = useAuth();
const route = useRoute();
const router = useRouter();

import { es } from "@nuxt/ui/locale";

const token = decodeToken();

watch(
  () => route.path,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      window.scrollTo(0, 0);
      closeAllToasts();
    }
    if (
      newValue.startsWith("/users") &&
      newValue.startsWith("/collections") &&
      newValue.startsWith("/genres")
    ) {
      if (token?.role === "uploader") {
        router.push("/");
      }
    }
  },
);

definePageMeta({
  middleware: "global",
});

useHead({
  link: [
    {
      rel: "icon",
      href: `${CONSTANTS.FRONT_END_BASE_URL}/images/Logo_DDSC.png`,
    },
  ],
});
</script>
