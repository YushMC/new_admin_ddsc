<template>
  <div class="space-y-6 w-full">
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Agregar Géneros al Mod
      </h1>
    </div>

    <UCard class="flex flex-col gap-5 w-fit mt-5">
      <UCard variant="soft" class="w-full flex justify-start gap-5 mb-5">
        <h2 class="mb-5 text-2xl">Total de Géneros ({{ genresIds.length }})</h2>
      </UCard>
      <USeparator class="mb-5" />
      <UCard
        class="flex flex-col items-center w-fit justify-center"
        variant="soft"
      >
        <UFormField label="Selecciona los géneros del mod" class="w-150">
          <USelect
            v-model="genresIds"
            size="xl"
            multiple
            :items="optionsGenres"
            value-key="value"
            class="w-full"
          />
        </UFormField>
        <h1 class="mt-5">Géneros Seleccionados:</h1>
        <UCard class="mt-5 w-150 flex justify-evenly gap-5 flex-wrap">
          <UContainer
            variant="subtle"
            v-for="(genreId, index) in genresIds"
            :key="index"
            class="rounded-lg w-fit h-fit p-1 m-0 border border-gray-300 dark:border-gray-600 m-1"
          >
            <div class="flex justify-between items-center gap-2 w-fit p-0 m-0">
              {{
                genres.find((g) => g.resource?.id === genreId)?.resource?.name
              }}
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="error"
                size="md"
                @click="genresIds = genresIds.filter((id) => id !== genreId)"
              ></UButton>
            </div>
          </UContainer>
        </UCard>
        <UButton
          @click="handleSaveGenres"
          color="info"
          variant="soft"
          class="w-full self-end mt-5"
          icon="i-lucide-save"
        >
          Guardar Géneros
        </UButton>
      </UCard>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import useToastAlerts from "~/utils/toastAlerts";
const route = useRoute();
const router = useRouter();
const { fetchAllGenresForSelect, fetchAddGenreToMod } = useGenres();
const { showToast } = useToastAlerts();
const { fetchModByID } = useMods();

const genres = ref<GenreResponse[]>([]);
const modId = Number(route.params.id as string);
const optionsGenres = ref<{ label: string; value: number }[]>([]);
const genresIds = ref<number[]>([]);

const items = ref<BreadcrumbItem[]>([
  {
    label: "Mods",
    icon: "i-lucide-book-open",
    to: "/mods",
  },
  {
    label: "Agregar Géneros al Mod",
    icon: "i-lucide-bookmark",
    to: `/mods/create/genres/${modId}`,
  },
]);

const handleSaveGenres = async () => {
  const response = await fetchAddGenreToMod(modId, genresIds.value);
  showToast(response);
};

onBeforeMount(async () => {
  document.title = "Agregar Géneros al Mod - Admin DDSC";
  const responseMod = await fetchModByID(modId);

  if (!responseMod.success || !responseMod.data) {
    showToast({
      success: false,
      message:
        "No se encontró el mod. Por favor, verifica que el ID sea correcto.",
    });
    router.back();
    return;
  }

  if (
    responseMod.data.resource.genres &&
    responseMod.data.resource.genres.length > 0
  ) {
    console.log("Mod already has genres:", responseMod.data.resource.genres);
    showToast({
      success: false,
      message:
        "El mod ya tiene géneros asignados. Por favor, edítalos en la sección de edición del mod.",
    });
    router.back();
    return;
  } else {
    const response = await fetchAllGenresForSelect();
    if (response.success && response.data) {
      genres.value = response.data;
      optionsGenres.value = response.data.map((genre) => ({
        label: genre.resource?.name,
        value: genre.resource?.id,
      }));
    }
  }
});
</script>

<style scoped></style>
