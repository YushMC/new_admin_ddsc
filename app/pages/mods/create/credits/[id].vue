<template>
  <div class="space-y-6 w-full">
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Agregar Créditos del Mod
      </h1>
      <UCard class="flex flex-col gap-5 w-full mt-5">
        <UCard variant="soft" class="w-full flex justify-start gap-5 mb-5">
          <h2 class="mb-5 text-2xl">
            Total de Créditos ({{ credits.length }})
          </h2>
          <h2 class="text-l text-gray-400 w-fit">
            Creadores ({{
              credits.filter((item) => item.type === "original_creator").length
            }})
          </h2>
          <h2 class="text-l w-fit">
            Traductores ({{
              credits.filter((item) => item.type === "translator").length
            }})
          </h2>
          <h2 class="text-l w.fit">
            Porteadores ({{
              credits.filter((item) => item.type === "porter").length
            }})
          </h2>
        </UCard>
        <USeparator class="mb-5" />
        <UCard
          class="flex gap-20 items-center w-fit justify-center"
          variant="soft"
        >
          <div class="space-y-6 w-full flex justify-evenly gap-5 flex-wrap">
            <UCard
              variant="subtle"
              v-for="(credit, index) in credits"
              :key="index"
              class="p-4 rounded-lg space-y-4 w-70 h-fit"
            >
              <h3 class="mb-5">Crédito #{{ index + 1 }}</h3>
              <!-- Select usuarios -->
              <UFormField label="Usuario existente">
                <USelect
                  :model-value="credit.id_user ?? 0"
                  @update:model-value="(val) => (credit.id_user = val || null)"
                  :items="typeUserOptions"
                  value-attribute="value"
                  placeholder="Selecciona un usuario"
                  class="w-full"
                />
              </UFormField>

              <!-- Input manual -->
              <UFormField label="Nombre manual">
                <UInput
                  :model-value="credit.name ?? ''"
                  @update:model-value="(val) => (credit.name = val || null)"
                  type="text"
                  placeholder="Nombre personalizado"
                  class="w-full"
                  :disabled="credit.id_user !== null || credit.id_user === 0"
                />
              </UFormField>

              <!-- Tipo -->
              <UFormField label="Tipo" required>
                <USelect
                  v-model="credit.type"
                  :items="typeOptions"
                  placeholder="Selecciona tipo"
                  class="w-full"
                />
              </UFormField>

              <!-- Botón eliminar -->
              <UButton
                color="error"
                variant="soft"
                class="mt-2"
                @click="removeCredit(index)"
              >
                Eliminar
              </UButton>
            </UCard>
          </div>
        </UCard>

        <USeparator class="my-5" />
        <div class="w-full flex justify-start gap-5">
          <!-- Agregar nuevo -->
          <UButton
            type="button"
            icon="i-lucide-plus"
            @click="addCredit"
            variant="soft"
            color="info"
          >
            Agregar crédito
          </UButton>

          <UButton
            type="submit"
            icon="i-lucide-save"
            @click="handleUploadCredits"
          >
            Guardar créditos
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const modId = route.params.id as string;
import type { BreadcrumbItem } from "@nuxt/ui";
import useToastAlerts from "~/utils/toastAlerts";
const { showToast } = useToastAlerts();
const { decodeToken } = useAuth();
const { fetAllUsersAdminWithSkipAndLimit, fetchAllSaveCredits } = useUsers();
const { fetchModByID, fetchModByIDAdmin } = useMods();

const typeUserOptions = ref<{ label: string; value: number }[]>([]);

const credits = ref<Credit[]>([
  {
    id_user: null,
    name: null,
    type: "original_creator",
  },
]);

const typeOptions = [
  { label: "Creator", value: "original_creator" },
  { label: "Translator", value: "translator" },
  { label: "Porter", value: "porter" },
];

const items = ref<BreadcrumbItem[]>([
  {
    label: "Mods",
    icon: "i-lucide-book-open",
    to: "/mods",
  },
  {
    label: "Agregar Créditos del Mod",
    icon: "i-lucide-user-plus",
    to: `/mods/create/credits/${modId}`,
  },
]);

const addCredit = () => {
  credits.value.push({
    id_user: null,
    name: null,
    type: "original_creator",
  });
};

const removeCredit = (index: number) => {
  credits.value.splice(index, 1);
};

const handleUploadCredits = async () => {
  const payload = {
    id_mod: Number(modId),
    credits: credits.value.map((c) => ({
      id_user: c.id_user ? c.id_user : null,
      name: c.id_user ? null : c.name,
      type: c.type,
    })),
  };

  const response = await fetchAllSaveCredits(payload);

  showToast(response);

  if (response.success) {
    router.push("/mods");
  }
};

const getUsers = async () => {
  const response = await fetAllUsersAdminWithSkipAndLimit(0, 100);
  if (response.success && response.data) {
    typeUserOptions.value = response.data.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });

    typeUserOptions.value = [
      ...typeUserOptions.value,
      { label: "Sin Registro", value: 0 },
    ];
  }
};

onBeforeMount(async () => {
  document.title = "Agregar Créditos - DDSC Admin";
  const token = decodeToken();
  const response =
    token?.role === "uploader"
      ? await fetchModByID(Number(modId))
      : await fetchModByIDAdmin(Number(modId));

  if (!response.data) {
    router.back();
  }

  if (response.data!.resource.required_revision) {
    showToast(response);
    router.back();
  }
  await getUsers();
});
</script>

<style scoped></style>
