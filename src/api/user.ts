import {$authHost} from "@/api/index.ts";
import type {IUserProfile} from "@/types/user.ts";

export const getProfile = async (id: number): Promise<IUserProfile> => {
    const { data } = await $authHost.get(`users/${id}`);
    return data;
}