<template>
  <div class="space-y-6">
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Editar Mod: {{ modDataBase.name }}
      </h1>
    </div>
    <UButton
      class="fixed top-30 right-10"
      @click="closeAllToasts"
      icon="i-lucide-bell-off"
      variant="ghost"
    />

    <UContainer
      class="w-full flex items-center justify-evenly mb-5 gap-5 flex-wrap"
    >
      <UCard class="flex flex-col gap-5 w-80" variant="soft">
        <template #header>
          <h2 class="text-xl font-semibold">Imágenes</h2>
        </template>
        <p class="mb-5">Editar Logo e Imagen Principal</p>
        <template #footer>
          <UModal title="Editar Logo e Imagen">
            <UButton class="w-full" variant="subtle" icon="i-lucide-image"
              >Editar Logo/Imagen
            </UButton>
            <template #body>
              <div class="space-y-4 p-5 w-full">
                <UContainer
                  class="grid grid-cols-2 gap-5 p-0 items-center justify-center w-full"
                >
                  <NuxtImg
                    :src="logoUrl"
                    alt="Logo del Mod"
                    class="h-fit w-full object-contain rounded"
                  />

                  <UFormField label="Logo" class="w-full">
                    <UFileUpload
                      v-model="logoToUpload.file"
                      accept="image/svg,image/png,image/jpeg,image/webp"
                      label="Suelta o haz click aquí"
                      class="w-full min-h-48"
                      icon="i-lucide-image"
                      description="SVG, PNG, JPG o WEBP (max. 2MB)"
                    />
                  </UFormField>
                </UContainer>
                <UButton
                  class="w-full"
                  variant="subtle"
                  icon="i-lucide-image"
                  @click="handleUploadLogo"
                  >Actualizar Logo
                </UButton>
                <USeparator />
                <UContainer
                  class="grid grid-cols-2 gap-5 justify-center items-center w-full"
                >
                  <NuxtImg
                    :src="mainImageUrl"
                    alt="Imagen Principal del Mod"
                    class="h-fit w-full object-contain rounded"
                  />
                  <UFormField label="Imagen Principal">
                    <UFileUpload
                      v-model="mainImageToUpload.file"
                      accept="image/svg,image/png,image/jpeg,image/webp"
                      label="Suelta o haz click aquí"
                      class="w-full min-h-48"
                      icon="i-lucide-image"
                      description="SVG, PNG, JPG o WEBP (max. 2MB)"
                    />
                  </UFormField>
                </UContainer>
                <UButton
                  class="w-full"
                  variant="subtle"
                  icon="i-lucide-image"
                  @click="handleUploadMainImage"
                  >Actualizar Imagen Principal
                </UButton>
              </div>
            </template>
          </UModal>
        </template>
      </UCard>

      <UCard class="flex flex-col gap-5 w-80" variant="soft">
        <template #header>
          <h2 class="text-xl font-semibold">Capturas</h2>
        </template>
        <p class="mb-5">Editar Capturas</p>
        <template #footer>
          <UModal title="Editar Capturas">
            <UButton class="w-full" variant="subtle" icon="i-lucide-image"
              >Editar Capturas
            </UButton>
            <template #body>
              <div class="space-y-4 p-5 w-full">
                <div
                  v-for="(screenshot, index) in screenshotsToUpload"
                  :key="screenshot.id"
                  class="flex flex-col"
                >
                  <UContainer
                    class="grid grid-cols-2 gap-5 mb-5 p-0 items-center justify-center w-full"
                  >
                    <NuxtImg
                      :src="screenshot.currency_url"
                      alt="Captura del Mod"
                      class="h-fit w-full object-contain rounded"
                    />

                    <UFormField :label="`Captura ${index + 1}`" class="w-full">
                      <UFileUpload
                        v-model="screenshot.file"
                        accept="image/svg,image/png,image/jpeg,image/webp"
                        label="Suelta o haz click aquí"
                        class="w-full min-h-48"
                        icon="i-lucide-image"
                        description="SVG, PNG, JPG o WEBP (max. 2MB)"
                      />
                    </UFormField>
                  </UContainer>
                  <UButton
                    class="w-full"
                    variant="subtle"
                    icon="i-lucide-image"
                    @click="handleUploadScreenshot(screenshot.id)"
                    >Actualizar Captura
                  </UButton>
                  <USeparator class="w-full my-4" />
                </div>

                <UContainer
                  v-if="screenshotsToUpload.length < 4"
                  class="flex flex-col gap-5 justify-center items-center w-full p-0"
                >
                  <UFormField label="Subir Nueva Captura" class="w-full">
                    <UFileUpload
                      v-model="uploadNewScreenshot"
                      accept="image/svg,image/png,image/jpeg,image/webp"
                      label="Suelta o haz click aquí"
                      class="w-full min-h-48"
                      icon="i-lucide-image"
                      description="SVG, PNG, JPG o WEBP (max. 2MB)"
                    />
                  </UFormField>
                  <UButton
                    class="w-full"
                    variant="subtle"
                    icon="i-lucide-upload"
                    @click="handleNewScreenshot"
                    >Subir
                  </UButton>
                </UContainer>
              </div>
            </template>
          </UModal>
        </template>
      </UCard>

      <UCard
        class="flex flex-col gap-5 w-90"
        variant="soft"
        v-if="tokenData?.role !== 'uploader'"
      >
        <template #header>
          <h2 class="text-xl font-semibold">Colecciones</h2>
        </template>
        <p class="mb-5">Edita o agrega colecciones a este mod.</p>
        <template #footer>
          <UModal title="Editar Colecciones">
            <UButton class="w-full" variant="subtle" icon="i-lucide-library"
              >Editar Colecciones
            </UButton>
            <template #body>
              <div class="space-y-4 p-5 w-full flex flex-col">
                <div class="w-full p-0">
                  <h2 class="text-xl font-semibold mb-3">
                    Colecciones Vinculadas
                  </h2>
                  <div v-if="coleectionsMod.length === 0" class="text-gray-500">
                    No hay colecciones vinculadas a este mod.
                  </div>
                  <div v-else class="space-y-3">
                    <UContainer
                      v-for="collection in coleectionsMod"
                      :key="collection.resource.id"
                      class="flex items-center justify-between p-3 rounded gap-5"
                    >
                      <UFormField label="Colección:" class="w-90">
                        <USelect
                          v-model="collection.resource.collection.id"
                          :items="collectionOptions"
                          value-key="value"
                          class="w-full"
                          @change="
                            handleUpdateCollection(
                              modDataBase.id,
                              collection.resource.collection.id,
                            )
                          "
                        />
                      </UFormField>
                      <UFormField label="Activo" class="w-24">
                        <USwitch
                          v-model="collection.info.is_active"
                          @change="
                            handleUpdateCollectionStatus(
                              collection.resource.id,
                              collection.info.is_active,
                            )
                          "
                        />
                      </UFormField>
                    </UContainer>
                  </div>
                </div>
                <USeparator />
                <div
                  class="flex flex-col gap-5 justify-center items-center w-full p-0"
                >
                  <UFormField label="Seleccionar Colección" class="w-full">
                    <USelect
                      v-model="selectedCollection"
                      :items="collectionOptions"
                      value-key="value"
                      class="w-full"
                    />
                  </UFormField>
                  <UButton
                    class="w-full"
                    variant="subtle"
                    icon="i-lucide-plus"
                    @click="handleNewCollection"
                    >Vincular a Colección
                  </UButton>
                </div>
              </div>
            </template>
          </UModal>
        </template>
      </UCard>

      <UCard class="flex flex-col gap-5 w-80" variant="soft">
        <template #header>
          <h2 class="text-xl font-semibold">Géneros</h2>
        </template>
        <p class="mb-5">Edita o agrega géneros a este mod.</p>
        <template #footer>
          <UModal title="Editar Géneros">
            <UButton class="w-full" variant="subtle" icon="i-lucide-bookmark"
              >Editar Géneros
            </UButton>
            <template #body>
              <div class="space-y-4 p-5 w-full flex flex-col">
                <div class="w-full p-0">
                  <h2 class="text-xl font-semibold mb-3">Géneros Vinculados</h2>
                  <div v-if="gendersMod.length === 0" class="text-gray-500">
                    No hay géneros vinculados a este mod.
                  </div>
                  <div v-else class="space-y-3">
                    <div
                      v-for="(genre, index) in gendersMod"
                      :key="genre.resource.id"
                      class="flex w-full items-center justify-between p-3 rounded gap-5"
                    >
                      <UFormField label="Género:" class="w-90">
                        <USelect
                          v-model="genre.resource.genre.id"
                          :items="gendersOptions"
                          value-key="value"
                          class="w-full"
                          @change="
                            handleUpdateGenre(
                              modDataBase.id,
                              genre.resource.genre.id,
                            )
                          "
                        />
                      </UFormField>
                      <UFormField
                        label="Activo"
                        class="w-30"
                        v-if="tokenData?.role !== 'uploader'"
                      >
                        <USwitch
                          v-model="genre.info.is_active"
                          @change="
                            handleUpdateGenreStatus(
                              genre.resource.id,
                              genre.info.is_active,
                            )
                          "
                        />
                      </UFormField>
                    </div>
                  </div>
                </div>
                <USeparator />
                <div
                  class="flex flex-col gap-5 justify-center items-center w-full p-0"
                >
                  <UFormField label="Seleccionar Género" class="w-full">
                    <USelect
                      v-model="genderSelected"
                      :items="gendersOptions"
                      value-key="value"
                      class="w-full"
                    />
                  </UFormField>
                  <UButton
                    class="w-full"
                    variant="subtle"
                    icon="i-lucide-plus"
                    @click="handleNewGenre"
                    >Vincular a Género
                  </UButton>
                </div>
              </div>
            </template>
          </UModal>
        </template>
      </UCard>

      <UCard class="flex flex-col gap-5 w-80" variant="soft">
        <template #header>
          <h2 class="text-xl font-semibold">Detalles</h2>
        </template>
        <p class="mb-5">Edita la información de este mod.</p>
        <template #footer>
          <UModal title="Editar Datos">
            <UButton class="w-full" variant="subtle" icon="i-lucide-edit"
              >Editar Datos
            </UButton>
            <template #body>
              <div class="space-y-4 p-5 w-full flex flex-col">
                <UFormField label="Nombre del Mod" class="w-full">
                  <UInput v-model="modDataBase.name" class="w-full" />
                </UFormField>
                <UFormField label="Tipo" name="type" required>
                  <USelect
                    v-model="modDataBase.type"
                    :items="typeOptions"
                    placeholder="Selecciona el Tipo"
                    value-key="value"
                    icon="i-lucide-book-type"
                    required
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  label="Descripción (Editor WYSIWYG)"
                  name="description"
                  required
                >
                  <QuillEditor
                    theme="snow"
                    contentType="html"
                    toolbar="essential"
                    placeholder="Tu descripción aquí"
                    v-model:content="modDataBase.description"
                  />

                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Editor enriquecido con formatos: negrita, cursiva,
                    subrayado, títulos, listas y más.
                  </p>
                </UFormField>

                <UFormField label="Estado" name="status" required>
                  <USelect
                    v-model="modDataBase.status"
                    :items="statusOptions"
                    placeholder="Selecciona el estado"
                    value-key="value"
                    icon="i-lucide-circle-dot"
                    required
                    class="w-full"
                  />
                </UFormField>

                <!-- Duration Select -->
                <UFormField label="Duración" name="duration" required>
                  <USelect
                    v-model="modDataBase.duration"
                    :items="durationOptions"
                    placeholder="Selecciona la duración"
                    value-key="value"
                    icon="i-lucide-clock"
                    required
                    class="w-full"
                  />
                </UFormField>

                <!-- Character Select -->
                <UFormField label="Personaje" name="character" required>
                  <USelect
                    v-model="modDataBase.character"
                    :items="characterOptions"
                    placeholder="Selecciona el personaje"
                    icon="i-lucide-user-circle"
                    value-key="value"
                    required
                    class="w-full"
                  />
                </UFormField>

                <!-- Release Date Input (Optional) -->
                <UFormField label="Fecha de lanzamiento" name="releaseDate">
                  <UInput
                    v-model="modDataBase.created_at"
                    type="date"
                    icon="i-lucide-calendar"
                    class="w-full"
                  />
                  <template #help>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Este campo es opcional. Ingresa la fecha que fué lanzado
                      el mod.
                    </p>
                  </template>
                </UFormField>

                <UFormField
                  label="Enlace para descargar (PC)"
                  name="download_pc"
                >
                  <UInput
                    v-model="downloadPcModel"
                    type="text"
                    placeholder="https://..."
                    icon="i-lucide-link"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Enlace para descargar (APK)"
                  name="download_android"
                >
                  <UInput
                    v-model="downloadAndroidModel"
                    type="text"
                    placeholder="https://..."
                    icon="i-lucide-link"
                    class="w-full"
                  />
                </UFormField>

                <UButton
                  class="w-full"
                  variant="subtle"
                  icon="i-lucide-refresh-ccw"
                  @click="handleUpdateMod"
                  >Editar Información del Mod
                </UButton>
              </div>
            </template>
          </UModal>
        </template>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import useToastAlerts from "~/utils/toastAlerts";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { QuillEditor } from "@vueup/vue-quill";
const { fetchModByID, fetchModByIDAdmin, fetchUpdateMod } = useMods();
const { fetchAllCollections } = useCollections();
const {
  fetchAllModsCollection,
  fetchCreateModCollection,
  fetchUpdateModCollection,
  fetchUpdateModStatusCollection,
} = useModsCollections();
const {
  fetchCreateScreenshot,
  fetchUpdateLogo,
  fetchUpdateMainImage,
  fetchUpdateScreenshot,
} = useModsImagesUpdates();
const { fetchAllGenresForSelect } = useGenres();
const {
  fetchAllModsGenres,
  fetchCreateModGenre,
  fetchUpdateStatusModGenre,
  fetchUpdateModGenre,
} = useModsGenres();
const { showToast, closeAllToasts } = useToastAlerts();
const { decodeToken } = useAuth();
const route = useRoute();
const router = useRouter();
const modId = ref(Number(route.params.id));
const selectedCollection = ref<number>(0);
const tokenData = ref<tokenData | null>(null);
const items = ref<BreadcrumbItem[]>([
  {
    label: "Mods",
    icon: "i-lucide-book-open",
    to: "/mods",
  },
  {
    label: "Editar Mod",
    icon: "i-lucide-edit",
    to: `/mods/edit/${modId.value}`,
  },
]);

const modDataBase = ref<Mod>({
  id: 0,
  name: "",
  description: "",
  slug: "",
  duration: "short",
  character: "monika",
  status: "unknown",
  type: "translation",
  images: [],
  genres: [],
  required_revision: false,
  download_pc: "",
  download_android: "",
  created_at: "",
});

const statusOptions: { value: Status; label: string }[] = [
  { value: "under_development", label: "En Desarrollo" },
  { value: "stable", label: "Terminado" },
  { value: "beta", label: "Demo" },
  { value: "legacy", label: "Matenimiento" },
  { value: "abandoned", label: "Descontinuado" },
  { value: "archived", label: "Archivado" },
  { value: "on_ice", label: "En Pausa" },
  { value: "unknown", label: "Desconocido" },
];

// Opciones de duración
const durationOptions: { value: Duration; label: string }[] = [
  { value: "very_short", label: "Muy Corto" },
  { value: "short", label: "Corto" },
  { value: "medium", label: "Medio" },
  { value: "long", label: "Largo" },
  { value: "very_long", label: "Muy Largo" },
  { value: "endless", label: "Infinito" },
  { value: "unknown", label: "Desconocido" },
];

// Opciones de personaje
const characterOptions: { value: Character; label: string }[] = [
  { value: "mc", label: "MC" },
  { value: "yuri", label: "Yuri" },
  { value: "monika", label: "Monika" },
  { value: "natsuki", label: "Natsuki" },
  { value: "sayori", label: "Sayori" },
  { value: "oc", label: "Original" },
];

const typeOptions: { value: ModType; label: string }[] = [
  { value: "translation", label: "Traducción" },
  { value: "original", label: "Mod Original" },
];

const genderSelected = ref<number>(0);
const logoUrl = ref<string>("");
const mainImageUrl = ref<string>("");

const logoToUpload = ref<{ id: number; file: File | null }>({
  id: 0,
  file: null,
});

const mainImageToUpload = ref<{ id: number; file: File | null }>({
  id: 0,
  file: null,
});

const screenshotsToUpload = ref<
  { id: number; currency_url: string; file: File | null }[]
>([]);

const gendersOptions = ref<{ value: number; label: string }[]>([]);
const collectionOptions = ref<{ value: number; label: string }[]>([]);
const gendersMod = ref<ModGenreResponse[]>([]);
const coleectionsMod = ref<ModsCollectionResponse[]>([]);

const uploadNewScreenshot = ref<File | null>(null);
/* TODO: Functions to get Data*/

const getModById = async (id: number) => {
  tokenData.value = decodeToken();
  const response =
    tokenData.value?.role === "uploader"
      ? await fetchModByID(id)
      : await fetchModByIDAdmin(id);
  showToast(response);
  if (response.success && response.data) {
    Object.assign(modDataBase.value, {
      ...response.data.resource,
      created_at: response.data.info.created_at.split("T")[0] ?? "",
    });
    if (modDataBase.value.images.length > 0) {
      const logoData = modDataBase.value.images.find(
        (img) => img.type === "logo",
      );
      if (logoData) {
        logoToUpload.value.id = logoData.id;
        logoUrl.value = logoData.url;
      }
      const mainImageData = modDataBase.value.images.find(
        (img) => img.type === "main",
      );
      if (mainImageData) {
        mainImageToUpload.value.id = mainImageData.id;
        mainImageUrl.value = mainImageData.url;
      }
      const screenshotsData = modDataBase.value.images.filter(
        (img) => img.type === "screenshot",
      );
      if (screenshotsData.length > 0) {
        screenshotsToUpload.value = screenshotsData.map((img) => ({
          id: img.id,
          currency_url: img.url,

          file: null,
        }));
      } else {
        screenshotsToUpload.value = [];
      }
    }
  }
};

const downloadPcModel = computed({
  get: () => modDataBase.value.download_pc ?? "",
  set: (val: string) => {
    modDataBase.value.download_pc = val || null;
  },
});

const downloadAndroidModel = computed({
  get: () => modDataBase.value.download_android ?? "",
  set: (val: string) => {
    modDataBase.value.download_android = val || null;
  },
});

const getAllCollections = async () => {
  const response = await fetchAllCollections();
  showToast(response);
  if (response.success && response.data) {
    collectionOptions.value = response.data.map((collection) => {
      return {
        value: collection.resource.id,
        label: collection.resource.name,
      };
    });
  }
};

const getAllModsCollection = async () => {
  const response = await fetchAllModsCollection(modDataBase.value.id);
  showToast(response);
  if (response.success && response.data) {
    coleectionsMod.value = response.data;
  }
};

const getAllGenresForSelect = async () => {
  const response = await fetchAllGenresForSelect();
  showToast(response);
  if (response.success && response.data) {
    gendersOptions.value = response.data.map((genre) => {
      return {
        value: genre.resource.id,
        label: genre.resource.name,
      };
    });
  }
};

const getAllModsGenres = async () => {
  const response = await fetchAllModsGenres(modDataBase.value.id);
  showToast(response);
  if (response.success && response.data) {
    gendersMod.value = response.data;
  }
};

/* TODO: functions to upload/create images*/

const handleUploadLogo = async () => {
  if (!logoToUpload.value.file) {
    showToast({
      success: false,
      message: "Por favor, selecciona un archivo de logo.",
    });
    return;
  }
  const response = await fetchUpdateLogo(
    modDataBase.value.id,
    logoToUpload.value.file,
  );
  showToast(response);
  if (response.success && response.data) {
    logoUrl.value = response.data.resource.url;
  }
};

const handleUploadMainImage = async () => {
  if (!mainImageToUpload.value.file) {
    showToast({
      success: false,
      message: "Por favor, selecciona un archivo de imagen principal.",
    });
    return;
  }
  const response = await fetchUpdateMainImage(
    modDataBase.value.id,
    mainImageToUpload.value.file,
  );
  showToast(response);
  if (response.success && response.data) {
    mainImageUrl.value = response.data.resource.url;
  }
};

const handleUploadScreenshot = async (screenshotId: number) => {
  const screenshot = screenshotsToUpload.value.find(
    (s) => s.id === screenshotId,
  );
  if (!screenshot || !screenshot.file) {
    showToast({
      success: false,
      message: "Por favor, selecciona un archivo de captura.",
    });
    return;
  }
  const response = await fetchUpdateScreenshot(screenshotId, screenshot.file);
  showToast(response);
  if (response.success && response.data) {
    const updatedScreenshot = response.data.resource;
    const index = screenshotsToUpload.value.findIndex(
      (s) => s.id === updatedScreenshot.id,
    );
    if (index !== -1) {
      const screenshotToUpdate = screenshotsToUpload.value[index];
      if (screenshotToUpdate) {
        screenshotToUpdate.currency_url = updatedScreenshot.url;
      }
    }
  }
};

const handleNewScreenshot = async () => {
  if (!uploadNewScreenshot.value) {
    showToast({
      success: false,
      message: "Por favor, selecciona un archivo de captura.",
    });
    return;
  }
  const response = await fetchCreateScreenshot(
    modDataBase.value.id,
    uploadNewScreenshot.value,
  );
  showToast(response);
  await getModById(modId.value);
};

const handleNewCollection = async () => {
  if (!selectedCollection.value) {
    showToast({
      success: false,
      message: "Por favor, selecciona una colección.",
    });
    return;
  }
  const response = await fetchCreateModCollection(
    modDataBase.value.id,
    selectedCollection.value,
  );
  showToast(response);
  await getModById(modId.value);
};

const handleUpdateCollectionStatus = async (
  modID: number,
  isActive: boolean,
) => {
  const response = await fetchUpdateModStatusCollection(modID, isActive);
  showToast(response);
  await getModById(modId.value);
};

const handleUpdateCollection = async (modID: number, collection_id: number) => {
  const response = await fetchUpdateModCollection(modID, collection_id);
  showToast(response);
  await getModById(modId.value);
};

const handleNewGenre = async () => {
  if (!genderSelected.value) {
    showToast({
      success: false,
      message: "Por favor, selecciona un género.",
    });
    return;
  }
  const response = await fetchCreateModGenre(
    modDataBase.value.id,
    genderSelected.value,
  );
  showToast(response);
  await getModById(modId.value);
};

const handleUpdateGenreStatus = async (modID: number, isActive: boolean) => {
  const response = await fetchUpdateStatusModGenre(modID, isActive);
  showToast(response);
  await getModById(modId.value);
};

const handleUpdateGenre = async (modID: number, genreID: number) => {
  const response = await fetchUpdateModGenre(modID, genreID);
  showToast(response);
  await getModById(modId.value);
};

const handleUpdateMod = async () => {
  let data = modDataBase.value;

  data = {
    ...data,
    download_pc:
      downloadPcModel.value.trim() === "" ? null : downloadPcModel.value,
    download_android:
      downloadAndroidModel.value.trim() === ""
        ? null
        : downloadAndroidModel.value,
  };
  const response = await fetchUpdateMod(modDataBase.value.id, data);
  showToast(response);
  await getModById(modId.value);
};

/*TODO: carga de datos inicial */

onBeforeMount(async () => {
  await getModById(modId.value);
  if (
    modDataBase.value.required_revision === true &&
    !modDataBase.value.images.some((item) => item.type === "logo") &&
    !modDataBase.value.images.some((item) => item.type === "main")
  ) {
    router.back();
    showToast({
      success: false,
      message:
        "El mod no puede editarse porque requiere revisión y no tiene imágenes de logo o principal.",
    });
  }
  document.title = `Editar Mod: ${modDataBase.value.name} - DDSC Admin`;
  if (tokenData.value?.role !== "uploader") {
    await getAllCollections();
    await getAllModsCollection();
  }
  await getAllGenresForSelect();
  await getAllModsGenres();
});
</script>

<style scoped></style>
