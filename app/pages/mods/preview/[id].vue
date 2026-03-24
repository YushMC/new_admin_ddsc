<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ modDataBase?.name }}
      </h1>
    </div>

    <!-- Main Content -->
    <div v-if="modDataBase" class="space-y-6">
      <!-- Gallery Section -->
      <UContainer
        class="w-full flex flex-col lg:flex-row gap-6 items-start justify-between"
      >
        <!-- Images -->
        <div class="w-full lg:w-2/3">
          <UCard variant="soft">
            <template #header>
              <h2 class="text-xl font-semibold">Galería</h2>
            </template>

            <!-- Main Image -->
            <div class="mb-6">
              <NuxtImg
                v-if="mainImageUrl"
                :src="mainImageUrl"
                alt="Imagen Principal del Mod"
                class="w-full h-96 object-cover rounded-lg"
              />
              <div
                v-else
                class="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
              >
                <p class="text-gray-500 dark:text-gray-400">
                  No hay imagen principal
                </p>
              </div>
            </div>

            <!-- Thumbnails -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <!-- Logo -->
              <div
                v-if="logoUrl"
                class="cursor-pointer hover:opacity-80 transition-opacity"
                @click="selectImage('logo', logoUrl)"
              >
                <NuxtImg
                  :src="logoUrl"
                  alt="Logo del Mod"
                  class="w-full h-32 object-cover rounded border-2"
                  :class="
                    mainImageUrl === logoUrl
                      ? 'border-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  "
                />
                <p class="text-sm text-center mt-1 text-gray-500">Logo</p>
              </div>

              <!-- Screenshots -->
              <div
                v-for="(screenshot, index) in screenshotsToShow"
                :key="screenshot.id"
                class="cursor-pointer hover:opacity-80 transition-opacity"
                @click="selectImage(`screenshot-${index}`, screenshot.url)"
              >
                <NuxtImg
                  :src="screenshot.url"
                  :alt="`Captura ${index + 1}`"
                  class="w-full h-32 object-cover rounded border-2"
                  :class="
                    mainImageUrl === screenshot.url
                      ? 'border-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  "
                />
                <p class="text-sm text-center mt-1 text-gray-500">
                  Captura {{ index + 1 }}
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Logo & Info -->
        <div class="w-full lg:w-1/3 space-y-4">
          <!-- Logo Card -->
          <UCard variant="soft">
            <template #header>
              <h2 class="text-lg font-semibold">Logo</h2>
            </template>

            <NuxtImg
              v-if="logoUrl"
              :src="logoUrl"
              alt="Logo del Mod"
              class="w-full h-48 object-contain rounded"
            />
            <div
              v-else
              class="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"
            >
              <p class="text-gray-500 dark:text-gray-400">Sin logo</p>
            </div>
          </UCard>

          <!-- Quick Info -->
          <UCard variant="soft">
            <template #header>
              <h2 class="text-lg font-semibold">Información Rápida</h2>
            </template>

            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Tipo</p>
                <UBadge class="capitalize">
                  {{
                    modDataBase?.type === "translation"
                      ? "Traducción"
                      : "Original"
                  }}
                </UBadge>
              </div>

              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                <UBadge
                  :color="getStatusColor(modDataBase?.status)"
                  class="capitalize"
                >
                  {{ formatStatus(modDataBase?.status) }}
                </UBadge>
              </div>

              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Duración</p>
                <p class="font-medium capitalize">
                  {{ formatDuration(modDataBase?.duration) }}
                </p>
              </div>

              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Personaje
                </p>
                <p class="font-medium capitalize">
                  {{ formatCharacter(modDataBase?.character) }}
                </p>
              </div>

              <div v-if="modDataBase?.created_at">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Fecha de Lanzamiento
                </p>
                <p class="font-medium">
                  {{ formatDate(modDataBase.created_at) }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </UContainer>

      <!-- Description Section -->
      <UCard variant="soft">
        <template #header>
          <h2 class="text-xl font-semibold">Descripción</h2>
        </template>

        <div
          v-if="modDataBase.description"
          class="prose dark:prose-invert max-w-none"
          v-html="modDataBase.description"
        />
        <div v-else class="text-gray-500 dark:text-gray-400">
          Sin descripción disponible
        </div>
      </UCard>

      <!-- Additional Info -->
      <UContainer
        class="w-full flex items-center justify-between gap-5 flex-wrap"
      >
        <!-- Géneros -->
        <UCard class="flex flex-col gap-5 flex-1 min-w-64" variant="soft">
          <template #header>
            <h2 class="text-lg font-semibold">Géneros</h2>
          </template>

          <div v-if="gendersMod.length > 0" class="space-y-2">
            <div
              v-for="(genre, index) in gendersMod"
              :key="index"
              class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded"
            >
              <span class="font-medium">{{ genre.resource.genre.name }}</span>
              <UBadge
                :color="genre.info.is_active ? 'success' : 'error'"
                variant="subtle"
              >
                {{ genre.info.is_active ? "Activo" : "Inactivo" }}
              </UBadge>
            </div>
          </div>
          <p v-else class="text-gray-500 dark:text-gray-400 text-center py-4">
            Sin géneros vinculados
          </p>
        </UCard>

        <!-- Colecciones -->
        <UCard class="flex flex-col gap-5 flex-1 min-w-64" variant="soft">
          <template #header>
            <h2 class="text-lg font-semibold">Colecciones</h2>
          </template>

          <div v-if="coleectionsMod.length > 0" class="space-y-2">
            <div
              v-for="collection in coleectionsMod"
              :key="collection.resource.id"
              class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded"
            >
              <span class="font-medium">
                {{ collection.resource.collection.name }}
              </span>
              <UBadge
                :color="collection.info.is_active ? 'success' : 'error'"
                variant="subtle"
              >
                {{ collection.info.is_active ? "Activo" : "Inactivo" }}
              </UBadge>
            </div>
          </div>
          <p v-else class="text-gray-500 dark:text-gray-400 text-center py-4">
            Sin colecciones vinculadas
          </p>
        </UCard>
      </UContainer>

      <!-- Download Links -->
      <UCard variant="soft">
        <template #header>
          <h2 class="text-xl font-semibold">Descargas</h2>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">PC</p>
            <UButton
              v-if="modDataBase.download_pc"
              external
              :to="modDataBase.download_pc"
              target="_blank"
              icon="i-lucide-download"
              class="w-full"
              variant="soft"
            >
              Descargar para PC
            </UButton>
            <p v-else class="text-gray-500 dark:text-gray-400">
              Sin enlace de descarga
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              APK (Android)
            </p>
            <UButton
              v-if="modDataBase.download_android"
              external
              :to="modDataBase.download_android"
              target="_blank"
              icon="i-lucide-download"
              class="w-full"
              variant="soft"
            >
              Descargar APK
            </UButton>
            <p v-else class="text-gray-500 dark:text-gray-400">
              Sin enlace de descarga
            </p>
          </div>
        </div>
      </UCard>

      <!-- Credits Section -->
      <UCard variant="soft" v-if="credits">
        <template #header>
          <h2 class="text-xl font-semibold">Créditos</h2>
        </template>
        <div class="space-y-4">
          <!-- Creators -->
          <div v-if="credits.creators.length > 0">
            <h3 class="text-lg font-semibold mb-3">Creadores</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(credit, index) in credits.creators"
                :key="index"
                class="p-3 bg-gray-100 dark:bg-gray-800 rounded"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {{ formatRole(credit.type) }}
                </p>
                <p class="font-medium">
                  {{ credit.user?.name || credit.name }}
                </p>
              </div>
            </div>
          </div>

          <!-- Porters -->
          <div v-if="credits.porters.length > 0">
            <h3 class="text-lg font-semibold mb-3">Portadores</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(credit, index) in credits.porters"
                :key="index"
                class="p-3 bg-gray-100 dark:bg-gray-800 rounded"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {{ formatRole(credit.type) }}
                </p>
                <p class="font-medium">
                  {{ credit.user?.name || credit.name }}
                </p>
              </div>
            </div>
          </div>

          <!-- Translators -->
          <div v-if="credits.translators.length > 0">
            <h3 class="text-lg font-semibold mb-3">Traductores</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(credit, index) in credits.translators"
                :key="index"
                class="p-3 bg-gray-100 dark:bg-gray-800 rounded"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {{ formatRole(credit.type) }}
                </p>
                <p class="font-medium">
                  {{ credit.user?.name || credit.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Action Buttons -->
      <div class="flex gap-4 flex-wrap">
        <UButton
          to="/mods"
          icon="i-lucide-arrow-left"
          variant="soft"
          color="info"
        >
          Volver
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Cargando mod...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import useToastAlerts from "~/utils/toastAlerts";

const { fetchModByID, fetchModByIDAdmin } = useMods();
const route = useRoute();
const modId = ref(Number(route.params.id));
const { showToast } = useToastAlerts();
const { decodeToken } = useAuth();
const { fetchAllModsGenres } = useModsGenres();
const { fetchAllModsCollection } = useModsCollections();

const modDataBase = ref<Mod>({
  id: 0,
  name: "",
  description: "",
  slug: "",
  duration: "unknown",
  character: "monika",
  status: "under_development",
  type: "translation",
  images: [],
  genres: [],
  required_revision: false,
  download_pc: null,
  download_android: null,
});
const credits = ref<CreditsResponse>({
  creators: [],
  porters: [],
  translators: [],
});
const gendersMod = ref<ModGenreResponse[]>([]);
const coleectionsMod = ref<ModsCollectionResponse[]>([]);

const logoUrl = ref<string>("");
const mainImageUrl = ref<string>("");
const screenshotsToShow = ref<ImagesInterface[]>([]);
const tokenData = ref<tokenData | null>(null);

const items = ref<BreadcrumbItem[]>([
  {
    label: "Mods",
    icon: "i-lucide-book-open",
    to: "/mods",
  },
  {
    label: "Detalle",
    icon: "i-lucide-eye",
  },
]);

// Funciones de formato
const formatStatus = (status: Status): string => {
  const statusMap: Record<Status, string> = {
    under_development: "En Desarrollo",
    stable: "Terminado",
    beta: "Demo",
    legacy: "Mantenimiento",
    abandoned: "Descontinuado",
    archived: "Archivado",
    on_ice: "En Pausa",
    unknown: "Desconocido",
  };
  return statusMap[status] || status;
};

const formatDuration = (duration: Duration): string => {
  const durationMap: Record<Duration, string> = {
    very_short: "Muy Corto",
    short: "Corto",
    medium: "Medio",
    long: "Largo",
    very_long: "Muy Largo",
    endless: "Infinito",
    unknown: "Desconocido",
  };
  return durationMap[duration] || duration;
};

const formatCharacter = (character: Character): string => {
  const characterMap: Record<Character, string> = {
    mc: "MC",
    yuri: "Yuri",
    monika: "Monika",
    natsuki: "Natsuki",
    sayori: "Sayori",
    oc: "Personaje Original",
  };
  return characterMap[character] || character;
};

const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    creator: "Creador",
    developer: "Desarrollador",
    translator: "Traductor",
    designer: "Diseñador",
    artist: "Artista",
    composer: "Compositor",
    writer: "Escritor",
  };
  return roleMap[role] || role;
};

const getStatusColor = (
  status: Status,
): "info" | "success" | "warning" | "error" | "neutral" => {
  const colorMap: Record<
    Status,
    "info" | "success" | "warning" | "error" | "neutral"
  > = {
    under_development: "success",
    stable: "success",
    beta: "info",
    legacy: "warning",
    abandoned: "error",
    archived: "neutral",
    on_ice: "info",
    unknown: "neutral",
  };
  return colorMap[status] || "neutral";
};

const selectImage = (type: string, url: string) => {
  mainImageUrl.value = url;
};

const getAllModsCollection = async () => {
  const response = await fetchAllModsCollection(modDataBase.value.id);
  showToast(response);
  if (response.success && response.data) {
    coleectionsMod.value = response.data;
  }
};

const getAllModsGenres = async () => {
  const response = await fetchAllModsGenres(modDataBase.value.id);
  showToast(response);
  if (response.success && response.data) {
    gendersMod.value = response.data;
  }
};

// Funciones de carga
const getModById = async (id: number) => {
  try {
    const response =
      tokenData.value?.role === "uploader"
        ? await fetchModByID(id)
        : await fetchModByIDAdmin(id);

    showToast(response);

    if (response.success && response.data) {
      modDataBase.value = {
        ...response.data.resource,
        created_at: response.data.info.created_at.split("T")[0] ?? "",
      };

      // Procesar imágenes
      if (
        response.data.resource.images &&
        response.data.resource.images.length > 0
      ) {
        const logoData = response.data.resource.images.find(
          (img) => img.type === "logo",
        );
        if (logoData) {
          logoUrl.value = logoData.url;
        }

        const mainImageData = response.data.resource.images.find(
          (img) => img.type === "main",
        );
        if (mainImageData) {
          mainImageUrl.value = mainImageData.url;
        }

        const screenshotsData = response.data.resource.images.filter(
          (img) => img.type === "screenshot",
        );
        screenshotsToShow.value = screenshotsData;
      }

      // Procesar créditos
      if (response.data.credits) {
        credits.value = response.data.credits;
      }
    }
  } catch (error) {
    showToast({
      success: false,
      message: "Error al cargar el mod",
    });
  }
};

onBeforeMount(async () => {
  tokenData.value = decodeToken();

  if (modId.value) {
    await getModById(modId.value);
    await getAllModsCollection();
    await getAllModsGenres();
  }

  if (modDataBase.value) {
    document.title = `${modDataBase.value.name} - DDSC Admin`;
  }
});
</script>
