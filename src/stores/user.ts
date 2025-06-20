import {defineStore} from "pinia";
import type {IUpdatableUserProfile, IUserProfile} from "@/types/user.ts";
import {ref} from "vue";
import {getProfile, updateProfile} from "@/api/user.ts";
import router from "@/router";

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<IUserProfile>({
        id: 0,
        bio: "", firstName: "", lastName: "", username: "", profileImage: "", isFriend: false,
    })
    const editableUserInfo = ref<IUpdatableUserProfile>({
        id: 0,
        bio: "", firstName: "", lastName: "", username: "",
    })
    const isLoading = ref(false);
    const isEditing = ref(false);
    const isSaving = ref(false);

    const startEditing = () => {
        isEditing.value = true;
        editableUserInfo.value = { ...userInfo.value };
    };

    const cancelEditing = () => {
        isEditing.value = false;
        editableUserInfo.value = { ...userInfo.value };
    };

    const clearUserInfo = () => {
        userInfo.value = {
            id: 0,
            bio: "", firstName: "", lastName: "", username: "", profileImage: "", isFriend: false,
        }
    }

    const loadUserProfile = async (id: number) => {
        try {
            isLoading.value = true;
            userInfo.value = await getProfile(id);
        } catch (e: any) {
            console.error('Error loading user profile:', e);
            clearUserInfo();
        } finally {
            isLoading.value = false;
        }
    }

    const openUserProfile = async (id: number) => {
        await router.push(`/user/${id}`);
    }

    const saveUserProfile = async () => {
        try {
            isSaving.value = true;
            userInfo.value = await updateProfile(userInfo.value.id, {
                firstName: editableUserInfo.value.firstName,
                lastName: editableUserInfo.value.lastName,
                bio: editableUserInfo.value.bio,
                username: editableUserInfo.value.username,
            });
            isEditing.value = false;
        } catch (error) {
            console.error('Error saving user profile:', error);
        } finally {
            isEditing.value = false;
        }
    }

    return {
        userInfo,
        editableUserInfo,
        isLoading,
        isEditing,
        isSaving,
        startEditing,
        cancelEditing,
        saveUserProfile,
        clearUserInfo,
        loadUserProfile,
        openUserProfile,
    }
});