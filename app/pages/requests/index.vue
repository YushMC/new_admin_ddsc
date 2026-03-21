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
const { fetchMods, fetchModsAdmin } = useMods();
const { decodeToken } = useAuth();
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
      label: "Ver Datos Iniciales",
      onSelect() {
        router.push(`/mods/edit/${row.original.resource.id}`);

        // toast.add({
        //   title: "Payment ID copied to clipboard!",
        //   color: "success",
        //   icon: "i-lucide-circle-check",
        // });
      },
    },
    // {
    //   type: "separator",
    // },
    // {
    //   label: "View customer",
    // },
    // {
    //   label: "View payment details",
    // },
  ];

  return itemsData;
}

onBeforeMount(async () => {
  document.title = "Mods - Admin DDSC";

  const token = decodeToken();

  if (token.role === "uploader") router.back();

  const response = await fetchModsAdmin();

  if (response.success && response.data) {
    mods.value = response.data.filter(
      (item) => item.resource.required_revision === true,
    );
  }
});
</script>

<style scoped></style>
