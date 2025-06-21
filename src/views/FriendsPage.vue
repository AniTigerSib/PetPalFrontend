<template>
  <div class="friends-page">
    <div class="friends-header">
      <h1>Мои друзья</h1>
      <div class="friends-count" v-if="!friendsStore.isLoading && friendsStore.pagination.total > 0">
        <span>{{ friendsStore.pagination.total }} {{ pluralizeFriends(friendsStore.pagination.total) }}</span>
      </div>
    </div>

    <div v-if="friendsStore.isLoading" class="loading-container">
      <p>Загрузка друзей...</p>
    </div>

    <div v-else-if="friendsStore.error" class="error-container">
      <p>{{ friendsStore.error }}</p>
      <button @click="loadFriends" class="retry-btn">
        Попробовать снова
      </button>
    </div>

    <div v-else-if="friendsStore.friends.length === 0" class="empty-state">
      <div class="empty-icon">👥</div>
      <h2>У вас пока нет друзей</h2>
      <p>Найдите интересных людей и добавьте их в друзья!</p>
      <button @click="goToSearch" class="search-btn">
        Найти друзей
      </button>
    </div>

    <div v-else class="friends-content">
      <div class="friends-list">
        <FriendCard
            v-for="friend in friendsStore.friends"
            :key="friend.id"
            :friend="friend"
            @remove-friend="handleRemoveFriend"
        />
      </div>

      <Pagination
          :current-page="friendsStore.pagination.page"
          :total-pages="friendsStore.pagination.totalPages"
          :total="friendsStore.pagination.total"
          :limit="friendsStore.pagination.limit"
          :has-next="friendsStore.pagination.hasNext"
          :has-prev="friendsStore.pagination.hasPrev"
          @next-page="friendsStore.nextPage"
          @prev-page="friendsStore.prevPage"
          @go-to-page="friendsStore.goToPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthStore} from '@/stores/auth.ts';
import {useFriendsStore} from '@/stores/friends.ts';
import {deleteFriendApi} from '@/api/user.ts';
import FriendCard from '@/components/FriendsCard.vue';
import Pagination from '@/components/PaginationComponent.vue';

const router = useRouter();
const authStore = useAuthStore();
const friendsStore = useFriendsStore();

const loadFriends = async () => {
  await friendsStore.loadFriends();
};

const handleRemoveFriend = async (friendId: number) => {
  if (confirm('Вы уверены, что хотите удалить этого пользователя из друзей?')) {
    try {
      await deleteFriendApi(friendId);
      // Перезагружаем список друзей после удаления
      await loadFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      // Можно добавить уведомление об ошибке
    }
  }
};

const goToSearch = async () => {
  await router.push('/search');
};

const pluralizeFriends = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'друзей';
  }

  if (lastDigit === 1) {
    return 'друг';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return 'друга';
  } else {
    return 'друзей';
  }
};

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    await authStore.logout(false);
    await router.push('/login');
  } else {
    await loadFriends();
  }
});

onUnmounted(() => {
  friendsStore.clearFriends();
});
</script>

<style scoped lang="scss">
.friends-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.friends-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
  }
}

.friends-count {
  span {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    font-weight: 500;
  }
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;

  p {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }
}

.retry-btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: var(--color-secondary);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-secondary-muted);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  max-width: 400px;
}

.search-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background-color: var(--color-secondary);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-secondary-muted);
  }
}

.friends-content {
  .friends-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .friends-page {
    padding: 1rem 0.5rem;
  }

  .friends-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;

    h1 {
      font-size: 1.5rem;
    }
  }

  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-icon {
    font-size: 3rem;
  }

  .empty-state h2 {
    font-size: 1.3rem;
  }
}</style>