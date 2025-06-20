import {$authHost} from "@/api/index.ts";
import type {IBasicUser, IUpdatableUserProfile, IUserProfile} from "@/types/user.ts";
import type {CreateFriendRequestDto, UpdateFriendRequestDto} from "@/types/friends.ts";

export const getProfile = async (id: number): Promise<IUserProfile> => {
    const { data } = await $authHost.get(`users/${id}`);
    return data;
}

export const updateProfile = async (id: number, profileData: Partial<IUpdatableUserProfile>): Promise<IUserProfile> => {
    const { data } = await $authHost.put(`users/${id}`, profileData);
    return data;
}

export const searchUsersApi = async (query: string): Promise<IBasicUser[]> => {
    const { data } = await $authHost.get(`users?q=${query}`);
    return data;
}

export const addFriend = async (friendRequestDto: CreateFriendRequestDto) => {
    return await $authHost.post(`friends/requests`, friendRequestDto);
}

export const respondFriendRequestApi = async (friendResponseDto: UpdateFriendRequestDto) => {
    return await $authHost.put(`friends/requests`, friendResponseDto);
}

export const deleteFriendApi = async (id: number) => {
    return await $authHost.delete(`friends/${id}`);
}