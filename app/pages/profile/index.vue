<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <UBreadcrumb class="py-2" :items="items" />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Tu perfil
      </h1>
    </div>

    <!-- Form Card -->
    <UAlert
      icon="i-lucide-triangle-alert"
      title="¡Importante!"
      description="Para ver los cambios realizados, es necesario volver a iniciar sesión"
      color="warning"
      variant="subtle"
    />

    <UContainer class="w-full flex justify-evenly gap-4 flex-wrap">
      <UCard class="w-70 h-fit flex flex-col gap-2 space-y-5" variant="soft">
        <h1>Editar Contraseña</h1>
        <UModal title="Actualizar Contraseña">
          <UButton class="w-full mt-5" icon="i-lucide-key" color="secondary"
            >Cambiar</UButton
          >
          <template #body>
            <UCard class="w-full flex flex-col gap-4">
              <UFormField label="Contraseña Actual">
                <UInput
                  :type="showCurrentPassword ? 'text' : 'password'"
                  v-model="formPassword.current_password"
                  class="w-full"
                >
                  <template #trailing>
                    <button
                      type="button"
                      @click="showCurrentPassword = !showCurrentPassword"
                    >
                      <UIcon
                        :name="
                          showCurrentPassword
                            ? 'i-lucide-eye-off'
                            : 'i-lucide-eye'
                        "
                      />
                    </button>
                  </template>
                </UInput>
              </UFormField>
              <UFormField label="Nueva Contraseña">
                <UInput
                  :type="showNewPassword ? 'text' : 'password'"
                  class="w-full"
                  v-model="formPassword.new_password"
                >
                  <template #trailing>
                    <button
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <UIcon
                        :name="
                          showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'
                        "
                      />
                    </button>
                  </template>
                </UInput>
              </UFormField>
              <UFormField label="Confirmar Nueva Contraseña">
                <UInput
                  :type="showConfirmNewPassword ? 'text' : 'password'"
                  class="w-full"
                  v-model="formPassword.confirm_new_password"
                >
                  <template #trailing>
                    <button
                      type="button"
                      @click="showConfirmNewPassword = !showConfirmNewPassword"
                    >
                      <UIcon
                        :name="
                          showConfirmNewPassword
                            ? 'i-lucide-eye-off'
                            : 'i-lucide-eye'
                        "
                      />
                    </button>
                  </template>
                </UInput>
                <div
                  class="mt-2 flex items-center gap-2"
                  v-if="
                    formPassword.new_password.length > 0 ||
                    formPassword.confirm_new_password.length > 0
                  "
                >
                  <div
                    :class="[
                      'w-2 h-2 rounded-full',
                      formPassword.new_password ===
                        formPassword.confirm_new_password &&
                      formPassword.confirm_new_password
                        ? 'bg-green-500'
                        : 'bg-red-500',
                    ]"
                  />
                  <span
                    :class="[
                      'text-sm',
                      formPassword.new_password ===
                        formPassword.confirm_new_password &&
                      formPassword.confirm_new_password
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400',
                    ]"
                  >
                    {{
                      formPassword.new_password ===
                        formPassword.confirm_new_password &&
                      formPassword.confirm_new_password
                        ? "Contraseñas coinciden"
                        : "Las contraseñas no coinciden"
                    }}
                  </span>
                </div>
              </UFormField>
              <UButton
                class="w-full mt-5"
                icon="i-lucide-key"
                color="secondary"
                @click="handleUpdatePassword"
                >Actualizar Contraseña</UButton
              >
            </UCard>
          </template>
        </UModal>
      </UCard>

      <UCard class="w-70 h-fit flex flex-col gap-2 space-y-5" variant="soft">
        <h1>Actualizar Logo</h1>
        <UModal title="Actualizar Logo">
          <UButton class="w-full mt-5" icon="i-lucide-image" color="secondary"
            >Cambiar</UButton
          >
          <template #body>
            <UCard class="w-full flex flex-col gap-4">
              <UFormField label="Logo">
                <UFileUpload
                  v-model="logoFile"
                  accept="image/svg,image/png,image/jpeg,image/webp"
                  label="Suelta o haz click aquí"
                  class="w-full min-h-48"
                  icon="i-lucide-image"
                  description="SVG, PNG, JPG o WEBP (max. 2MB)"
                >
                  <template #actions="{ open }">
                    <UButton
                      label="Seleccionar imágen"
                      icon="i-lucide-upload"
                      color="neutral"
                      variant="outline"
                      @click="open()"
                    />
                  </template>
                </UFileUpload>
              </UFormField>
              <UButton
                class="w-full mt-5"
                icon="i-lucide-image"
                color="secondary"
                @click="handleUpdateLogo"
                >Actualizar Logo</UButton
              >
            </UCard>
          </template>
        </UModal>
      </UCard>

      <UCard class="w-70 h-fit flex flex-col gap-2 space-y-5" variant="soft">
        <h1>Actualizar Contacto</h1>
        <UModal title="Actualizar Contacto">
          <UButton class="w-full mt-5" icon="i-lucide-link" color="secondary"
            >Cambiar</UButton
          >
          <template #body>
            <UCard class="w-full flex flex-col gap-4">
              <UFormField label="Contacto">
                <UInput
                  v-model="contact"
                  class="w-full"
                  placeholder="Ejemplo: https://t.me/tu_usuario"
                />
              </UFormField>
              <UButton
                class="w-full mt-5"
                icon="i-lucide-link"
                color="secondary"
                @click="handleUpdateContact"
                >Actualizar Contacto</UButton
              >
            </UCard>
          </template>
        </UModal>
      </UCard>
    </UContainer>

    <UCard class="h-fit mt-20">
      <UContainer class="flex justify-evenly gap-5 flex-wrap">
        <UCard class="w-100" variant="subtle">
          <NuxtImg :src="userData?.logo" class="w-full" />
        </UCard>
        <UCard class="w-100 flex flex-col">
          <UFormField label="Nombre de Usuario" class="w-full">
            <UInput v-model="formInfo.name" class="w-full" />
          </UFormField>
          <UFormField label="Sobre ti" class="mt-5">
            <UTextarea v-model="formInfo.about_me" autoresize class="w-full" />
          </UFormField>
          <UButton
            class="mt-5"
            icon="i-lucide-user-pen"
            @click="handleUpdateInfo"
            >Actualizar Datos</UButton
          >
        </UCard>
      </UContainer>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import useToastAlerts from "~/utils/toastAlerts";
const {
  fetchUpdateInfoUser,
  fetchUpdatePassword,
  fetchUpdateLogo,
  fetchUpdateContact,
} = useUsers();
const { showToast } = useToastAlerts();
const { decodeToken } = useAuth();
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);

const userData = ref<tokenData | null>(null);

const formInfo = ref({
  name: "",
  about_me: "",
});

const logoFile = ref<File | null>(null);
const contact = ref("");

const formPassword = ref({
  current_password: "",
  new_password: "",
  confirm_new_password: "",
});

const items = ref<BreadcrumbItem[]>([
  {
    label: "Tu Perfil",
    icon: "i-lucide-user",
    to: "/profile",
  },
]);

const handleUpdateInfo = async () => {
  const response = await fetchUpdateInfoUser(formInfo.value);
  showToast(response);
};
const handleUpdatePassword = async () => {
  const response = await fetchUpdatePassword(formPassword.value);
  showToast(response);
};
const handleUpdateLogo = async () => {
  if (!logoFile.value) {
    showToast({
      success: false,
      message: "Por favor, selecciona un archivo de logo",
    });
    return;
  }
  const response = await fetchUpdateLogo(logoFile.value);
  showToast(response);
};

const handleUpdateContact = async () => {
  const response = await fetchUpdateContact(contact.value);
  showToast(response);
};

document.title = "Tu Perfil - DDSC Admin";

onBeforeMount(() => {
  userData.value = decodeToken();
  formInfo.value = {
    name: userData.value?.name || "",
    about_me: userData.value?.about_me || "",
  };
  contact.value = userData.value?.contact || "";
});
</script>

<style scoped></style>
