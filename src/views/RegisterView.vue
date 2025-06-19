<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import "@/assets/auth-shared.scss"
import {useRouter} from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const register = async () => {
  await authStore.register();

  if (!authStore.authError) {
    await router.push("/login");
    console.log(`No errors found`);
  } else {
    console.log(`Error found: ${authStore.authError}`);
    await authStore.logout(false);
  }
}
</script>

<template>
  <div class="auth-view">
    <div class="auth-title">
      <p>Регистрация</p>
    </div>
    <div class="auth-form-container">
      <form class="auth-form" @keydown.enter.prevent="register" @submit.prevent="register">
        <div class="auth-input">
          <label for="login">Логин</label>
          <input type="text" v-model="authStore.registrationForm.username" placeholder="Придумайте логин">
        </div>
        <div class="auth-input">
          <label for="login">Почта</label>
          <input type="text" v-model="authStore.registrationForm.email" placeholder="Введите адрес электронной почты">
        </div>
        <div class="auth-input">
          <label for="login">Имя</label>
          <input type="text" v-model="authStore.registrationForm.firstName" placeholder="Введите имя">
        </div>
        <div class="auth-input">
          <label for="login">Отчество (необязательно)</label>
          <input type="text" v-model="authStore.registrationForm.lastName" placeholder="Введите отчество">
        </div>
        <div class="auth-input">
          <label for="password">Пароль</label>
          <input type="password" v-model="authStore.registrationForm.password" placeholder="Придумайте пароль">
          <small v-if="authStore.authError && !authStore.isLoginIncorrect">
            Произошла ошибка, попробуйте еще раз.
          </small>
          <small v-if="authStore.authError && authStore.isLoginIncorrect">
            Найден пользователь с таким логином.
          </small>
        </div>
        <button
            type="submit"
            :disabled="authStore.isLoginIncorrect || authStore.loading"
        >Создать аккаунт</button>
      </form>
      <p>Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink></p>
    </div>
  </div>
</template>
