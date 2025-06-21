import {$authHost} from "@/api/index.ts";
import type {IFriendUser} from "@/types/user.ts";

export interface IPaginationParams {
    page?: number;
    limit?: number;
}

export interface IPaginationResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export const getFriendsApi = async (params: IPaginationParams = {}): Promise<IPaginationResponse<IFriendUser>> => {
    const searchParams = new URLSearchParams();

    if (params.page) {
        searchParams.append('page', params.page.toString());
    }
    if (params.limit) {
        searchParams.append('limit', params.limit.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `friends?${queryString}` : 'friends';

    const { data } = await $authHost.get(url);
    return data;
}