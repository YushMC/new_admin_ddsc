<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Listado de Colecciones
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
            :total="filteredCollections.length"
            :items-per-page="itemsPerPage"
            variant="ghost"
          />
        </UContainer>

        <UFormField class="w-100 flex justify-center gap-2 flex-wrap">
          <UInput
            v-model="search"
            placeholder="Buscar Colección..."
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
        <UTable :data="filteredCollections" :columns="columns" class="flex-1" />
      </UContainer>
    </UCard>

    <UModal title="Crear Colección">
      <UButton
        class="fixed bottom-10 right-10 z-50"
        size="xl"
        variant="subtle"
        icon="i-lucide-library"
        >Agregar Colección</UButton
      >
      <template #body>
        <UCard class="flex flex-col w-full gap-5">
          <UFormField
            label="Nombre de la colección"
            name="name"
            class="w-full mb-5"
          >
            <UInput
              v-model="newCollection.name"
              class="w-full"
              placeholder="Nombre de la colección"
            />
          </UFormField>
          <UFormField
            label="Descripción de la colección"
            name="description"
            class="w-full mb-5"
          >
            <UTextarea
              rezizable
              v-model="newCollection.description"
              class="w-full"
              placeholder="Descripción de la colección"
            />
          </UFormField>
          <UFormField name="is_seasonal" class="w-full mb-5">
            <UCheckbox
              v-model="newCollection.is_seasonal"
              label="¿Es una colección estacional?"
            />
          </UFormField>
          <UFormField
            v-if="newCollection.is_seasonal"
            label="Fecha de inicio y fin de la colección"
            name="season_dates"
            class="w-full mb-5"
          >
            <UInputDate icon="i-lucide-calendar" range v-model="valueDates" />
          </UFormField>
          <UButton @click="handleSaveCollection" icon="i-lucide-library"
            >Crear Colección</UButton
          >
        </UCard>
      </template>
    </UModal>

    <UModal
      v-model:open="open"
      v-if="selectedCollection"
      :title="`Editar la colección: ${selectedCollection.resource.name}`"
    >
      <template #body>
        <UCard class="flex flex-col w-full gap-5">
          <UCard class="flex flex-col w-full gap-5" variant="soft">
            <UFormField
              label="Nombre de la colección"
              name="name"
              class="w-full mb-5"
            >
              <UInput
                v-model="selectedCollection.resource.name"
                class="w-full"
                placeholder="Nombre de la colección"
              />
            </UFormField>
            <UFormField
              label="Nombre de la colección"
              name="name"
              class="w-full mb-5"
            >
              <UTextarea
                rezizable
                v-model="selectedCollection.resource.description"
                class="w-full"
                placeholder="Descripción de la colección"
              />
            </UFormField>
            <UFormField name="is_seasonal" class="w-full mb-5">
              <UCheckbox
                v-model="selectedCollection.resource.is_seasonal"
                label="¿Es una colección estacional?"
              />
            </UFormField>
            <UFormField
              v-if="selectedCollection.resource.is_seasonal"
              label="Fecha de inicio y fin de la colección"
              name="season_dates"
              class="w-full mb-5"
            >
              <UInputDate
                icon="i-lucide-calendar"
                range
                v-model="valueUpdateDates"
              />
            </UFormField>
            <UButton
              @click="handleUpdateCollection"
              color="warning"
              icon="i-lucide-rotate-ccw"
              >Actualizar Colección</UButton
            >
          </UCard>
          <UCard class="flex flex-col w-full gap-5 mt-5" variant="soft">
            <USwitch
              unchecked-icon="i-lucide-x"
              checked-icon="i-lucide-check"
              default-value
              v-model="selectedCollection.info.is_active"
              @change="handleToggleCollectionActive"
              label="¿Colección Activa?"
            />
          </UCard>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import type { BreadcrumbItem, TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import useToastAlerts from "~/utils/toastAlerts";
const {
  fetchAllCollectionsWithSkipAndLimit,
  fetchSaveCollection,
  fetchUpdateCollection,
  fetchUpdateStatusCollection,
} = useCollections();

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const { showToast } = useToastAlerts();
const collections = ref<CollectionResponse[]>([]);
const newCollection = ref<Collection>({
  id: 0,
  name: "",
  description: "",
  is_seasonal: false,
  start_date: null,
  end_date: null,
});
const valueDates = shallowRef({
  start: new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  ),
  end: new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  ),
});
const valueUpdateDates = shallowRef({
  start: new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  ),
  end: new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  ),
});

const open = ref(false);
const selectedCollection = ref<CollectionResponse | null>(null);

const handleSaveCollection = async () => {
  if (newCollection.value.is_seasonal) {
    newCollection.value.start_date = valueDates.value.start.toString();
    newCollection.value.end_date = valueDates.value.end.toString();
  } else {
    newCollection.value.start_date = null;
    newCollection.value.end_date = null;
  }
  console.log("Saving collection with data:", newCollection.value);
  const response = await fetchSaveCollection(newCollection.value);
  showToast(response);
  if (response.success && response.data) {
    collections.value.push(response.data);
  }
  newCollection.value = {
    id: 0,
    name: "",
    description: "",
    is_seasonal: false,
    start_date: null,
    end_date: null,
  };
};

const items = ref<BreadcrumbItem[]>([
  {
    label: "Colecciones",
    icon: "i-lucide-library",
    to: "/collections",
  },
]);

const columns: TableColumn<CollectionResponse>[] = [
  {
    accessorFn: (row) => row.resource.id,
    header: "#",
  },
  {
    accessorFn: (row) => row.resource.name,
    header: "Nombre",
  },
  {
    accessorFn: (row) => row.resource.description,
    header: "Descripción",
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

function getRowItems(row: Row<CollectionResponse>) {
  return [
    {
      type: "label",
      label: "Acciones",
    },
    {
      label: "Editar Colección",
      onSelect() {
        open.value = true;
        selectedCollection.value = row.original;
      },
    },
  ];
}

const handleToggleCollectionActive = async () => {
  if (!selectedCollection.value) return;

  // Aquí deberías llamar a la función de toggle en tu API
  const response = await fetchUpdateStatusCollection(
    selectedCollection.value.resource.id,
    selectedCollection.value.info.is_active,
  );
  showToast(response);
};

const handleUpdateCollection = async () => {
  if (!selectedCollection.value) return;

  if (selectedCollection.value.resource.is_seasonal) {
    selectedCollection.value.resource.start_date =
      valueUpdateDates.value.start.toString();
    selectedCollection.value.resource.end_date =
      valueUpdateDates.value.end.toString();
  } else {
    selectedCollection.value.resource.start_date = null;
    selectedCollection.value.resource.end_date = null;
  }

  // Aquí deberías llamar a la función de actualización en tu API
  const response = await fetchUpdateCollection(
    selectedCollection.value.resource.id,
    selectedCollection.value.resource,
  );
  showToast(response);
};

const filteredCollections = computed(() => {
  return collections.value.filter((collection) => {
    if (
      search.value &&
      !collection.resource.name
        .toLowerCase()
        .includes(search.value.toLowerCase())
    )
      return false;

    return true;
  });
});

watch(
  () => itemsPerPage.value,
  async () => {
    const statsResp = await fetchAllCollectionsWithSkipAndLimit(
      (page.value - 1) * itemsPerPage.value,
      itemsPerPage.value,
    );
    if (statsResp && statsResp.data) {
      collections.value = statsResp.data;
    }
  },
);

document.title = "Colecciones - DDSC Admin";

onBeforeMount(async () => {
  const response = await fetchAllCollectionsWithSkipAndLimit(0, 10);
  showToast(response);
  if (response.success && response.data) {
    collections.value = response.data;
  }
});
</script>

<style scoped></style>
