<template>
  <div class="space-y-6">
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Solicitud de Mod: {{ modDataBase.name }}
      </h1>
    </div>
    <UButton
      class="fixed top-30 right-10"
      @click="closeAllToasts"
      icon="i-lucide-bell-off"
      variant="ghost"
    />

    <UAlert
      v-if="modDataBase.required_revision && modDataBase.comments"
      :color="modDataBase.required_revision ? 'error' : 'success'"
      class="w-full"
      variant="soft"
      title="Información de la Solicitud"
      :description="modDataBase.comments"
    />
    <UContainer
      class="w-full flex items-center justify-evenly mb-5 gap-5 flex-wrap"
    >
      <UCard class="flex flex-col gap-5 w-full" variant="soft">
        <div class="space-y-4 p-5 w-full flex flex-col">
          <UFormField label="Nombre del Mod" class="w-full">
            <UInput
              v-model="modDataBase.name"
              class="w-full"
              :disabled="tokenData?.role !== 'uploader'"
            />
          </UFormField>
          <UFormField label="Tipo" name="type">
            <USelect
              v-model="modDataBase.type"
              :items="typeOptions"
              placeholder="Selecciona el Tipo"
              value-key="value"
              icon="i-lucide-book-type"
              :disabled="tokenData?.role !== 'uploader'"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Descripción (Editor WYSIWYG)" name="description">
            <QuillEditor
              theme="snow"
              contentType="html"
              toolbar="essential"
              placeholder="Tu descripción aquí"
              :disabled="tokenData?.role !== 'uploader'"
              v-model:content="modDataBase.description"
            />

            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Editor enriquecido con formatos: negrita, cursiva, subrayado,
              títulos, listas y más.
            </p>
          </UFormField>

          <UFormField label="Estado" name="status" required>
            <USelect
              v-model="modDataBase.status"
              :items="statusOptions"
              placeholder="Selecciona el estado"
              value-key="value"
              icon="i-lucide-circle-dot"
              :disabled="tokenData?.role !== 'uploader'"
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
              :disabled="tokenData?.role !== 'uploader'"
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
              :disabled="tokenData?.role !== 'uploader'"
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
              :disabled="tokenData?.role !== 'uploader'"
            />
            <template #help>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Este campo es opcional. Ingresa la fecha que fué lanzado el mod.
              </p>
            </template>
          </UFormField>

          <UFormField label="Enlace para descargar (PC)" name="download_pc">
            <UInput
              v-model="downloadPcModel"
              type="text"
              placeholder="https://..."
              icon="i-lucide-link"
              class="w-full"
              :disabled="tokenData?.role !== 'uploader'"
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
              :disabled="tokenData?.role !== 'uploader'"
            />
          </UFormField>
          <UContainer
            class="w-full flex justify-center gap-5"
            v-if="tokenData?.role !== 'uploader'"
          >
            <UButton
              class="w-50"
              variant="subtle"
              icon="i-lucide-check-circle"
              color="success"
              @click="handleRejectRequest(true)"
              >Aceptar Solicitud y Actualizar Mod
            </UButton>
            <UModal title="Rechazar Solicitud">
              <UButton
                class="w-50"
                variant="subtle"
                icon="i-lucide-x-circle"
                color="error"
                >Rechazar Solicitud
              </UButton>
              <template #body>
                <div class="flex flex-col gap-4 w-full">
                  <p class="text-gray-700 dark:text-gray-300">
                    Aquí puedes agregar comentarios para el usuario que hizo la
                    solicitud. Por ejemplo, si necesitas más información o si
                    hay algún problema con la solicitud, puedes escribirlo aquí.
                  </p>
                  <UFormField label="Comentarios para el usuario">
                    <UTextarea
                      resziable
                      v-model="statusRequest.comments"
                      type="textarea"
                      placeholder="Escribe tus comentarios aquí..."
                      class="w-full"
                    />
                  </UFormField>
                  <UButton
                    class="w-50"
                    variant="subtle"
                    icon="i-lucide-x-circle"
                    color="error"
                    @click="handleRejectRequest(false)"
                    >Rechazar Solicitud
                  </UButton>
                </div>
              </template>
            </UModal>
          </UContainer>
          <UContainer class="w-full flex justify-center gap-5" v-else>
            <UButton
              class="w-50"
              variant="subtle"
              icon="i-lucide-check-circle"
              color="success"
              @click="handleUpdateMod"
              >Actualizar Mod
            </UButton>
          </UContainer>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import useToastAlerts from "~/utils/toastAlerts";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { QuillEditor } from "@vueup/vue-quill";
const { fetchModByIDAdmin, fetchUpdateMod } = useMods();
const { fetchApproveOrRejectMod, getMyModInRevision } = useRequest();
const { showToast, closeAllToasts } = useToastAlerts();
const { decodeToken } = useAuth();
const route = useRoute();
const router = useRouter();
const modId = ref(Number(route.params.id));

const statusRequest = ref<{ status: "approve" | "reject"; comments: string }>({
  status: "" as "approve" | "reject",
  comments: "",
});

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

/* TODO: Functions to get Data*/

const getModById = async (id: number) => {
  const response =
    tokenData.value?.role === "uploader"
      ? await getMyModInRevision(id)
      : await fetchModByIDAdmin(id);
  showToast(response);
  if (response.success && response.data) {
    console.log(response.data);
    modDataBase.value = {
      ...response.data.resource,
      created_at: response.data?.info?.created_at?.split("T")[0] ?? "",
    };
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

const handleRejectRequest = async (is_approved: boolean) => {
  const response = await fetchApproveOrRejectMod(modDataBase.value.id, {
    status: is_approved ? "approve" : "reject",
    comments: statusRequest.value.comments,
  });
  showToast(response);
  router.push("/requests");
};

const handleUpdateMod = async () => {
  let data: any = modDataBase.value;

  data = {
    ...data,

    download_pc: modDataBase.value.download_pc ?? null,
    download_android: modDataBase.value.download_android ?? null,
  };
  console.log("Datos a actualizar:", modDataBase.value);
  const response = await fetchUpdateMod(modDataBase.value.id, data);
  showToast(response);
};

/*TODO: carga de datos inicial */

onBeforeMount(async () => {
  tokenData.value = decodeToken();
  await getModById(modId.value);

  document.title = `Solicitud del Mod: ${modDataBase.value.name} - DDSC Admin`;
});
</script>

<style scoped></style>
