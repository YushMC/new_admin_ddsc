<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Agregar Imágenes del Mod
      </h1>
    </div>

    <!-- Form Card -->
    <UCard class="flex justify-evenly gap-5">
      <UContainer class="flex justify-evenly gap-20">
        <form @submit.prevent="handleUploadImages" class="space-y-6 w-100">
          <!-- Logo Upload -->
          <UFormField label="Logo" name="logo" v-if="status.showLogoInputs">
            <div class="space-y-4">
              <div
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
                @click="triggerFileInput('logo')"
                @dragover.prevent="isDraggingLogo = true"
                @dragleave.prevent="isDraggingLogo = false"
                @drop.prevent="handleFileDrop($event, 'logo')"
                :class="
                  isDraggingLogo
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : ''
                "
              >
                <div v-if="!form.logo" class="space-y-2">
                  <UIcon
                    name="i-lucide-image"
                    class="mx-auto text-4xl text-gray-400"
                  />
                  <p
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Arrastra la imagen o haz clic para seleccionar
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF hasta 5MB
                  </p>
                </div>
                <div v-else class="space-y-2">
                  <img
                    :src="logoPrevew"
                    :alt="'Logo preview'"
                    class="h-32 mx-auto rounded object-contain"
                  />
                  <p class="text-sm text-blue-600 dark:text-blue-400">
                    {{ logoFileName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Haz clic para cambiar
                  </p>
                </div>
              </div>
              <input
                ref="logoInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect($event, 'logo')"
              />
              <UButton
                v-if="form.logo"
                @click="handleUploadImage('logo')"
                :loading="uploadingLogo"
                :disabled="uploadingLogo"
                size="md"
                icon="i-lucide-upload"
                color="info"
                block
              >
                Enviar Logo
              </UButton>
            </div>
          </UFormField>

          <!-- Main Image Upload -->
          <UFormField
            label="Imagen Principal"
            name="mainImage"
            v-if="status.showMainInputs"
          >
            <div class="space-y-4">
              <div
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
                @click="triggerFileInput('mainImage')"
                @dragover.prevent="isDraggingMain = true"
                @dragleave.prevent="isDraggingMain = false"
                @drop.prevent="handleFileDrop($event, 'mainImage')"
                :class="
                  isDraggingMain
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : ''
                "
              >
                <div v-if="!form.mainImage" class="space-y-2">
                  <UIcon
                    name="i-lucide-image"
                    class="mx-auto text-4xl text-gray-400"
                  />
                  <p
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Arrastra la imagen o haz clic para seleccionar
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF hasta 5MB
                  </p>
                </div>
                <div v-else class="space-y-2">
                  <img
                    :src="mainImagePreview"
                    :alt="'Main image preview'"
                    class="h-32 mx-auto rounded object-contain"
                  />
                  <p class="text-sm text-blue-600 dark:text-blue-400">
                    {{ mainImageFileName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Haz clic para cambiar
                  </p>
                </div>
              </div>
              <input
                ref="mainImageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect($event, 'mainImage')"
              />
              <UButton
                v-if="form.mainImage"
                @click="handleUploadImage('mainImage')"
                :loading="uploadingMain"
                :disabled="uploadingMain"
                size="md"
                icon="i-lucide-upload"
                color="info"
                block
              >
                Enviar Imagen Principal
              </UButton>
            </div>
          </UFormField>

          <!-- Screenshots -->
          <div class="space-y-4" v-if="status.showCapturesInputs">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Capturas de Pantalla
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Agrega hasta 4 capturas de pantalla del mod
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <template v-for="index in 4" :key="index">
                <div class="space-y-2">
                  <UFormField
                    :label="`Captura ${index}`"
                    :name="`screenshot${index}`"
                  >
                    <div
                      class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition"
                      @click="triggerFileInput(`screenshot${index}`)"
                      @dragover.prevent="isDraggingScreenshots[index] = true"
                      @dragleave.prevent="isDraggingScreenshots[index] = false"
                      @drop.prevent="
                        handleFileDrop($event, `screenshot${index}`)
                      "
                      :class="
                        isDraggingScreenshots[index]
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : ''
                      "
                    >
                      <div
                        v-if="!form.screenshots[index - 1]"
                        class="space-y-2"
                      >
                        <UIcon
                          name="i-lucide-image"
                          class="mx-auto text-2xl text-gray-400"
                        />
                        <p
                          class="text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                          Haz clic para seleccionar
                        </p>
                      </div>
                      <div v-else class="space-y-2">
                        <img
                          :src="screenshotPreviews[index - 1]"
                          :alt="`Screenshot ${index} preview`"
                          class="h-24 mx-auto rounded object-contain"
                        />
                        <p class="text-xs text-blue-600 dark:text-blue-400">
                          {{ screenshotFileNames[index - 1] }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Haz clic para cambiar
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      :data-screenshot="`screenshot${index}`"
                      @change="handleFileSelect($event, `screenshot${index}`)"
                    />
                  </UFormField>
                  <UButton
                    v-if="form.screenshots[index - 1]"
                    @click="handleUploadImage(`screenshot${index}`)"
                    :loading="uploadingScreenshots[index - 1]"
                    :disabled="uploadingScreenshots.some(Boolean)"
                    size="sm"
                    icon="i-lucide-upload"
                    color="info"
                    block
                  >
                    Enviar Captura {{ index }}
                  </UButton>
                </div>
              </template>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-3 pt-4">
            <UButton
              type="button"
              size="lg"
              color="error"
              variant="soft"
              @click="handleCancel"
              :disabled="
                uploadingLogo ||
                uploadingMain ||
                uploadingScreenshots.some(Boolean)
              "
            >
              Cancelar
            </UButton>
            <UButton
              v-if="
                !status.showCapturesInputs &&
                !status.showLogoInputs &&
                !status.showLogoInputs
              "
              type="button"
              size="lg"
              color="success"
              variant="soft"
              @click="handleSkip"
              :disabled="
                uploadingLogo ||
                uploadingMain ||
                uploadingScreenshots.some(Boolean)
              "
            >
              Omitir
            </UButton>

            <UButton
              v-else
              type="button"
              size="lg"
              color="success"
              :to="`/mods/create/credits/${modId}`"
            >
              Continuar
            </UButton>
          </div>
        </form>

        <!-- Preview Card -->
        <UCard class="w-100 flex flex-col gap-5" variant="soft">
          <h3 class="mb-5 font-semibold">Vista Previa:</h3>

          <!-- Logo Preview -->
          <UFormField label="Logo:" class="my-2" v-if="status.showLogoInputs">
            <UCard
              variant="outline"
              class="flex justify-center items-center h-40"
            >
              <img
                v-if="form.logo"
                :src="logoPrevew"
                :alt="'Logo preview'"
                class="max-h-full max-w-full rounded object-contain"
              />
              <p v-else class="text-gray-500 dark:text-gray-400">Sin logo</p>
            </UCard>
          </UFormField>

          <!-- Main Image Preview -->
          <UFormField
            label="Imagen Principal:"
            class="my-2"
            v-if="status.showMainInputs"
          >
            <UCard
              variant="outline"
              class="flex justify-center items-center h-40"
            >
              <img
                v-if="form.mainImage"
                :src="mainImagePreview"
                :alt="'Main image preview'"
                class="max-h-full max-w-full rounded object-contain"
              />
              <p v-else class="text-gray-500 dark:text-gray-400">
                Sin imagen principal
              </p>
            </UCard>
          </UFormField>

          <!-- Screenshots Preview -->
          <UFormField
            label="Capturas:"
            class="my-2"
            v-if="status.showCapturesInputs"
          >
            <div class="grid grid-cols-2 gap-2">
              <template
                v-for="(screenshot, index) in screenshotPreviews"
                :key="index"
              >
                <UCard
                  variant="outline"
                  class="flex justify-center items-center h-24"
                >
                  <img
                    v-if="screenshot"
                    :src="screenshot"
                    :alt="`Screenshot ${index + 1}`"
                    class="max-h-full max-w-full rounded object-contain"
                  />
                  <p v-else class="text-xs text-gray-500 dark:text-gray-400">
                    Captura {{ index + 1 }}
                  </p>
                </UCard>
              </template>
            </div>
          </UFormField>

          <!-- Status -->
          <UCard color="blue" variant="soft" class="mt-4">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  :name="
                    isFormValid
                      ? 'i-lucide-check-circle'
                      : 'i-lucide-alert-circle'
                  "
                  :class="isFormValid ? 'text-green-600' : 'text-amber-600'"
                />
                <span class="font-semibold">{{
                  isFormValid ? "Listo para subir" : "Completa el formulario"
                }}</span>
              </div>
            </template>
            <ul class="list-disc list-inside space-y-1 text-sm">
              <li :class="form.logo ? 'text-green-600' : 'text-gray-500'">
                {{ form.logo ? "✓ Logo" : "○ Logo" }}
              </li>
              <li :class="form.mainImage ? 'text-green-600' : 'text-gray-500'">
                {{
                  form.mainImage ? "✓ Imagen Principal" : "○ Imagen Principal"
                }}
              </li>
              <li
                :class="
                  form.screenshots.filter(Boolean).length > 0
                    ? 'text-green-600'
                    : 'text-gray-500'
                "
              >
                {{
                  form.screenshots.filter(Boolean).length > 0
                    ? `✓ Capturas (${form.screenshots.filter(Boolean).length}/4)`
                    : "○ Capturas"
                }}
              </li>
            </ul>
          </UCard>
        </UCard>
      </UContainer>
    </UCard>

    <!-- Info Section -->
    <UCard color="amber" variant="soft">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-info" />
          <span class="font-semibold">Información</span>
        </div>
      </template>
      <ul class="list-disc list-inside space-y-2 text-sm">
        <li>El logo se mostrará en la barra lateral y en listados</li>
        <li>La imagen principal es la portada del mod</li>
        <li>Las capturas deben ser representativas del contenido del mod</li>
        <li>Soporta PNG, JPG y GIF (máximo 5MB cada una)</li>
        <li>Puedes arrastrar imágenes o hacer clic para seleccionar</li>
        <li>Las capturas son opcionales, pero recomendadas</li>
      </ul>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { BreadcrumbItem } from "@nuxt/ui";
import useToastAlerts from "~/utils/toastAlerts";
const { decodeToken } = useAuth();
const { showToast } = useToastAlerts();
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const { fetchModByID, fetchModByIDAdmin } = useMods();

// Get mod ID from route params
const modId = computed(() => route.params.id as string);

const items = ref<BreadcrumbItem[]>([
  {
    label: "Mods",
    icon: "i-lucide-book-open",
    to: "/mods",
  },
  {
    label: "Crear Mod",
    icon: "i-lucide-plus",
    to: "/mods/create",
  },
]);

// Template refs for file inputs
const logoInput = ref<HTMLInputElement>();
const mainImageInput = ref<HTMLInputElement>();
const screenshotInputs = ref<Record<string, HTMLInputElement>>({});

const status = ref({
  showLogoInputs: true,
  showMainInputs: true,
  showCapturesInputs: true,
});

// Drag and drop state
const isDraggingLogo = ref(false);
const isDraggingMain = ref(false);
const isDraggingScreenshots = ref<Record<number, boolean>>({
  1: false,
  2: false,
  3: false,
  4: false,
});

// Upload loading states
const uploadingLogo = ref(false);
const uploadingMain = ref(false);
const uploadingScreenshots = ref([false, false, false, false]);

// File names for display
const logoFileName = ref("");
const mainImageFileName = ref("");
const screenshotFileNames = ref(["", "", "", ""]);

// File previews for display (base64)
const logoPrevew = ref("");
const mainImagePreview = ref("");
const screenshotPreviews = ref(["", "", "", ""]);

// Form data - Store File objects
const form = ref({
  logo: null as File | null,
  mainImage: null as File | null,
  screenshots: [null, null, null, null] as (File | null)[],
});

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return form.value.logo && form.value.mainImage;
});

// Trigger file input
const triggerFileInput = (field: string) => {
  if (field === "logo") {
    logoInput.value?.click();
  } else if (field === "mainImage") {
    mainImageInput.value?.click();
  } else if (field.startsWith("screenshot")) {
    // Find the input by looking for file inputs near the clicked element
    const inputs = document.querySelectorAll('input[type="file"]');
    let targetInput: HTMLInputElement | null = null;

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i] as HTMLInputElement;
      // Get the change event handler to identify which screenshot it belongs to
      if (input.getAttribute("data-screenshot") === field) {
        targetInput = input;
        break;
      }
    }

    // If not found by data attribute, click the input from the event
    if (!targetInput) {
      const allFileInputs = Array.from(
        document.querySelectorAll('input[type="file"]'),
      );
      const screenshotInputs = allFileInputs.slice(2); // Skip logo and mainImage
      const index = parseInt(field.replace("screenshot", "")) - 1;
      if (screenshotInputs[index]) {
        (screenshotInputs[index] as HTMLInputElement).click();
        return;
      }
    } else {
      targetInput.click();
    }
  }
};

// Handle file selection
const handleFileSelect = (event: Event, field: string) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  // Validate file size (5MB max)
  if (file.size > 2 * 1024 * 1024) {
    showToast({
      success: false,
      message: "La imagen no debe exceder 2MB",
    });

    return;
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    showToast({
      success: false,
      message: "El archivo debe ser una imagen",
    });
    return;
  }

  // Store the File object
  if (field === "logo") {
    form.value.logo = file;
    logoFileName.value = file.name;
  } else if (field === "mainImage") {
    form.value.mainImage = file;
    mainImageFileName.value = file.name;
  } else if (field.startsWith("screenshot")) {
    const index = parseInt(field.replace("screenshot", "")) - 1;
    form.value.screenshots[index] = file;
    screenshotFileNames.value[index] = file.name;
  }

  // Read file for preview only
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result as string;

    if (field === "logo") {
      logoPrevew.value = result;
    } else if (field === "mainImage") {
      mainImagePreview.value = result;
    } else if (field.startsWith("screenshot")) {
      const index = parseInt(field.replace("screenshot", "")) - 1;
      screenshotPreviews.value[index] = result;
    }
  };
  reader.readAsDataURL(file);
};

// Handle drag and drop
const handleFileDrop = (event: DragEvent, field: string) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];

  if (!file) return;

  // Create a synthetic event
  const input = document.createElement("input");
  input.type = "file";
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  input.files = dataTransfer.files;

  handleFileSelect({ target: input } as any, field);

  // Update drag state
  if (field === "logo") {
    isDraggingLogo.value = false;
  } else if (field === "mainImage") {
    isDraggingMain.value = false;
  } else if (field.startsWith("screenshot")) {
    const index = parseInt(field.replace("screenshot", ""));
    isDraggingScreenshots.value[index] = false;
  }
};

// Handle form submission
const handleUploadImages = () => {};

// Handle individual image upload
const handleUploadImage = async (field: string) => {
  try {
    // Determine which loading state to use
    if (field === "logo") {
      uploadingLogo.value = true;
    } else if (field === "mainImage") {
      uploadingMain.value = true;
    } else if (field.startsWith("screenshot")) {
      const index = parseInt(field.replace("screenshot", "")) - 1;
      uploadingScreenshots.value[index] = true;
    }

    // Get the File object
    let imageFile: File | null = null;
    if (field === "logo") {
      imageFile = form.value.logo;
    } else if (field === "mainImage") {
      imageFile = form.value.mainImage;
    } else if (field.startsWith("screenshot")) {
      const index = parseInt(field.replace("screenshot", "")) - 1;
      imageFile = form.value.screenshots[index] ?? null;
    } else {
      throw new Error("Campo desconocido");
    }

    if (!imageFile) {
      throw new Error("No hay archivo seleccionado");
    }

    // TODO: Implement API call to upload image
    // For now, just log the file object
    let response;
    if (field === "logo") {
      response = await saveImagesToBD(
        "IMAGES",
        `logo/${modId.value}`,
        "POST",
        imageFile,
      );
      if (response.success) {
        status.value.showLogoInputs = false;
      }
    }

    if (field === "mainImage") {
      response = await saveImagesToBD(
        "IMAGES",
        `main/${modId.value}`,
        "POST",
        imageFile,
      );
      if (response.success) {
        status.value.showMainInputs = false;
      }
    }

    if (field.startsWith("screenshot")) {
      response = await saveImagesToBD(
        "IMAGES",
        `screenshots/${modId.value}`,
        "POST",
        imageFile,
      );
    }
    if (response) {
      showToast(response);
    }
  } catch (error) {
    showToast({
      success: false,
      message: (error as Error).message || "Error al subir la imagen",
    });
  } finally {
    // Reset loading state
    if (field === "logo") {
      uploadingLogo.value = false;
    } else if (field === "mainImage") {
      uploadingMain.value = false;
    } else if (field.startsWith("screenshot")) {
      const index = parseInt(field.replace("screenshot", "")) - 1;
      uploadingScreenshots.value[index] = false;
    }
  }
};

// Handle cancel
const handleCancel = () => {
  router.push("/mods");
};

// Handle skip
const handleSkip = () => {
  router.push(`/mods/create/credits/${modId.value}`);
};

onBeforeMount(async () => {
  const token = decodeToken();
  const response =
    token.role === "uploader"
      ? await fetchModByID(Number(modId.value))
      : await fetchModByIDAdmin(Number(modId.value));

  if (!response.data) {
    router.back();
  }

  if (response.data!.resource.required_revision) {
    showToast({
      success: false,
      message: "El mod aun no aprueba la revisión",
    });
    router.back();
  } else {
    showToast(response);
  }

  const images = response.data!.resource.images;
  status.value.showMainInputs = images.some((item) => item.type === "main")
    ? false
    : true;
  status.value.showLogoInputs = images.some((item) => item.type === "logo")
    ? false
    : true;
  status.value.showCapturesInputs = images.some(
    (item) => item.type === "screenshot",
  )
    ? false
    : true;

  if (
    !status.value.showCapturesInputs &&
    !status.value.showLogoInputs &&
    !status.value.showMainInputs
  ) {
    router.back();
  }
});
</script>

<style scoped></style>
