import {$host, $authHost} from "@/api/index.ts";
import type {LoginFormDto, RegisterFormDto} from "@/types/auth.ts";

export const registerApi = async (registerDto: RegisterFormDto) => {
    const { data } = await $host.post('auth/register', registerDto);
    return { data };
}

export const loginApi = async (loginDto: LoginFormDto) => {
    const { data } = await $host.post('auth/login', loginDto);
    return data;
}

export const refreshApi = async (refreshToken: string) => {
    const { data } = await $host.post('auth/refresh', { refreshToken });
    return data;
}

export const logoutApi = async () => {
    return await $authHost.post('auth/logout');
}