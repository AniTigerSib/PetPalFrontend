import {$host, $authHost} from "@/api/index.ts";
import type {ILoginFormDto, ILoginResponse, IRegisterFormDto, ITkPairDto} from "@/types/auth.ts";

export const registerApi = async (registerDto: IRegisterFormDto) => {
    return await $host.post('auth/register', registerDto);
}

export const loginApi = async (loginDto: ILoginFormDto): Promise<ILoginResponse> => {
    const { data } = await $host.post('auth/login', loginDto);
    return data;
}

export const refreshApi = async (refreshToken: string): Promise<ITkPairDto> => {
    const { data } = await $host.post('auth/refresh', { refreshToken });
    return data;
}

export const logoutApi = async () => {
    return await $authHost.post('auth/logout');
}