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
    email: string
    admin: boolean;
    roles: Role[];
    follow: boolean;
    profilePhoto: String;
    coverPhoto: String;
    followedCount: number;
    followerCount: number;
}

export type LoggedUser = {
    username: string;
    editableName: string;
    admin: boolean;
    roles: Role[];
    profilePhoto: string;
}