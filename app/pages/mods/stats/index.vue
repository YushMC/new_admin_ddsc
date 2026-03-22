<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Lista de Mods (Estadísticas)
      </h1>
    </div>

    <!-- Form Card -->
    <UCard>
      <UContainer>
        <UTable :data="stats" :columns="columns" class="flex-1" />
      </UContainer>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import useToastAlerts from "~/utils/toastAlerts";

const { showToast } = useToastAlerts();
const { fetchMyMods } = useMods();
const { fetchAllStats } = useStats();

const stats = ref<StatsResponse[]>([]);

const columns: TableColumn<StatsResponse>[] = [
  {
    header: "Nombre del Mod",
    accessorFn: (row) => row.resource.mod_name,
  },
  {
    header: "Descargas (pc)",
    accessorFn: (row) => row.resource.download_pc,
  },
  {
    header: "Descargas (android)",
    accessorFn: (row) => row.resource.download_android,
  },
  {
    header: "Busquedas",
    accessorFn: (row) => row.resource.searchs,
  },
];

const items = ref<BreadcrumbItem[]>([
  {
    label: "Mods",
    icon: "i-lucide-book-open",
    to: "/mods",
  },
  {
    label: "Estadísticas",
    icon: "i-lucide-bar-chart-2",
    to: "/mods/stats",
  },
]);
document.title = "Estadísticas de Mods - DDSC Admin";
onBeforeMount(async () => {
  const statsResp = await fetchAllStats();
  if (statsResp && statsResp.data) {
    stats.value = statsResp.data;
  }
  showToast(statsResp);
});
</script>

<style scoped></style>
