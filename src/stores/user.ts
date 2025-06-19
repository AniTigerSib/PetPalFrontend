import {defineStore} from "pinia";
import type {IUserProfile} from "@/types/user.ts";
import {ref} from "vue";
import {getProfile} from "@/api/user.ts";

export const useAuthStore = defineStore('user', () => {
    const userInfo = ref<IUserProfile>({
        id: 0,
        bio: "", firstName: "", lastName: "", profileImage: "", username: "",
    })
    const isLoading = ref(false);

    const clearUserInfo = () => {
        userInfo.value = {
            id: 0,
            bio: "", firstName: "", lastName: "", profileImage: "", username: "",
        }
    }

    const loadUserProfile = async (id: number) => {
        try {
            isLoading.value = true;
            userInfo.value = await getProfile(id);
        } catch (e: any) {
            console.error(e);
            clearUserInfo();
        } finally {
            isLoading.value = false;
        }
    }
});