<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Listado de Géneros
      </h1>
    </div>

    <UCard>
      <UContainer>
        <UTable :data="data" :columns="columns" class="flex-1" />
      </UContainer>
    </UCard>

    <UModal title="Crear Género">
      <UButton
        class="fixed bottom-10 right-10 z-50"
        size="xl"
        variant="subtle"
        icon="i-lucide-bookmark-plus"
        >Agregar Género</UButton
      >
      <template #body>
        <UCard class="flex flex-col w-full gap-5">
          <UFormField label="Nombre del género" name="name" class="w-full mb-5">
            <UInput
              v-model="genre"
              class="w-full"
              placeholder="Nombre del género"
            />
          </UFormField>
          <UButton @click="handleSaveGenre" icon="i-lucide-bookmark-plus"
            >Crear Género</UButton
          >
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem, TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import useToastAlerts from "~/utils/toastAlerts";

const { showToast } = useToastAlerts();
const { decodeToken } = useAuth();
const { fetchAllGenres, fetchSaveGenre } = useGenres();

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const data = ref<GenreResponse[]>([]);

const router = useRouter();
const genre = ref("");
const userData = ref<tokenData>({
  exp: 0,
  sub: "",
  name: "",
  role: "editor",
  logo: "",
  about_me: "",
  contact: "",
});
const items = ref<BreadcrumbItem[]>([
  {
    label: "Géneros",
    icon: "i-lucide-bookmark",
    to: "/genres",
  },
]);

const columns: TableColumn<GenreResponse>[] = [
  {
    accessorFn: (row) => row.resource.id,
    header: "#",
  },
  {
    accessorFn: (row) => row.resource.name,
    header: "Nombre",
  },
  {
    accessorFn: (row) => row.resource.identifier,
    header: "Identificador",
  },

  {
    accessorFn: (row) => row.info.is_active,
    header: "Estado",
    cell: ({ row }) => {
      const isActive = Boolean(row);
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
          content: {
            align: "end",
          },
          items: getRowItems(row),
          "aria-label": "Actions dropdown",
        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
            "aria-label": "Actions dropdown",
          }),
      );
    },
  },
];

function getRowItems(row: Row<GenreResponse>) {
  return [
    {
      type: "label",
      label: "Acciones",
    },
    {
      label: "Editar Género",
      onSelect() {
        router.push(`/genres/edit/${row.original.resource.id}`);
      },
    },
  ];
}

const handleSaveGenre = async () => {
  const response = await fetchSaveGenre(genre.value);
  showToast(response);
  if (response.success && response.data) {
    genre.value = "";
    data.value.push(response.data);
  }
};

document.title = "Géneros - DDSC Admin";

onBeforeMount(async () => {
  userData.value = decodeToken();
  if (userData.value.role === "uploader") {
    router.push("/");
  }
  const genresResponse = await fetchAllGenres();
  showToast(genresResponse);
  if (genresResponse.success && genresResponse.data) {
    data.value = genresResponse.data;
  }
});
</script>

<style scoped></style>
