<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-title">404</h1>
      <div class="error-message">
        <h2>Упс! Страница не найдена</h2>
        <p>Похоже, страница, которую вы ищете, не существует или была перемещена.</p>
      </div>
      <button class="home-button" @click="goHome">
        Вернуться на главную
      </button>
    </div>
    <div class="error-animation">
      <div class="ghost">
        <div class="ghost-body"></div>
        <div class="ghost-eyes">
          <div class="eye"></div>
          <div class="eye"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NotFound',
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped lang="scss">
.error-container {
  //min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  //background-color: #f8f9fa;
}

.error-content {
  text-align: center;
  max-width: 600px;
}

.error-title {
  font-size: 8rem;
  font-weight: bold;
  //color: #343a40;
  margin: 0;
  line-height: 1;
}

.error-message {
  margin: 2rem 0;
}

.error-message h2 {
  font-size: 2rem;
  //color: #495057;
  margin-bottom: 1rem;
}

.error-message p {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.home-button {
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  background-color: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: var(--color-secondary-muted);
}

.error-animation {
  margin-top: 3rem;
}

.ghost {
  position: relative;
  width: 100px;
  height: 100px;
  animation: float 3s ease-in-out infinite;
}

.ghost-body {
  width: 100%;
  height: 100%;
  background-color: var(--color-text);
  border-radius: 50% 50% 0 0;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.ghost-eyes {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  display: flex;
  justify-content: space-between;
}

.eye {
  width: 12px;
  height: 12px;
  background-color: var(--color-background-dark);
  border-radius: 50%;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
