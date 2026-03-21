<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Agregar Mod
      </h1>
    </div>

    <!-- Form Card -->
    <UCard class="flex justify-evenly gap-5">
      <UContainer class="flex justify-evenly gap-20">
        <form @submit.prevent="handleCreateMod" class="space-y-6 w-100">
          <!-- Name Input -->
          <UFormField label="Nombre" name="name" required>
            <UInput
              v-model="form.name"
              type="text"
              placeholder="Nombre del mod"
              icon="i-lucide-book-open"
              :disabled="isLoading"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Tipo" name="type" required>
            <USelect
              v-model="form.type"
              :items="typeOptions"
              placeholder="Selecciona el Tipo"
              value-key="value"
              icon="i-lucide-book-type"
              :disabled="isLoading"
              required
              class="w-full"
            />
          </UFormField>

          <!-- Description Input (with TipTap Editor) -->
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
              v-model:content="form.description"
            />

            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Editor enriquecido con formatos: negrita, cursiva, subrayado,
              títulos, listas y más.
            </p>
          </UFormField>

          <!-- Status Select -->
          <UFormField label="Estado" name="status" required>
            <USelect
              v-model="form.status"
              :items="statusOptions"
              placeholder="Selecciona el estado"
              value-key="value"
              icon="i-lucide-circle-dot"
              :disabled="isLoading"
              required
              class="w-full"
            />
          </UFormField>

          <!-- Duration Select -->
          <UFormField label="Duración" name="duration" required>
            <USelect
              v-model="form.duration"
              :items="durationOptions"
              placeholder="Selecciona la duración"
              value-key="value"
              icon="i-lucide-clock"
              :disabled="isLoading"
              required
              class="w-full"
            />
          </UFormField>

          <!-- Character Select -->
          <UFormField label="Personaje" name="character" required>
            <USelect
              v-model="form.character"
              :items="characterOptions"
              placeholder="Selecciona el personaje"
              icon="i-lucide-user-circle"
              :disabled="isLoading"
              value-key="value"
              required
              class="w-full"
            />
          </UFormField>

          <!-- Release Date Input (Optional) -->
          <UFormField label="Fecha de lanzamiento" name="releaseDate">
            <UInput
              v-model="form.created_at"
              type="date"
              icon="i-lucide-calendar"
              :disabled="isLoading"
              class="w-full"
            />
            <template #help>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Este campo es opcional. Ingresa la fecha que fué lanzado el mod.
              </p>
            </template>
          </UFormField>

          <UFormField label="Enlace para descargar (PC)" name="download_pc">
            <UInput
              v-model="form.download_pc"
              type="text"
              placeholder="https://..."
              icon="i-lucide-link"
              :disabled="isLoading"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Enlace para descargar (APK)" name="download_pc">
            <UInput
              v-model="form.download_android"
              type="text"
              placeholder="https://..."
              icon="i-lucide-link"
              :disabled="isLoading"
              class="w-full"
            />
          </UFormField>

          <!-- Form Actions -->
          <div class="flex gap-3 pt-4">
            <UButton
              type="submit"
              size="lg"
              :loading="isLoading"
              :disabled="isLoading"
              icon="i-lucide-plus"
            >
              Crear Mod
            </UButton>
            <UButton
              type="button"
              size="lg"
              color="error"
              variant="soft"
              @click="handleCancel"
              :disabled="isLoading"
            >
              Cancelar
            </UButton>
          </div>
        </form>
        <UCard class="w-100 flex flex-col gap-5" variant="soft">
          <h3 class="mb-5">Vista Previa:</h3>
          <UFormField label="Nombre del mod:" class="my-2">
            <UCard variant="outline">
              <h2>{{ form.name }}</h2>
            </UCard>
          </UFormField>
          <UFormField label="Tipo:" class="my-2">
            <UCard variant="outline">
              <h2>{{ form.type }}</h2>
            </UCard>
          </UFormField>
          <UFormField label="Descripción:" class="my-2">
            <UCard variant="outline">
              <div v-html="form.description"></div>
            </UCard>
          </UFormField>
          <UFormField label="Estado:" class="my-2">
            <UCard variant="outline">
              <h2>{{ form.status }}</h2>
            </UCard>
          </UFormField>
          <UFormField label="Duración:" class="my-2">
            <UCard variant="outline">
              <h2>{{ form.duration }}</h2>
            </UCard>
          </UFormField>
          <UFormField label="Personaje:" class="my-2">
            <UCard variant="outline">
              <h2>{{ form.character }}</h2>
            </UCard>
          </UFormField>
          <UFormField label="Fecha de lanzamiento:" class="my-2">
            <UCard variant="outline">
              <h2>{{ formatDate(form.created_at) }}</h2>
            </UCard>
          </UFormField>
          <UFormField label="Enlace para descargar (PC):" class="my-2">
            <UCard variant="outline">
              <h2>{{ form.download_pc }}</h2>
            </UCard>
          </UFormField>
          <UFormField label="Enlace para descargar (APK):" class="my-2">
            <UCard variant="outline">
              <h2>{{ form.download_android }}</h2>
            </UCard>
          </UFormField>
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
        <li>El nombre del mod debe ser único</li>
        <li>La descripción soporta etiquetas HTML básicas</li>
        <li>Selecciona el estado actual del mod</li>
        <li>Especifica la duración estimada</li>
        <li>Elige el personaje principal del mod</li>
        <li>La fecha de lanzamiento es opcional</li>
      </ul>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { BreadcrumbItem } from "@nuxt/ui";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import useToastAlerts from "~/utils/toastAlerts";
const { showToast } = useToastAlerts();
const router = useRouter();
const isLoading = ref(false);
const showContinueButton = ref(false);

const items = ref<BreadcrumbItem[]>([
  {
    label: "Mods",
    icon: "i-lucide-book-open",
    to: "/mods",
  },
]);

// Opciones de estados
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

const form = ref({
  name: "",
  description: "",
  type: "translation" as ModType,
  status: "stable" as Status,
  duration: "medium" as Duration,
  character: "mc" as Character,
  created_at: "" as string,
  download_pc: "",
  download_android: "",
});

// Función auxiliar para formatear fecha
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

// Función para obtener fecha y hora actual en formato ISO
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toISOString().slice(0, 19);
};

const handleCreateMod = async () => {
  // Aquí irá la lógica de validación y creación del mod
  isLoading.value = true;

  try {
    // Si no se especificó fecha, agregar la fecha y hora actual
    if (!form.value.created_at) {
      form.value.created_at = getCurrentDateTime();
    }

    const response = await postFetchWithToken<ModResponse>(
      "MODS",
      "",
      form.value,
    );

    showToast(response);

    if (response.success && response.data && response.data.resource.id) {
      router.push(`/mods/create/images/${response.data.resource.id}`);
    }
  } catch (error) {
    console.error("Error al crear mod:", error);
    // TODO: Mostrar toast de error
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  // Volver a la página de mods
  router.push("/mods");
};

document.title = "Crear Mod - DDSC Admin";
</script>
