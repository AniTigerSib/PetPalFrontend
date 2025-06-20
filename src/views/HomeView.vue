<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {onMounted} from "vue";
import router from "@/router";

const authStore = useAuthStore();

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    await authStore.logout(false);
    await router.push('/login');
  }
});
</script>

<template>
  <main>
  </main>
</template>
