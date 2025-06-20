export interface IThisBasicUser {
    id: number;
    username: string;
    email: string;
}

export interface IBasicUser {
    id: number;
    firstName: string;
    lastName: string;
    profileImage: string;
}

export interface IFriendUser extends IBasicUser {
    friendSince: Date;
}

export interface IUpdatableUserProfile {
    id: number;
    username: string;
    bio: string;
    firstName: string;
    lastName: string;
}

export interface IUserProfile extends IBasicUser {
    username: string;
    bio: string;
}