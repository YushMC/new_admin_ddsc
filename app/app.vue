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

const token = ref<tokenData | null>(null);

onMounted(() => {
  token.value = decodeToken();
});

watch(
  () => route.path,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
      closeAllToasts();
    }
    if (
      newValue.startsWith("/users") &&
      newValue.startsWith("/collections") &&
      newValue.startsWith("/genres")
    ) {
      if (token.value?.role === "uploader") {
        router.push("/");
      }
    }
  },
);

useHead({
  link: [
    {
      rel: "icon",
      href: `${CONSTANTS.FRONT_END_BASE_URL}/images/Logo_DDSC.png`,
    },
  ],
});
</script>
