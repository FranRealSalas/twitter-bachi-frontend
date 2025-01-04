import { Role } from "./role";

export type User = {
    id: number;
    username: string;
    editableName: string;
    password: string;
    email: string
    admin: boolean;
    roles: Role[];
    profilePhoto:String;
}

export type UserResponseDTO = {
    id: number;
    editableName: string;
    username: string;
    email: string
    admin: boolean;
    roles: Role[];
    profilePhoto:String;
}