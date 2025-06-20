<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {useAuthStore} from '@/stores/auth.ts';
import {useUserStore} from '@/stores/user.ts';
import StorageService from '@/stores/storage-service.ts';
import router from "@/router";
import {addFriend, deleteFriendApi, respondFriendRequestApi} from "@/api/user.ts";
import {FriendRequestStatus} from "@/types/friends.ts";

const route = useRoute();
const authStore = useAuthStore();
const userStore = useUserStore();

const userId = Number(route.params.id);
const currentUserId = ref(StorageService.getItem<number>('uid'));

const isOwnProfile = computed(() => {
  return currentUserId.value === userStore.userInfo.id;
});

const makeFriendRequest = async () => {
  await addFriend({receiverId: userId});
  await userStore.loadUserProfile(userId);
}

const responseFriendRequest = async (isPositive: boolean) => {
  if (userStore.userInfo.friendReqId) {
    if (isPositive) {
      await respondFriendRequestApi({requestId: userStore.userInfo.friendReqId, status: FriendRequestStatus.ACCEPTED})
    } else {
      await respondFriendRequestApi({requestId: userStore.userInfo.friendReqId, status: FriendRequestStatus.REJECTED})
    }
  }
  await userStore.loadUserProfile(userId);
}

const deleteFriend = async () => {
  await deleteFriendApi(userStore.userInfo.id);
  await userStore.loadUserProfile(userId);
}

onMounted(async () => {
  console.log(userId);
  if (!authStore.isLoggedIn) {
    await authStore.logout(false);
    await router.push('/login');
  } else {
    await userStore.loadUserProfile(userId);
  }
});
</script>

<template>
  <div class="user-page">
<!--    v-if="!userStore.isLoading"-->
    <div class="user-info">
      <div class="user-header">
        <div class="user-avatar">
          <img
              v-if="userStore.userInfo.profileImage"
              :src="userStore.userInfo.profileImage"
              :alt="`${userStore.userInfo.firstName} ${userStore.userInfo.lastName}`"
              class="avatar-image"
          >
          <div v-else class="avatar-placeholder">
            <span>{{ userStore.userInfo.firstName.charAt(0) }}{{ userStore.userInfo.lastName.charAt(0) }}</span>
          </div>
        </div>

        <div class="user-details">
          <div class="name-section" v-if="!userStore.isEditing">
            <h1 class="user-name">{{ userStore.userInfo.firstName }} {{ userStore.userInfo.lastName }}</h1>
            <p class="username">@{{ userStore.userInfo.username }}</p>
          </div>

          <div class="name-section" v-else>
            <div class="edit-input-group">
              <input
                  v-model="userStore.editableUserInfo.firstName"
                  placeholder="Имя"
                  class="edit-input name-input"
              >
              <input
                  v-model="userStore.editableUserInfo.lastName"
                  placeholder="Фамилия"
                  class="edit-input name-input"
              >
            </div>
            <p class="username">@{{ userStore.userInfo.username }}</p>
          </div>

          <div class="user-actions" v-if="isOwnProfile">
            <button
                v-if="!userStore.isEditing"
                @click="userStore.startEditing"
                class="edit-button"
            >
              Редактировать
            </button>

            <div v-else class="edit-actions">
              <button
                  @click="userStore.saveUserProfile()"
                  :disabled="userStore.isSaving"
                  class="save-button"
              >
                {{ userStore.isSaving ? 'Сохранение...' : 'Сохранить' }}
              </button>
              <button
                  @click="userStore.cancelEditing"
                  class="cancel-button"
              >
                Отмена
              </button>
            </div>
          </div>
          <div class="user-actions" v-else>
            <button
                v-if="userStore.userInfo.friendStatus == ''"
                @click="makeFriendRequest()"
                class="edit-button"
            >
              Добавить в друзья
            </button>
            <button
                v-if="userStore.userInfo.friendStatus == 'pendingRequest'"
                @click="responseFriendRequest(true)"
                class="edit-button"
            >
              Принять запрос
            </button>
            <button
                v-if="userStore.userInfo.friendStatus == 'pendingRequest'"
                @click="responseFriendRequest(false)"
                class="edit-button"
            >
              Отклонить запрос
            </button>
            <button
                v-else-if="userStore.userInfo.friendStatus == 'accepted' || userStore.userInfo.friendStatus == 'acceptedRequest'"
                @click="deleteFriend()"
                class="edit-button"
            >
              Удалить из друзей
            </button>
            <span
                v-else-if="userStore.userInfo.friendStatus == 'pending'"
                class="friend-status"
            >
              Запрос отправлен
            </span>
            <span
                v-else-if="userStore.userInfo.friendStatus == 'rejected' || userStore.userInfo.friendStatus == 'rejectedRequest'"
                class="friend-status"
            >
              Запрос дружбы отклонен
            </span>
          </div>
        </div>
      </div>

      <div class="user-bio">
        <h3>О себе</h3>
        <div v-if="!userStore.isEditing" class="bio-content">
          <p v-if="userStore.userInfo.bio">{{ userStore.userInfo.bio }}</p>
          <p v-else class="no-bio">{{ isOwnProfile ? 'Расскажите о себе' : 'Пользователь пока ничего не рассказал о себе' }}</p>
        </div>

        <div v-else class="bio-edit">
          <textarea
              v-model="userStore.editableUserInfo.bio"
              placeholder="Расскажите о себе..."
              class="bio-textarea"
              rows="4"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="user-posts">
      <!-- Здесь будут посты пользователя -->
    </div>
  </div>

<!--  <div v-else class="loading-container">-->
<!--    <p>Загрузка...</p>-->
<!--  </div>-->
</template>

<style scoped lang="scss">
.user-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.user-info {
  background-color: var(--color-background-dark);
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.user-header {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  border: 2px solid var(--color-border);
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.name-section {
  .user-name {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }

  .username {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
  }
}

.edit-input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.edit-input {
  padding: 0.8rem;
  font-size: 1rem;
  color: var(--color-text);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--color-border-hover);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
}

.name-input {
  flex: 1;
  font-size: 1.5rem;
  font-weight: 600;
}

.user-actions {
  display: flex;
  gap: 1rem;
}

.edit-button {
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  background-color: var(--color-secondary);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-secondary-muted);
  }

  &:focus {
    outline: none;
    background-color: var(--color-secondary-muted);
  }
}

.edit-actions {
  display: flex;
  gap: 1rem;
}

.save-button {
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background-color: var(--color-btn-read);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.3s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
}

.cancel-button {
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-border);
  }
}

.user-bio {
  h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--color-text);
  }
}

.bio-content {
  p {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-text);
  }

  .no-bio {
    color: var(--color-text-secondary);
    font-style: italic;
  }
}

.bio-textarea {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: var(--color-text);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--color-border-hover);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }

  .edit-input-group {
    flex-direction: column;
  }

  .user-page {
    padding: 1rem 0.5rem;
  }

  .user-info {
    padding: 1.5rem;
  }

  .avatar-image,
  .avatar-placeholder {
    width: 100px;
    height: 100px;
  }

  .avatar-placeholder {
    font-size: 2rem;
  }

  .name-section .user-name {
    font-size: 1.5rem;
  }
}
</style>