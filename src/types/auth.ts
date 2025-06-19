import type {IThisBasicUser} from "@/types/user.ts";

export interface IRegisterFormDto {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface ILoginFormDto {
    login: string;
    password: string;
}

export interface ITkPairDto {
    accessToken: string;
    refreshToken: string;
}

export interface ILoginResponse extends ITkPairDto{
    user: IThisBasicUser;
}