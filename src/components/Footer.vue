<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__rights">
        <p>© 2025 PetPal. All rights reserved.</p>
      </div>
      <div class="footer__links">
        <p>Terms of use</p>
        <p>I</p>
        <p>Privacy policy</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  width: 100%;
  background-color: var(--color-background-dark);
  color: var(--color-text-secondary);

  &__container {
    max-width: 1180px;
    margin: 0 auto;
    padding: 1.2rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__links {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
  }
}
</style>
