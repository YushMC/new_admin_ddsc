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
      color="neutral"
      variant="subtle"
    />

    <UContainer class="w-full flex justify-evenly gap-4 flex-wrap">
      <UCard class="w-70 h-fit flex flex-col gap-2 space-y-5" variant="soft">
        <h1>Editar Contraseña</h1>
        <UModal>
          <UButton class="w-full mt-5" icon="i-lucide-key" color="secondary"
            >Cambiar</UButton
          >
        </UModal>
      </UCard>

      <UCard class="w-70 h-fit flex flex-col gap-2 space-y-5" variant="soft">
        <h1>Actualizar Logo</h1>
        <UModal>
          <UButton class="w-full mt-5" icon="i-lucide-image" color="secondary"
            >Cambiar</UButton
          >
        </UModal>
      </UCard>

      <UCard class="w-70 h-fit flex flex-col gap-2 space-y-5" variant="soft">
        <h1>Actualizar Contacto</h1>
        <UModal>
          <UButton class="w-full mt-5" icon="i-lucide-link" color="secondary"
            >Cambiar</UButton
          >
        </UModal>
      </UCard>
    </UContainer>

    <UCard class="h-fit mt-20">
      <UContainer class="flex justify-evenly gap-5 flex-wrap">
        <UCard class="w-100" variant="subtle">
          <NuxtImg :src="userData.logo" class="w-full" />
        </UCard>
        <UCard class="w-100 flex flex-col">
          <UFormField label="Nombre de Usuario" class="w-full">
            <UInput v-model="formInfo.name" class="w-full" />
          </UFormField>
          <UFormField label="Sobre ti" class="mt-5">
            <UTextarea autoresize class="w-full" />
          </UFormField>
          <UButton class="mt-5" icon="i-lucide-user-pen"
            >Actualizar Datos</UButton
          >
        </UCard>
      </UContainer>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
const { fetchUpdateInfoUser } = useUsers();
const toast = useToast();
const { decodeToken } = useAuth();
const userData = ref<tokenData>({
  exp: 0,
  sub: "",
  name: "",
  role: "owner",
  about_me: "",
  logo: "",
});

const formInfo = ref({
  name: "",
  about_me: "",
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
};

document.title = "Tu Perfil - DDSC Admin";

onBeforeMount(() => {
  userData.value = decodeToken();
  formInfo.value = {
    name: userData.value.name,
    about_me: userData.value.about_me,
  };
});
</script>

<style scoped></style>
