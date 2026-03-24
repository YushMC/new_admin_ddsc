<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Lista de Usuarios
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
            :total="filteredUsers.length"
            :items-per-page="itemsPerPage"
            variant="ghost"
          />
        </UContainer>

        <UFormField class="w-100 flex justify-center gap-2 flex-wrap">
          <UInput
            v-model="search"
            placeholder="Buscar Usuario..."
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
      </UContainer>
      <UContainer>
        <UTable :data="filteredUsers" :columns="columns" class="flex-1" />
      </UContainer>
    </UCard>

    <UModal
      v-model:open="open"
      v-if="selectedUser"
      :title="`Editar al usuario: ${selectedUser.name}`"
    >
      <template #body>
        <UCard class="flex flex-col w-full gap-5">
          <UCard class="flex flex-col w-full gap-5" variant="soft">
            <UFormField label="Rol del usuario" name="role" class="w-full mb-5">
              <USelect
                :model-value="(selectedUser?.role ?? 'uploader') as rolesNames"
                :items="roleOptions"
                placeholder="Selecciona un rol"
                value-key="role"
                icon="i-lucide-shield"
                :disabled="selectedUser?.role === 'owner'"
                class="w-full"
                @update:model-value="
                  (value: rolesNames) => {
                    if (selectedUser) {
                      selectedUser.role = value;
                    }
                  }
                "
              />
            </UFormField>
            <UButton
              :disabled="selectedUser?.role === 'owner'"
              @click="handleUpdateUserRole"
              color="warning"
              icon="i-lucide-rotate-ccw"
              >Actualizar Rol</UButton
            >
          </UCard>
          <UCard class="flex flex-col w-full gap-5 mt-5" variant="soft">
            <USwitch
              unchecked-icon="i-lucide-x"
              checked-icon="i-lucide-check"
              default-value
              v-model="selectedUser.is_active"
              @change="handleToggleUserActive"
              label="¿Usuario Activo?"
            />
          </UCard>
          <UCard class="flex flex-col w-full gap-5 mt-5" variant="soft">
            <UFormField label="Restablecer Contraseña">
              <UInput
                :type="showCurrentPassword ? 'text' : 'password'"
                v-model="new_password"
                class="w-full"
              >
                <template #trailing>
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                  >
                    <UIcon
                      :name="
                        showCurrentPassword
                          ? 'i-lucide-eye-off'
                          : 'i-lucide-eye'
                      "
                    />
                  </button>
                </template>
              </UInput>
            </UFormField>
            <UButton
              @click="handleRestoreUser"
              color="warning"
              icon="i-lucide-rotate-ccw"
              class="mt-5"
              >Restablecer Contraseña</UButton
            >
          </UCard>
        </UCard>
      </template>
    </UModal>

    <UButton
      class="fixed bottom-10 right-10 z-50"
      size="xl"
      variant="subtle"
      to="/users/create"
      icon="i-lucide-user-plus"
      >Agregar Usuario</UButton
    >
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";

const items = ref<BreadcrumbItem[]>([
  {
    label: "Usuarios",
    icon: "i-lucide-users",
    to: "/users",
  },
]);
const { decodeToken } = useAuth();
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import useToastAlerts from "~/utils/toastAlerts";

const {
  fetAllUsersAdminWithSkipAndLimit,
  fetchRestorePassword,
  fetchUpdateRole,
  fetchUpdateStatus,
} = useUsers();
const UButton = resolveComponent("UButton");

const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const { showToast } = useToastAlerts();
const router = useRouter();

const tokenDecode = ref<tokenData>({
  exp: 0,
  sub: "",
  name: "",
  role: "editor",
  logo: "",
  about_me: "",
  contact: "",
});
const new_password = ref("");
const showCurrentPassword = ref(false);
const open = ref(false);
const selectedUser = ref<User | null>(null);

const data = ref<User[]>([]);

const roleOptions: { role: rolesNames; label: string; disabled: boolean }[] = [
  { role: "owner", label: "Creador", disabled: true },
  { role: "editor", label: "Editor", disabled: false },
  { role: "uploader", label: "Aportador", disabled: false },
];

const columns: TableColumn<User>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const logo = row.getValue("logo") ?? "";

      return h("img", {
        src: logo,
        alt: "Logo",
        class: "h-8 w-8 rounded-full object-cover",
      });
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },

  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as rolesNames;
      const color = {
        owner: "success" as const,
        editor: "info" as const,
        uploader: "neutral" as const,
      }[role];

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        role === "owner"
          ? "Creador"
          : role === "editor"
            ? "Editor"
            : role === "uploader"
              ? "Aportador"
              : role,
      );
    },
  },

  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          class: "capitalize",
          variant: "subtle",
          color: row.getValue("is_active") === true ? "success" : "error",
        },
        () => (row.getValue("is_active") === true ? "Activo" : "Oculto"),
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

function getRowItems(row: Row<User>) {
  return [
    {
      type: "label",
      label: "Acciones",
    },
    {
      label: "Editar Usuario",
      onSelect() {
        open.value = true;
        selectedUser.value = row.original;
      },
    },
  ];
}

const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);

const handleRestoreUser = async () => {
  if (!selectedUser.value) return;

  const response = await fetchRestorePassword(
    selectedUser.value.id,
    new_password.value,
  );

  showToast(response);

  open.value = false;
  selectedUser.value = null;
};

const handleUpdateUserRole = async () => {
  if (!selectedUser.value) return;

  const response = await fetchUpdateRole(
    selectedUser.value.id,
    selectedUser.value.role as rolesNames,
  );

  showToast(response);

  open.value = false;
  selectedUser.value = null;
};

const handleToggleUserActive = async () => {
  if (!selectedUser.value) return;

  const response = await fetchUpdateStatus(
    selectedUser.value.id,
    selectedUser.value.is_active,
  );
  showToast(response);

  open.value = false;
  selectedUser.value = null;
};

const loadUsers = async () => {
  const response = await fetAllUsersAdminWithSkipAndLimit(0, 10);
  if (response.success && response.data) {
    data.value = response.data;
  }
  showToast(response);
};

const filteredUsers = computed(() => {
  return data.value.filter((user) => {
    if (
      search.value &&
      !user.name.toLowerCase().includes(search.value.toLowerCase())
    )
      return false;

    return true;
  });
});

const fetchUsers = async (skip: number, limit: number) => {
  const response = await fetAllUsersAdminWithSkipAndLimit(skip, limit);

  if (response.success && response.data) {
    data.value = response.data;
  }
};

watch(
  () => itemsPerPage.value,
  async (newValue) => {
    fetchUsers((page.value - 1) * newValue, newValue);
  },
);

document.title = "Usuarios - DDSC Admin";

onBeforeMount(async () => {
  await loadUsers();
});
</script>

<style scoped></style>
