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
        <form @submit.prevent="" class="space-y-6 w-100">
          <!-- Logo Upload -->
          <UFormField label="Logo" name="logo" v-if="status.showLogoInputs">
            <div class="space-y-4">
              <UFileUpload
                v-model="logoToUpload"
                accept="image/svg,image/png,image/jpeg,image/webp"
                label="Suelta o haz click aquí"
                class="w-full min-h-48"
                icon="i-lucide-image"
                description="SVG, PNG, JPG o WEBP (max. 2MB)"
              />
              <UButton
                v-if="logoToUpload"
                @click="handleUploadLogo"
                :loading="uploadingLogo"
                :disabled="uploadingLogo"
                size="md"
                icon="i-lucide-upload"
                color="info"
                block
                class="w-full"
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
              <UFileUpload
                v-model="mainImageToUpload"
                accept="image/svg,image/png,image/jpeg,image/webp"
                label="Suelta o haz click aquí"
                class="w-full min-h-48"
                icon="i-lucide-image"
                description="SVG, PNG, JPG o WEBP (max. 2MB)"
              />
              <UButton
                v-if="mainImageToUpload"
                @click="handleUploadMain"
                :loading="uploadingMain"
                :disabled="uploadingMain"
                size="md"
                icon="i-lucide-upload"
                color="info"
                block
                class="w-full"
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

            <div class="flex w-full flex-col gap-4">
              <UFileUpload
                v-model="uploadScreenshots"
                color="neutral"
                layout="list"
                multiple
                class="w-96 min-h-48"
                icon="i-lucide-image"
                accept="image/svg,image/png,image/jpeg,image/webp"
                label="Suelta las capturas aquí"
                description="SVG, PNG, JPG o WEBP (max. 2MB)"
              />
              <UButton
                v-if="uploadScreenshots.length > 0"
                @click="handleUploadScreenshots"
                :loading="uploaderScreenshotsState"
                size="md"
                icon="i-lucide-upload"
                color="info"
                block
                class="w-full"
              >
                Enviar Capturas
              </UButton>
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
              :disabled="uploadingLogo || uploadingMain"
            >
              Cancelar
            </UButton>

            <UButton
              type="button"
              size="lg"
              color="success"
              :to="`/mods/create/credits/${modId}`"
            >
              Continuar
            </UButton>
          </div>
        </form>
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
import { saveArrayImagesToBD } from "~/utils/fetchsFabs";
const { decodeToken } = useAuth();
const { showToast } = useToastAlerts();
const router = useRouter();
const route = useRoute();
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

const status = ref({
  showLogoInputs: true,
  showMainInputs: true,
  showCapturesInputs: true,
});

// Upload loading states
const uploadingLogo = ref(false);
const uploadingMain = ref(false);
const uploadScreenshots = ref<File[]>([]);
const uploaderScreenshotsState = ref<boolean>(false);

// File names for display
const logoToUpload = ref<File | null>(null);
const mainImageToUpload = ref<File | null>(null);

const checkFile = (file: File) => {
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    showToast({
      success: false,
      message: "La imagen no debe exceder 5MB",
    });
    return false;
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    showToast({
      success: false,
      message: "El archivo debe ser una imagen",
    });
    return false;
  }

  return true;
};

// Handle individual image upload
const handleUploadLogo = async () => {
  const is_valid = logoToUpload.value && checkFile(logoToUpload.value);
  if (!is_valid || !logoToUpload.value) return;

  try {
    const response = await saveImagesToBD(
      "IMAGES",
      `logo/${modId.value}`,
      "POST",
      logoToUpload.value,
    );
    if (response.success) {
      status.value.showLogoInputs = false;
    }

    showToast(response);
  } catch (error) {
    showToast({
      success: false,
      message: (error as Error).message || "Error al subir la imagen",
    });
  }
};

const handleUploadMain = async () => {
  const is_valid =
    mainImageToUpload.value && checkFile(mainImageToUpload.value);
  if (!is_valid || !mainImageToUpload.value) return;

  try {
    const response = await saveImagesToBD(
      "IMAGES",
      `main/${modId.value}`,
      "POST",
      mainImageToUpload.value,
    );
    if (response.success) {
      status.value.showMainInputs = false;
    }

    showToast(response);
  } catch (error) {
    showToast({
      success: false,
      message: (error as Error).message || "Error al subir la imagen",
    });
  }
};

const handleUploadScreenshots = async () => {
  uploadScreenshots.value = uploadScreenshots.value.filter((file) => {
    const is_valid = checkFile(file);
    if (!is_valid) {
      showToast({
        success: false,
        message: `La captura "${file.name}" no es válida y será omitida`,
      });
    }
    return is_valid;
  });

  if (uploadScreenshots.value.length === 0) {
    showToast({
      success: false,
      message: "No hay capturas válidas para subir",
    });
    return;
  }

  try {
    uploaderScreenshotsState.value = true;

    for (const file of uploadScreenshots.value) {
      const response = await saveArrayImagesToBD(
        "IMAGES",
        `screenshots/all/${modId.value}`,
        "POST",
        [file],
      );

      if (!response.success) {
        showToast(response);
      } else {
        showToast(response);
      }
    }
    status.value.showCapturesInputs = false;
  } catch (error) {
    showToast({
      success: false,
      message: (error as Error).message || "Error al subir las capturas",
    });
  } finally {
    uploaderScreenshotsState.value = false;
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
    token?.role === "uploader"
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
