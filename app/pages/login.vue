<template>
  <div class="w-full">
    <!-- Card with form -->
    <UCard class="shadow-2xl">
      <!-- Header -->
      <template #header>
        <div class="flex flex-col items-center gap-3">
          <NuxtImg
            src="https://www.dokidokispanish.club/images/Logo_DDSC.png"
            width="60"
            alt="DDSC Logo"
          />
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Admin DDSC
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ingresa a tu cuenta de administrador
            </p>
          </div>
        </div>
      </template>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-1">
        <!-- Username Input -->
        <UFormField label="Usuario" name="username">
          <UInput
            v-model="form.username"
            type="text"
            placeholder="tu_usuario"
            icon="i-lucide-user"
            :disabled="isLoading"
            required
            class="w-full py-3"
          />
        </UFormField>

        <!-- Password Input -->
        <UFormField label="Contraseña" name="password">
          <UInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            icon="i-lucide-lock"
            :disabled="isLoading"
            required
            class="w-full my-3"
          >
            <template #trailing>
              <UButton
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                variant="ghost"
                size="xs"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <!-- Remember Me -->
        <!-- <div class="flex items-center justify-between py-3">
          <UCheckbox
            v-model="form.rememberMe"
            label="Recuérdame"
            :disabled="isLoading"
          />
          <!-- <UButton to="#" variant="ghost" color="info" size="sm" class="-mr-2">
            ¿Olvidaste tu contraseña?
          </UButton> -->
        <!-- </div> -->

        <!-- Submit Button -->
        <UButton
          type="submit"
          block
          size="lg"
          :loading="isLoading"
          :disabled="isLoading"
        >
          <template #leading>
            <UIcon name="i-lucide-log-in" />
          </template>
          Iniciar sesión
        </UButton>
      </form>

      <!-- Footer -->
      <template #footer>
        <div class="text-center text-sm">
          <span class="text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?
          </span>
          <UButton to="#" variant="ghost" color="primary" class="-mr-2">
            Contacta con administración
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- Info Section -->
    <div class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
      <p>Admin DDSC © 2024</p>
      <p>Panel de administración exclusivo</p>
    </div>
  </div>
</template>

<script setup lang="ts">
document.title = "Iniciar Sesión - DDSC Admin";
import useToastAlerts from "~/utils/toastAlerts";
const { showToast } = useToastAlerts();
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "auth",
});

const router = useRouter();
const { login } = useLogin();
const isLoading = ref(false);
const showPassword = ref(false);

const form = reactive({
  username: "",
  password: "",
});

const handleLogin = async () => {
  isLoading.value = true;

  try {
    const response = await login(form.username, form.password);
    if (response && response.data) {
      localStorage.setItem("auth_token", response.data);

      router.push("/");
    }
    showToast(response);
  } catch (error) {
    showToast({
      success: false,
      message: String(error),
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
