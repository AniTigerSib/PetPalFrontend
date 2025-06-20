<script setup lang="ts">

import UserCard from "@/components/UserCard.vue";
import {ref, type Ref} from "vue";
import type {IBasicUser} from "@/types/user.ts";

const searchString = ref<string>("");
const users: Ref<IBasicUser[]> = ref([
  {
    id: 1,
    firstName: "Example",
    lastName: "User",
    profileImage: "",
  },
  {
    id: 2,
    firstName: "Example",
    lastName: "User2",
    profileImage: "",
  },
]);
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