<template>
  <div class="pagination" v-if="totalPages > 1">
    <button
        @click="$emit('prevPage')"
        :disabled="!hasPrev"
        class="pagination-btn"
        :class="{ disabled: !hasPrev }"
    >
      ← Назад
    </button>

    <div class="pagination-pages">
      <button
          v-for="pageNum in visiblePages"
          :key="pageNum"
          @click="$emit('goToPage', pageNum)"
          class="pagination-btn page-btn"
          :class="{ active: pageNum === currentPage }"
      >
        {{ pageNum }}
      </button>
    </div>

    <button
        @click="$emit('nextPage')"
        :disabled="!hasNext"
        class="pagination-btn"
        :class="{ disabled: !hasNext }"
    >
      Вперед →
    </button>
  </div>

  <div class="pagination-info" v-if="total > 0">
    <p>Показано {{ startItem }}-{{ endItem }} из {{ total }} друзей</p>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

interface Props {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  nextPage: [];
  prevPage: [];
  goToPage: [page: number];
}>();

const startItem = computed(() => {
  return (props.currentPage - 1) * props.limit + 1;
});

const endItem = computed(() => {
  return Math.min(props.currentPage * props.limit, props.total);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;

  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    const start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(props.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }

  return pages;
});
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
}

.pagination-pages {
  display: flex;
  gap: 0.3rem;
  margin: 0 1rem;
}

.pagination-btn {
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  background-color: var(--color-background-dark);
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(.disabled) {
    background-color: var(--color-secondary);
    color: white;
    border-color: var(--color-secondary);
  }

  &.active {
    background-color: var(--color-secondary);
    color: white;
    border-color: var(--color-secondary);
  }

  &.disabled {
    color: var(--color-text-secondary);
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.page-btn {
  min-width: 40px;
  padding: 0.6rem 0.8rem;
}

.pagination-info {
  text-align: center;
  margin-top: 1rem;

  p {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0;
  }
}

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-pages {
    margin: 0;
  }

  .pagination-btn {
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }
}</style>