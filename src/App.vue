<script setup lang="ts">
import { RouterView } from 'vue-router'
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
</script>

<template>
  <Header />
  <div class="bg-container">
    <div class="content">
      <RouterView />
    </div>
  </div>

  <Footer />
</template>

<style lang="scss" scoped>
.bg-container {
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
  background-color: var(--color-background);
}
.content {
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center; /* для центрирования по горизонтали */
  height: 100%;
}
</style>
