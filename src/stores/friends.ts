import {defineStore} from "pinia";
import {ref} from "vue";
import type {IFriendUser} from "@/types/user.ts";
import {getFriendsApi, type IPaginationResponse} from "@/api/friends.ts";

export const useFriendsStore = defineStore('friends', () => {
    const friends = ref<IFriendUser[]>([]);
    const pagination = ref({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
    });
    const isLoading = ref(false);
    const error = ref<string>('');

    const loadFriends = async (page: number = 1, limit: number = 10) => {
        try {
            isLoading.value = true;
            error.value = '';

            const response: IPaginationResponse<IFriendUser> = await getFriendsApi({ page, limit });

            friends.value = response.data;
            pagination.value = response.pagination;
        } catch (e: any) {
            console.error('Error loading friends:', e);
            error.value = e.response?.data?.message || 'Ошибка при загрузке друзей';
        } finally {
            isLoading.value = false;
        }
    };

    const nextPage = async () => {
        if (pagination.value.hasNext) {
            await loadFriends(pagination.value.page + 1, pagination.value.limit);
        }
    };

    const prevPage = async () => {
        if (pagination.value.hasPrev) {
            await loadFriends(pagination.value.page - 1, pagination.value.limit);
        }
    };

    const goToPage = async (page: number) => {
        if (page >= 1 && page <= pagination.value.totalPages) {
            await loadFriends(page, pagination.value.limit);
        }
    };

    const clearFriends = () => {
        friends.value = [];
        pagination.value = {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
        };
        error.value = '';
    };

    return {
        friends,
        pagination,
        isLoading,
        error,
        loadFriends,
        nextPage,
        prevPage,
        goToPage,
        clearFriends
    };
});