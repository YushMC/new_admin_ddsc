<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Crear Usuario
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Crea un nuevo usuario de administrador
      </p>
    </div>

    <!-- Form Card -->
    <UCard>
      <UContainer class="flex justify-evenly gap-20 items-center">
        <form @submit.prevent="handleCreateUser" class="space-y-6 w-100">
          <!-- Username Input -->
          <UFormField label="Nombre de usuario" name="username" required>
            <UInput
              v-model="form.username"
              type="text"
              placeholder="user"
              icon="i-lucide-user"
              :disabled="isLoading"
              required
              class="w-full"
            />
          </UFormField>

          <!-- Password Input -->
          <UFormField label="Contraseña" name="password" required>
            <UInput
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              icon="i-lucide-lock"
              :disabled="isLoading"
              required
              class="w-full"
            >
              <template #trailing>
                <UButton
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  color="primary"
                  variant="ghost"
                  size="xs"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Confirm Password Input -->

          <!-- Role Select -->
          <UFormField label="Rol" name="role" required class="w-full">
            <USelect
              v-model="form.role"
              :items="roleOptions"
              placeholder="Selecciona un rol"
              value-key="role"
              icon="i-lucide-shield"
              :disabled="isLoading"
              required
              class="w-full"
            />
          </UFormField>

          <!-- Form Actions -->
          <div class="flex gap-3 pt-4 w-full justify-start">
            <UButton
              type="submit"
              size="lg"
              :loading="isLoading"
              :disabled="isLoading"
              icon="i-lucide-plus"
            >
              Crear Usuario
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
        <UCard class="w-200 h-fit" variant="soft">
          <NuxtImg
            :src="`${constants.FRONT_END_BASE_URL}/images/banner_comunidad.jpg`"
          />
        </UCard>
      </UContainer>
    </UCard>

    <!-- Info Section -->
    <UCard color="blue" variant="soft">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-info" />
          <span class="font-semibold">Información</span>
        </div>
      </template>
      <ul class="list-disc list-inside space-y-2 text-sm">
        <li>El nombre de usuario debe ser único</li>
        <li>La contraseña debe tener al menos 6 caracteres</li>
        <li>Selecciona el rol apropiado para el usuario</li>
      </ul>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
const { create } = useLogin();
const { decodeToken } = useAuth();
const items = ref<BreadcrumbItem[]>([
  {
    label: "Usuarios",
    icon: "i-lucide-users",
    to: "/users",
  },
  {
    label: "Crear Usuario",
    icon: "i-lucide-user-plus",
    to: "/users/create",
  },
]);

const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);

// Opciones de roles - personaliza según tus necesidades
const roleOptions: { role: rolesNames; label: string }[] = [
  { role: "editor", label: "Editor" },
  { role: "uploader", label: "Aportador" },
];

const form = reactive<{
  username: string;
  password: string;
  role: rolesNames;
}>({
  username: "",
  password: "",
  role: "uploader",
});

const handleCreateUser = async () => {
  // Aquí irá la lógica de validación y creación del usuario
  isLoading.value = true;

  try {
    const response = await create(form.username, form.password, form.role!);

    if (response.success) {
      router.push("/users");
    }
  } catch (error) {
    console.error("Error al crear usuario:", error);
    // TODO: Mostrar toast de error
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  // Volver a la página anterior o a la lista de usuarios
  router.push("/users");
};

document.title = "Crear Usuario - DDSC Admin";

onBeforeMount(() => {
  const tokenDecode = decodeToken();
  if (!tokenDecode || tokenDecode.role === "uploader") {
    router.back();
  }
});
</script>

<style scoped></style>
