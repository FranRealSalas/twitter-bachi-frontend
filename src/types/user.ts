import { Role } from "./role";

export type User = {
    id: number;
    username: string;
    editableName: string;
    password: string;
    email: string
    admin: boolean;
    roles: Role[];
}

export type UserResponseDTO = {
    id: number;
    editableName: string;
    username: string;
    email: string;
    countTweets: number;
    admin: boolean;
    roles: Role[];
    follow: boolean;
    profilePhoto: String;
    coverPhoto: String;
    followedCount: number;
    followerCount: number;
}

export type UserMessage = {
    id:number;
    username: string;
    profilePhoto: string;
    editableName: string;
}

export type LoggedUser = {
    username: string;
    editableName: string;
    admin: boolean;
    roles: Role[];
    profilePhoto: string;
}

export type UserFollow = {
    id:number;
    followed:UserResponseDTO;
    follower:UserResponseDTO;
}