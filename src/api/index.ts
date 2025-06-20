import axios, {type AxiosResponse, type InternalAxiosRequestConfig} from 'axios';
import {useAuthStore} from "@/stores/auth.ts";
import {refreshApi} from "@/api/auth.ts";
import router from "@/router";
import StorageService from "@/stores/storage-service.ts";

const $host = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

const $authHost = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // config.headers.authorization = `Bearer ${StorageService.getItem<string>('access')}`;
    const token = StorageService.getItem<string>('access');

    if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = 'Bearer ' + token;
    }
    console.error(config.headers.Authorization);

    return config;
};

$authHost.interceptors.request.use(authInterceptor)

$authHost.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    console.error(config);
    return config;
})

$authHost.interceptors.response.use((response: AxiosResponse) => {
    return response;
}, async function (error) {
    const authStore = useAuthStore();
    const originalRequest = error.config;
    const refreshToken = StorageService.getItem<string>('refresh');

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken !== null) {
        originalRequest._retry = true;

        try {
            const newTokenPair = await refreshApi(refreshToken);
            console.log(`New token pair:\nAccess: ${newTokenPair.accessToken}
                         \nRefresh: ${newTokenPair.refreshToken}`);
            authStore.accessToken = newTokenPair.accessToken;
            authStore.refreshToken = newTokenPair.refreshToken;
            StorageService.setItem<string>('access', newTokenPair.accessToken);
            StorageService.setItem<string>('refresh', newTokenPair.refreshToken);
        } catch (e) {
            console.log(e);
            await authStore.logout(false);
            await router.push('/login');
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