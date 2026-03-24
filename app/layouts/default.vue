<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable>
      <template #header="{ collapsed }">
        <NuxtImg
          src="https://www.dokidokispanish.club/images/Logo_DDSC.png"
          width="50"
        />
        <h1 v-if="!collapsed">Admin DDSC</h1>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="items"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :avatar="{
            src: dataUser?.logo ?? '',
            size: 'lg',
          }"
          color="neutral"
          variant="ghost"
          to="/profile"
          class="w-full"
          :block="collapsed"
          size="lg"
        >
          <div class="w-full flex flex-col gap-1 justify-start items-start">
            <h1 class="text-lg">{{ dataUser?.name }}</h1>
            <h4 class="text-sm">{{ dataUser?.role }}</h4>
          </div>
        </UButton>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <UDashboardNavbar title="Panel de control">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <USlideover title="Notificaciones">
            <UChip
              color="error"
              :show="show"
              :text="countUnRead"
              size="3xl"
              inset
            >
              <UButton icon="i-lucide-bell" variant="ghost" color="neutral" />
            </UChip>

            <template #body>
              <div
                class="space-y-3 scroll-y-auto"
                v-if="notifications.length > 0"
              >
                <!-- Header acciones -->
                <div class="flex justify-end items-center">
                  <UButton
                    size="xs"
                    variant="ghost"
                    icon="i-lucide-check-check"
                    @click="markAllAsSeen"
                  >
                    Marcar todo
                  </UButton>
                </div>

                <!-- Lista -->

                <UCard
                  v-for="noti in notifications"
                  :key="noti.id"
                  :variant="noti.status === 'read' ? 'outline' : 'soft'"
                  class="w-full"
                >
                  <div
                    class="flex items-start gap-3"
                    @click="gotToNotification(noti)"
                  >
                    <!-- Icono -->
                    <div class="mt-1 relative">
                      <UChip
                        color="error"
                        :show="noti.status === 'unread'"
                        size="sm"
                        inset
                      >
                        <UIcon
                          size="xl"
                          name="i-lucide-bell"
                          class="text-gray-500 dark:text-gray-400"
                        />
                      </UChip>

                      <!-- Indicador no leído -->
                    </div>

                    <!-- Contenido -->
                    <div class="flex-1">
                      <p
                        class="text-sm"
                        :class="
                          noti.status === 'read'
                            ? 'text-gray-500'
                            : 'text-gray-800 dark:text-gray-200 font-medium'
                        "
                      >
                        {{ noti.title }}
                      </p>

                      <span class="text-xs text-gray-500">
                        {{ formatDate(noti.updated_at) }}
                      </span>
                    </div>

                    <!-- Acciones -->
                    <div class="flex items-center gap-1">
                      <!-- Marcar como visto -->
                      <UButton
                        v-if="noti.status === 'unread'"
                        size="xs"
                        variant="ghost"
                        icon="i-lucide-check"
                        @click="markAsSeen(noti.id)"
                      />

                      <!-- Eliminar -->
                      <UButton
                        size="xs"
                        variant="ghost"
                        color="error"
                        icon="i-lucide-trash"
                        @click="removeNotification(noti.id)"
                      />
                    </div>
                  </div>
                </UCard>
              </div>
              <h1 v-else>Sin Notificaciones</h1>
            </template>
          </USlideover>
          <UButton
            icon="i-lucide-log-out"
            color="error"
            variant="ghost"
            @click="handleLogout"
          />
        </template>
      </UDashboardNavbar>

      <UContainer class="p-6 scrollbar-thin overflow-y-auto">
        <slot />
      </UContainer>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import useToastAlerts from "~/utils/toastAlerts";
const {
  fetchAllNotifications,
  fetchReadAllNotifications,
  fetchUnReadCount,
  fetchReadNotifications,
  fetchDeleteNotification,
} = useNotifications();
const router = useRouter();
const { clearToken, decodeToken } = useAuth();
const show = ref(false);
const countUnRead = ref(0);
const { showToast } = useToastAlerts();
const dataUser = ref<tokenData>();

const handleLogout = async () => {
  clearToken();
  await router.push("/login");
};

const items = ref<NavigationMenuItem[]>([
  {
    label: "Inicio",
    icon: "i-lucide-house",
    to: "/",
  },
  {
    label: "Mods",
    icon: "i-lucide-book-open",
    to: "/mods",
    open: true,
    children: [
      {
        label: "Agregar Mod",
        icon: "i-lucide-book-plus",
        to: "/mods/create",
      },
      {
        label: "Estadisticas",
        icon: "i-lucide-bar-chart-2",
        to: "/mods/stats",
      },
    ],
    //badge: "4",
  },
  {
    label: "Solicitudes",
    icon: "i-lucide-inbox",
    to: "/requests",
  },
]);

const notifications = ref<NotificationsData[]>([]);

const markAsSeen = async (id: number) => {
  const response = await fetchReadNotifications(id);
  showToast(response);
};

const markAllAsSeen = async () => {
  const response = await fetchReadAllNotifications();
  showToast(response);
};

const removeNotification = async (id: number) => {
  const response = await fetchDeleteNotification(id);
  showToast(response);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "No especificada";

  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("es-MX", options);
  } catch {
    return dateString;
  }
};

onBeforeMount(async () => {
  dataUser.value = decodeToken() as tokenData;
  if (dataUser?.value?.role !== "uploader") {
    items.value = [
      ...items.value,
      {
        label: "Colleciones",
        icon: "i-lucide-library",
        to: "/collections",
      },
      {
        label: "Generos",
        icon: "i-lucide-bookmark",
        to: "/genres",
      },

      {
        label: "Usuarios",
        icon: "i-lucide-users",
        to: "/users",
      },
    ];
  }
  const response = await fetchUnReadCount();
  if (response.data && response.success) {
    show.value = response.data.unread_count === 0 ? false : true;
    countUnRead.value = response.data.unread_count;
  }
});

const gotToNotification = (notification: NotificationsData) => {
  console.log(notification.type);
  if (
    notification.type === "mod_pending_review" &&
    dataUser.value?.role !== "uploader"
  ) {
    markAsSeen(notification.id);
    router.push(`/requests/detail/${notification.id_mod}`);
    return;
  }
};

onMounted(async () => {
  const response = await fetchAllNotifications();
  if (response.success && response.data) {
    notifications.value = response.data;
  }
});
</script>

<style scoped></style>
