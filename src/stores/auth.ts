import {ref, watch} from "vue";
import { defineStore } from "pinia";
import {loginApi, logoutApi, registerApi} from "@/api/auth.ts";
import type {ILoginFormDto, IRegisterFormDto} from "@/types/auth.ts";
import StorageService from "@/stores/storage-service.ts";
// import {loginApi, logoutApi, registerApi} from "@/api/auth.ts";

export const useAuthStore = defineStore('auth', () => {
    const accessTokenRef = ref(StorageService.getItem<string>('access'));
    const refreshTokenRef = ref(StorageService.getItem<string>('refresh'));
    const uid = ref(StorageService.getItem<number>('uid'));
    const loginForm = ref<ILoginFormDto>({
        login: '',
        password: '',
    });
    const registrationForm = ref<IRegisterFormDto>({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
    });
    const isLoginIncorrect = ref<boolean>(false);
    const isRegisterIncorrect = ref<boolean>(false);
    const authError = ref('');
    const isLoading = ref(false);
    const isLoggedIn = ref(!!accessTokenRef.value);
    // const basicUserInfo = ref<IThisBasicUser | null>(StorageService.getItem<IThisBasicUser>('user'));

    const resetLoginForm = () => {
        loginForm.value = {
            login: '',
            password: '',
        }
    }

    const resetRegisterForm = () => {
        registrationForm.value = {
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
        }
    }

    const loginFormCorrect = () => {
        return loginForm.value.login.trim() &&
               loginForm.value.password.trim();
    }

    const registerFormCorrect = () => {
        return registrationForm.value.email.trim() &&
               registrationForm.value.password.trim() &&
               registrationForm.value.username.trim() &&
               registrationForm.value.firstName.trim();
    }

    // Функция сброса ошибок
    const resetErrors = () => {
        authError.value = '';
        isLoginIncorrect.value = false;
        isRegisterIncorrect.value = false;
    };

    // Отслеживаем изменения username и password
    watch([loginForm, registrationForm], () => {
        if (authError.value) {
            resetErrors();
        }
    }, { deep: true });

    const register = async () => {
        if (!registerFormCorrect()) {
            authError.value = 'Some fields are missing or incorrect credentials.';
            isLoginIncorrect.value = true;
            return;
        }
        try {
            isLoading.value = true;
            await registerApi(registrationForm.value);
            resetRegisterForm();
        } catch (e: any) {
            authError.value = e.response.data || 'Something went wrong';
            if (e.response.status !== 500) {
                isLoginIncorrect.value = true;
            }
        } finally {
            isLoading.value = false;
        }
    }

    const login = async () => {
        if (!loginFormCorrect()) {
            authError.value = 'Some fields are missing or incorrect credentials.';
            isLoginIncorrect.value = true;
            return;
        }
        try {
            isLoading.value = true;
            const {user, ...tokenPair} = await loginApi(loginForm.value);
            console.log(tokenPair);
            uid.value = user.id;
            accessTokenRef.value = tokenPair.accessToken;
            refreshTokenRef.value = tokenPair.refreshToken;
            StorageService.setItem<number>('uid', user.id);
            StorageService.setItem<string>('access', tokenPair.accessToken);
            StorageService.setItem<string>('refresh', tokenPair.refreshToken);
            resetLoginForm();
            isLoggedIn.value = true;
        } catch (e: any) {
            authError.value = e.response.data || 'Something went wrong';
            if (e.response.status !== 500) {
                isLoginIncorrect.value = true;
            }
        } finally {
            isLoading.value = false;
        }
    }

    const logout = async (sendRequest: boolean) => {
        if (sendRequest) {
            try {
                isLoading.value = true;
                await logoutApi();
            } catch (e) {
                console.log(e);
            } finally {
                isLoading.value = false;
            }
        }
        isLoading.value = false;
        uid.value = null;
        accessTokenRef.value = null;
        refreshTokenRef.value = null;
        StorageService.clear();
        isLoggedIn.value = false;
    }

    return {
        accessToken: accessTokenRef,
        refreshToken: refreshTokenRef,
        authError,
        loginForm,
        registrationForm,
        resetErrors,
        resetLoginForm,
        resetRegisterForm,
        loading: isLoading,
        isLoggedIn,
        isLoginIncorrect,
        register,
        login,
        logout,
        uid,
    }
})
