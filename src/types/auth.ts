export interface RegisterFormDto {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface LoginFormDto {
    login: string;
    password: string;
}

export interface TkPairDto {
    accessToken: string;
    refreshToken: string;
}