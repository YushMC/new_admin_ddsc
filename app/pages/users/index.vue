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
      <UContainer>
        <UTable :data="data" :columns="columns" class="flex-1" />
      </UContainer>
    </UCard>

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
const { fetchAllUsersAdmin } = useUsers();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const { showToast } = useToastAlerts();
const router = useRouter();

const data = ref<User[]>([
  {
    id: 1,
    role: "editor",
    name: "",
    contact: null,
    logo: null,
  },
]);

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
      const color = {
        owner: "success" as const,
        editor: "info" as const,
        uploader: "neutral" as const,
      }[row.getValue("role") as string];

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("role"),
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
        router.push(`/users/edit/${row.getValue("id")}`);

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
}

const loadUsers = async () => {
  const response = await fetchAllUsersAdmin();
  if (response.success && response.data) {
    data.value = response.data;
  }
  showToast(response);
};

onBeforeMount(async () => {
  const tokenDecode = decodeToken();
  if (!tokenDecode || tokenDecode.role === "uploader") {
    router.back();
  }
  await loadUsers();
});
</script>

<style scoped></style>
