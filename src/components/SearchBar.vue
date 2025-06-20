<script lang="ts">
import { defineComponent, ref } from 'vue';
import IconSearch from './icons/IconSearch.vue';
import router from "@/router";

export default defineComponent({
  name: 'SearchBar',
  components: {
    IconSearch,
  },
  setup() {
    const searchQuery = ref('');

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      searchQuery.value = target.value;
      // Здесь можно добавить дополнительную логику обработки поискового запроса
    };

    const toSearch = (searchQuery: string) => {
      router.push({name: 'searchPage', query: { q: searchQuery }})
    }

    return {
      searchQuery,
      handleInput,
      toSearch,
    };
  },
});
</script>

<template>
  <div class="search-container">
    <IconSearch class="search-icon" v-on:click="toSearch(searchQuery)"/>
    <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Поиск..."
        @input="handleInput"
        @keydown.enter.prevent="toSearch(searchQuery)"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-container {
  position: relative;
  max-width: 680px;
  width: 100%;
  height: 3.6rem;
  border: 2px solid var(--color-border);
  border-radius: 0.8rem;
  padding: 0.95rem 1rem;
  display: flex;
  align-items: center;
  transition: border-color 0.4s;
  background-color: var(--color-background-dark);
}

.search-container:hover {
  border-color: var(--color-border-hover);
  transition: border-color 0.4s;
}

.search-container:focus-within {
  border-color: var(--color-border-hover);
  transition: border-color 0.4s;
}

.search-icon {
  flex-shrink: 0;
  stroke: var(--color-mute);
}

.search-input {
  margin-left: 12px;
  width: 100%;
  border: none;
  outline: none;
  font-size: 1.13rem;
  background: transparent;
  color: var(--color-text);

  &::placeholder {
    color: var(--color-text-unfocused);
  }
}
</style>
