<script setup lang="ts">
// import SearchBar from "@/components/SearchBar.vue";
import {useAuthStore} from "@/stores/auth.ts";
// import IconList from "@/components/icons/IconList.vue";
import {useRouter} from "vue-router";
import IconLogout from "@/components/icons/IconLogout.vue";
import IconUser from "@/components/icons/IconUser.vue";

const router = useRouter()

const authStore = useAuthStore();

const logout = async () => {
  await authStore.logout(true);
  await router.push('/login');
}
</script>

<template>
  <header class="header">
    <div class="header__container">
      <div class="header__logo">
        <p><RouterLink to="/">PetPal</RouterLink></p>
      </div>
<!--      <SearchBar v-if="authStore.isLoggedIn" />-->
      <div class="header__menu">
<!--        <IconList v-if="authStore.isLoggedIn" v-on:click="router.push('/favourites');" />-->
        <IconLogout v-if="authStore.isLoggedIn" v-on:click="logout();"/>
        <IconUser v-else v-on:click="router.push('/login');"/>
      </div>
    </div>
  </header>

</template>

<style lang="scss" scoped>
.header {
  color: var(--color-text);
  padding: 1.2rem 0;
  width: 100%;

  &__container {
    max-width: 1180px;
    margin: 0 auto;
    min-height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }

  &__logo {
    font-size: 2.2rem;
    font-weight: 800;

    a {
      color: var(--color-text);
      text-decoration: none;
      line-height: 100%;
    }
  }

  &__menu {
    display: flex;
    gap: 1rem;

    svg {
      cursor: pointer;
    }
  }
}
</style>
