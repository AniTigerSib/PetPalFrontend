<script setup lang="ts">
import {onBeforeRouteLeave, RouterLink, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.ts";
import "@/assets/auth-shared.scss"

const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
  await authStore.login();
  console.log("ASASFASGGAGASGASGASGASGASGASGAGSGSGSAGAS");

  if (!authStore.authError) {
    await router.push("/");
    console.log(`No errors found`);
  } else {
    console.log(`Error found: ${authStore.authError}`);
    await authStore.logout(false);
  }
}

onBeforeRouteLeave((to, from, next) => {
  authStore.resetLoginForm();
  authStore.resetErrors();
  next();
})
</script>

<template>
  <div class="auth-view">
    <div class="auth-title">
      <p>Вход</p>
    </div>
    <div class="auth-form-container">
      <form class="auth-form" @keydown.enter.prevent="login" @submit.prevent="login">
        <div class="auth-input">
          <label for="login">Логин</label>
          <input type="text" v-model="authStore.loginForm.login" placeholder="Введите логин">
        </div>
        <div class="auth-input">
          <label for="password">Пароль</label>
          <input type="password" v-model="authStore.loginForm.password" placeholder="Введите пароль">
          <small v-if="authStore.authError && !authStore.isLoginIncorrect">
            Произошла ошибка, попробуйте еще раз.
          </small>
          <small v-if="authStore.authError && authStore.isLoginIncorrect">
            {{ authStore.authError }}
          </small>
        </div>
        <button
            type="submit"
            :disabled="authStore.isLoginIncorrect || authStore.loading"
        >Войти</button>
      </form>
      <p>Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink></p>
    </div>
  </div>
</template>
