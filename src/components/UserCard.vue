<script setup lang="ts">

import {useUserStore} from "@/stores/user.ts";

const userStore = useUserStore();
</script>

<template>
  <div class="user-card" v-on:click="userStore.openUserProfile(user.id)">
    <div class="user-card__image-container">
      <img
          v-if="user.profileImage"
          :src="user.profileImage"
          :alt="`${user.firstName} ${user.lastName}`"
          class="user-card__image"
      >
      <div v-else class="user-card__image-placeholder">
        <span>{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
      </div>
    </div>
    <div class="user-card__name-container">
      <h3 class="user-card__name">{{ user.firstName }}</h3>
      <h3 class="user-card__name">{{ user.lastName }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from "vue";
import type {IBasicUser} from "@/types/user.ts";

export default defineComponent({
  name: "UserCard",
  props: {
    user: {
      type: Object as PropType<IBasicUser>,
      required: true,
    }
  },
  // methods: {
  //   handleImageError(e: Event): void {
  //     const target = e.target as HTMLImageElement;
  //     target.src = 'https://cdn.litres.ru/pub/c/cover/66691848.jpg';
  //   }
  // }
})
</script>

<style scoped lang="scss">
.user-card {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1.1rem;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    cursor: pointer;
  }

  &__image-container {
    position: relative;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__image-placeholder {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: var(--color-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    border: 2px solid var(--color-border);
  }

  &__name-container {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }

  &__name {
    font-size: 25px;
    font-weight: 500;
    color: var(--color-text);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>