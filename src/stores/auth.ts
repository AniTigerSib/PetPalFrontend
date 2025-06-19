import {ref, watch} from "vue";
import { defineStore } from "pinia";
import {loginApi, logoutApi, registerApi} from "@/api/user.ts";
import type {LoginFormDto, RegisterFormDto, TkPairDto} from "@/types/auth.ts";
// import {loginApi, logoutApi, registerApi} from "@/api/user.ts";

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(localStorage.getItem('access')?.toString());
    const refreshToken = ref(localStorage.getItem('refresh')?.toString());
    const loginForm = ref<LoginFormDto>({
        login: '',
        password: '',
    });
    const registrationForm = ref<RegisterFormDto>({
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
    const isLoggedIn = ref(!!accessToken.value);

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
        return loginForm.value.login.trim().length > 0 &&
               loginForm.value.password.trim().length > 0;
    }

    const registerFormCorrect = () => {
        return registrationForm.value.email.trim().length > 0 &&
               registrationForm.value.password.trim().length > 0 &&
               registrationForm.value.username.trim().length > 0 &&
               registrationForm.value.firstName.trim().length > 0;
    }

    // Функция сброса ошибок
    const resetErrors = () => {
        authError.value = '';
        isLoginIncorrect.value = false;
        isRegisterIncorrect.value = false;
    };

    // Отслеживаем изменения username и password
    watch([loginForm.value?.login, loginForm.value?.password], () => {
        resetErrors();
    });

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
            const tokenPair: TkPairDto = await loginApi(loginForm.value);
            accessToken.value = tokenPair.accessToken;
            refreshToken.value = tokenPair.refreshToken;
            localStorage.setItem('access', tokenPair.accessToken);
            localStorage.setItem('refresh', tokenPair.refreshToken);
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
        accessToken.value = undefined;
        refreshToken.value = undefined;
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        isLoggedIn.value = false;
    }

    return {
        accessToken,
        refreshToken,
        authError,
        loginForm,
        registrationForm,
        loading: isLoading,
        isLoggedIn,
        isLoginIncorrect,
        register,
        login,
        logout,
    }
})
