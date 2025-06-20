export enum FriendRequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export interface CreateFriendRequestDto {
    receiverId: number;
}

export interface UpdateFriendRequestDto {
    requestId: number;
    status: FriendRequestStatus;
}

export interface FriendRequestParams {
    status?: FriendRequestStatus;
}