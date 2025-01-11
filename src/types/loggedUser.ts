import { Role } from "./role";

export type LoggedUser = {
    username: string;
    admin: boolean;
    roles: Role[];
    profilePhoto: String;
}