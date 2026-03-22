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
      <UContainer
        class="w-full flex items-center justify-evenly mb-5 gap-5 flex-wrap"
      >
        <UContainer
          class="size-fit overflow-hidden flex jusify-center items-center p-0 m-0"
        >
          <UPagination
            class="size-fit"
            v-model:page="page"
            :sibling-count="1"
            :total="filteredStats.length"
            :items-per-page="itemsPerPage"
            variant="ghost"
          />
        </UContainer>

        <UFormField class="w-100 flex justify-center gap-2 flex-wrap">
          <UInput
            v-model="search"
            placeholder="Buscar Mod..."
            class="w-50"
            icon="i-lucide-search"
            size="md"
            variant="soft"
          />
          <USelect
            v-model="itemsPerPage"
            class="w-20 ml-5"
            :items="[
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '50', value: 50 },
              { label: '100', value: 100 },
            ]"
          />
        </UFormField>
      </UContainer>
      <UContainer>
        <UTable
          sticky
          :data="filteredStats"
          :columns="columns"
          class="flex-1 max-h-[312px]"
        />
      </UContainer>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import type { TableColumn } from "@nuxt/ui";
import useToastAlerts from "~/utils/toastAlerts";

const { showToast } = useToastAlerts();
const { fetchAllStatsWithSkipAndLimit } = useStats();

const stats = ref<StatsResponse[]>([]);
const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);

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

const filteredStats = computed(() => {
  return stats.value.filter((mod) => {
    if (
      search.value &&
      !mod.resource.mod_name.toLowerCase().includes(search.value.toLowerCase())
    )
      return false;

    return true;
  });
});

watch(
  () => itemsPerPage.value,
  async () => {
    const statsResp = await fetchAllStatsWithSkipAndLimit(
      (page.value - 1) * itemsPerPage.value,
      itemsPerPage.value,
    );
    if (statsResp && statsResp.data) {
      stats.value = statsResp.data;
    }
  },
);

document.title = "Estadísticas de Mods - DDSC Admin";
onBeforeMount(async () => {
  const statsResp = await fetchAllStatsWithSkipAndLimit(0, 10);
  if (statsResp && statsResp.data) {
    stats.value = statsResp.data;
  }
  showToast(statsResp);
});
</script>

<style scoped></style>
