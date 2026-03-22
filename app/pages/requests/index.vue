<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Lista de Mods (solo solicitudes)
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
            :total="filteredMods.length"
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
            placeholder="Filtrar por Tipo"
            :items="[
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '50', value: 50 },
              { label: '100', value: 100 },
            ]"
          />
        </UFormField>

        <UModal title="Filtros">
          <UButton icon="i-lucide-filter" variant="ghost">Filtros</UButton>
          <template #body>
            <div class="flex flex-col gap-4 w-full">
              <UFormField label="Tipo">
                <USelect
                  v-model="selectedType"
                  class="w-full"
                  placeholder="Filtrar por Tipo"
                  :items="optionsForType"
                />
              </UFormField>

              <UFormField label="Estado">
                <USelect
                  v-model="selectedStatus"
                  class="w-full"
                  placeholder="Filtrar por Estado"
                  :items="optionsForStatus"
                />
              </UFormField>

              <UFormField label="Duración">
                <USelect
                  v-model="selectedDuration"
                  class="w-full"
                  placeholder="Filtrar por Duración"
                  :items="optionsForDuration"
                />
              </UFormField>

              <UFormField label="Visibilidad">
                <USelect
                  v-model="selectedVisibility"
                  class="w-full"
                  placeholder="Filtrar por Visibilidad"
                  :items="[
                    { label: 'Activo', value: true },
                    { label: 'Oculto', value: false },
                  ]"
                />
              </UFormField>
            </div>
          </template>
        </UModal>
      </UContainer>
      <UContainer>
        <UTable :data="mods" :columns="columns" class="flex-1" />
      </UContainer>
    </UCard>

    <UButton
      class="fixed bottom-10 right-10 z-50"
      size="xl"
      variant="subtle"
      to="/mods/create"
      icon="i-lucide-book-plus"
      >Agregar Mod</UButton
    >
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import useToastAlerts from "~/utils/toastAlerts";
const { fetchAllModsInRevisionWithSkipAndLimit } = useMods();
const { showToast } = useToastAlerts();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const router = useRouter();
const mods = ref<ModResponse[]>([]);

const items = ref<BreadcrumbItem[]>([
  {
    label: "Mods (Solicitudes)",
    icon: "i-lucide-book-open-check",
    to: "/mods",
  },
]);

const optionsForType: { label: string; value: ModType }[] = [
  { label: "Traducción", value: "translation" },
  { label: "Original", value: "original" },
];

const optionsForStatus: { label: string; value: Status }[] = [
  { label: "Abandonado", value: "abandoned" },
  { label: "Archivado", value: "archived" },
  { label: "Legado", value: "legacy" },
  { label: "Demo", value: "beta" },
  { label: "En Desarrollo", value: "under_development" },
  { label: "Finalizado", value: "stable" },
  { label: "Finalizado", value: "stable" },
  { label: "En Pausa", value: "on_ice" },
];

const optionsForDuration: { label: string; value: Duration }[] = [
  { label: "Muy Corta", value: "very_short" },
  { label: "Corta", value: "short" },
  { label: "Media", value: "medium" },
  { label: "Larga", value: "long" },
  { label: "Muy Larga", value: "very_long" },
  { label: "Infinita", value: "endless" },
  { label: "Desconocida", value: "unknown" },
];

const selectedType = ref<ModType | undefined>(undefined);
const selectedStatus = ref<Status | undefined>(undefined);
const selectedDuration = ref<Duration | undefined>(undefined);
const selectedVisibility = ref<boolean | undefined>(undefined);
const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);

const columns: TableColumn<ModResponse>[] = [
  {
    header: "#",
    accessorFn: (row) => row.resource.id,
  },
  {
    header: "Nombre",
    accessorFn: (row) => row.resource.name,
  },
  {
    header: "Tipo",
    accessorFn: (row) => row.resource.type,
    cell: ({ row }) => {
      const value = row.getValue("Tipo") as string;

      const color = {
        translation: "success",
        original: "info",
      }[value];

      return h(
        UBadge,
        { class: "capitalize", variant: "subtle", color },
        () => value,
      );
    },
  },
  {
    header: "Estado",
    accessorFn: (row) => row.resource.status,
    cell: ({ row }) => {
      const value = row.getValue("Estado") as string;

      const color = {
        owner: "success",
        editor: "info",
        uploader: "neutral",
      }[value];

      return h(
        UBadge,
        { class: "capitalize", variant: "subtle", color },
        () => value,
      );
    },
  },
  {
    header: "Visibilidad",
    accessorFn: (row) => row.info.is_active,
    cell: ({ row }) => {
      const isActive = row.getValue("Visibilidad") as boolean;

      return h(
        UBadge,
        {
          class: "capitalize",
          variant: "subtle",
          color: isActive ? "success" : "error",
        },
        () => (isActive ? "Activo" : "Oculto"),
      );
    },
  },
  {
    id: "actions",
    meta: {
      class: {
        td: "text-right",
      },
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: { align: "end" },
          items: getRowItems(row),
        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
          }),
      );
    },
  },
];

function getRowItems(row: Row<ModResponse>) {
  let itemsData = [
    {
      type: "label",
      label: "Acciones",
    },
    {
      label: "Ver Datos",
      onSelect() {
        router.push(`/request/detail/${row.original.resource.id}`);
      },
    },
  ];

  return itemsData;
}

const filteredMods = computed(() => {
  return mods.value.filter((mod) => {
    if (
      selectedType.value !== undefined &&
      mod.resource.type !== selectedType.value
    )
      return false;

    if (
      selectedStatus.value !== undefined &&
      mod.resource.status !== selectedStatus.value
    )
      return false;

    if (
      selectedDuration.value !== undefined &&
      mod.resource.duration !== selectedDuration.value
    )
      return false;

    if (
      selectedVisibility.value !== undefined &&
      mod.info.is_active !== selectedVisibility.value
    )
      return false;

    if (
      search.value &&
      !mod.resource.name.toLowerCase().includes(search.value.toLowerCase())
    )
      return false;

    return true;
  });
});

const fetchModsWithSkipAndLimit = async (skip: number, limit: number) => {
  const response = await fetchAllModsInRevisionWithSkipAndLimit(skip, limit);

  if (response.success && response.data) {
    mods.value = response.data;
  }
};

watch(
  () => itemsPerPage.value,
  async (newValue) => {
    fetchModsWithSkipAndLimit((page.value - 1) * newValue, newValue);
  },
);

document.title = "Mods en Revisión - Admin DDSC";

onBeforeMount(async () => {
  const response = await fetchAllModsInRevisionWithSkipAndLimit(0, 10);
  showToast(response);
  if (response.success && response.data) {
    mods.value = response.data;
  }
});
</script>

<style scoped></style>
