<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import CONSTANTS from "./utils/constants";
import useToastAlerts from "./utils/toastAlerts";
const { closeAllToasts } = useToastAlerts();
const route = useRoute();

watch(
  () => route.path,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      window.scrollTo(0, 0);
      closeAllToasts();
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
