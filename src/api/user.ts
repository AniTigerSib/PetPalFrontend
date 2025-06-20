import {$authHost} from "@/api/index.ts";
import type {IUpdatableUserProfile, IUserProfile} from "@/types/user.ts";

export const getProfile = async (id: number): Promise<IUserProfile> => {
    const { data } = await $authHost.get(`users/${id}`);
    return data;
}

export const updateProfile = async (id: number, profileData: Partial<IUpdatableUserProfile>): Promise<IUserProfile> => {
    const { data } = await $authHost.put(`users/${id}`, profileData);
    return data;
}