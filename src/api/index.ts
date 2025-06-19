import axios, {type AxiosResponse, type InternalAxiosRequestConfig} from 'axios';
import {useAuthStore} from "@/stores/auth.ts";
import {refreshApi} from "@/api/user.ts";
import router from "@/router";
import type {TkPairDto} from "@/types/auth.ts";

const $host = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

const $authHost = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    config.headers.authorization = `Bearer ${localStorage.getItem('access')}`;
    return config;
};

$authHost.interceptors.request.use(authInterceptor)

$authHost.interceptors.response.use((response: AxiosResponse) => {
    return response;
}, async function (error) {
    const authStore = useAuthStore();
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refresh');

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken !== null) {
        originalRequest._retry = true;

        try {
            const newTokenPair: TkPairDto = await refreshApi(refreshToken);
            console.log(`New token pair:\nAccess: ${newTokenPair.accessToken}
                         \nRefresh: ${newTokenPair.refreshToken}`);
            authStore.accessToken = newTokenPair.accessToken;
            authStore.refreshToken = newTokenPair.refreshToken;
            localStorage.setItem('access', newTokenPair.accessToken);
            localStorage.setItem('refresh', newTokenPair.refreshToken);
        } catch (e) {
            console.log(e);
            await authStore.logout(false);
            // await router.push('/login');
        }
    } else if (error.response?.status === 404) {
        await router.push({name: 'NotFound'});
    }

    console.log(error.response.data);
    return Promise.reject(error);
})

export {
    $host,
    $authHost,
}