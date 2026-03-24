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
            :total="filteredGenres.length"
            :items-per-page="itemsPerPage"
            variant="ghost"
          />
        </UContainer>

        <UFormField class="w-100 flex justify-center gap-2 flex-wrap">
          <UInput
            v-model="search"
            placeholder="Buscar Género..."
            class="w-50"
            icon="i-lucide-search"
            size="md"
            variant="soft"
          />
          <USelect
            v-model="itemsPerPage"
            class="w-20 ml-5"
            :items="[
              { label: '5', value: 5 },
              { label: '10', value: 10 },
              { label: '20', value: 20 },
            ]"
          />
        </UFormField>
      </UContainer>
      <UContainer>
        <UTable :data="filteredGenres" :columns="columns" class="flex-1" />
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

    <UModal
      v-model:open="open"
      v-if="selectedGenre"
      :title="`Editar al género: ${selectedGenre.resource.name}`"
    >
      <template #body>
        <UCard class="flex flex-col w-full gap-5">
          <UCard class="flex flex-col w-full gap-5" variant="soft">
            <UFormField
              label="Nombre del género"
              name="name"
              class="w-full mb-5"
            >
              <UInput
                v-model="selectedGenre.resource.name"
                class="w-full"
                placeholder="Nombre del género"
              />
            </UFormField>
            <UButton
              @click="handleUpdateGenre"
              color="warning"
              icon="i-lucide-rotate-ccw"
              >Actualizar Nombre</UButton
            >
          </UCard>
          <UCard class="flex flex-col w-full gap-5 mt-5" variant="soft">
            <USwitch
              unchecked-icon="i-lucide-x"
              checked-icon="i-lucide-check"
              default-value
              v-model="selectedGenre.info.is_active"
              @change="handleToggleGenreActive"
              label="¿Género Activo?"
            />
          </UCard>
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
const {
  fetchAllGenresWithSkipAndLimit,
  fetchSaveGenre,
  fetchUpdateGenre,
  fetchUpdateStatusGenre,
} = useGenres();

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const data = ref<GenreResponse[]>([]);

const open = ref(false);
const selectedGenre = ref<GenreResponse | null>(null);

const router = useRouter();
const genre = ref("");
const userData = ref<tokenData | null>(null);
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
      const isActive = Boolean(row.original.info.is_active);
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
        open.value = true;
        selectedGenre.value = row.original;
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

const handleUpdateGenre = async () => {
  if (!selectedGenre.value) return;

  const response = await fetchUpdateGenre(
    selectedGenre.value.resource.id,
    selectedGenre.value.resource.name,
  );
  showToast(response);
  resetSelectedGenre();
};

const handleToggleGenreActive = async () => {
  if (!selectedGenre.value) return;

  const response = await fetchUpdateStatusGenre(
    selectedGenre.value.resource.id,
    selectedGenre.value.info.is_active,
  );
  showToast(response);
  resetSelectedGenre();
};

const resetSelectedGenre = () => {
  selectedGenre.value = null;
  open.value = false;
};

const filteredGenres = computed(() => {
  return data.value.filter((genre) => {
    if (
      search.value &&
      !genre.resource.name.toLowerCase().includes(search.value.toLowerCase())
    )
      return false;

    return true;
  });
});

watch(
  () => itemsPerPage.value,
  async () => {
    const statsResp = await fetchAllGenresWithSkipAndLimit(
      (page.value - 1) * itemsPerPage.value,
      itemsPerPage.value,
    );
    if (statsResp && statsResp.data) {
      data.value = statsResp.data;
    }
  },
);

document.title = "Géneros - DDSC Admin";

onBeforeMount(async () => {
  userData.value = decodeToken();
  if (userData.value?.role === "uploader") {
    router.push("/");
  }
  const genresResponse = await fetchAllGenresWithSkipAndLimit(0, 10);
  showToast(genresResponse);
  if (genresResponse.success && genresResponse.data) {
    data.value = genresResponse.data;
  }
});
</script>

<style scoped></style>
