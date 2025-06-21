<template>
  <div class="friend-card">
    <div class="friend-avatar">
      <img
          v-if="friend.profileImage"
          :src="friend.profileImage"
          :alt="`${friend.firstName} ${friend.lastName}`"
          class="avatar-image"
      >
      <div v-else class="avatar-placeholder">
        <span>{{ friend.firstName.charAt(0) }}{{ friend.lastName.charAt(0) }}</span>
      </div>
    </div>

    <div class="friend-info">
      <h3 class="friend-name">{{ friend.firstName }} {{ friend.lastName }}</h3>
      <p class="friend-since">Дружит с {{ formatDate(friend.friendSince) }}</p>
    </div>

    <div class="friend-actions">
      <button @click="openProfile" class="view-profile-btn">
        Открыть профиль
      </button>
      <button @click="$emit('removeFriend', friend.id)" class="remove-friend-btn">
        Удалить из друзей
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {IFriendUser} from "@/types/user.ts";
import {useUserStore} from "@/stores/user.ts";

interface Props {
  friend: IFriendUser;
}

const props = defineProps<Props>();
const userStore = useUserStore();

const emit = defineEmits<{
  removeFriend: [id: number];
}>();

const formatDate = (date: Date): string => {
  const friendDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - friendDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'вчера';
  } else if (diffDays < 7) {
    return `${diffDays} дн. назад`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} нед. назад`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} мес. назад`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} г. назад`;
  }
};

const openProfile = async () => {
  await userStore.openUserProfile(props.friend.id);
};
</script>

<style scoped lang="scss">
.friend-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--color-background-dark);
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  transition: border-color 0.3s;

  &:hover {
    border-color: var(--color-border-hover);
  }
}

.friend-avatar {
  flex-shrink: 0;
}

.avatar-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  border: 2px solid var(--color-border);
}

.friend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.friend-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.friend-since {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.friend-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.view-profile-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  background-color: var(--color-secondary);
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-secondary-muted);
  }
}

.remove-friend-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #dc3545;
  background-color: transparent;
  border: 1px solid #dc3545;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #dc3545;
    color: white;
  }
}

@media (max-width: 768px) {
  .friend-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .friend-actions {
    flex-direction: column;
    width: 100%;
  }

  .view-profile-btn,
  .remove-friend-btn {
    width: 100%;
  }
}</style>