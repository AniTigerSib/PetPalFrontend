<script setup lang="ts">

import UserCard from "@/components/UserCard.vue";
import {onMounted, ref, type Ref} from "vue";
import type {IBasicUser} from "@/types/user.ts";
import router from "@/router";
import {useAuthStore} from "@/stores/auth.ts";
import {useUserStore} from "@/stores/user.ts";
import {searchUsersApi} from "@/api/user.ts";
import {useRoute} from "vue-router";

const authStore = useAuthStore();
const userStore = useUserStore();
const route = useRoute();

const searchQuery = route.query.q as string;

const users: Ref<IBasicUser[]> = ref([]);

const searchUsers = async () => {
  users.value = await searchUsersApi(searchQuery);
}

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    await authStore.logout(false);
    await router.push('/login');
  } else {
    await searchUsers();
  }
})
</script>

<template>
  <div class="search-container">
    <UserCard v-for="user in users" :key="user.id" :user="user"/>
  </div>
</template>

<style scoped lang="scss">
.search-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>