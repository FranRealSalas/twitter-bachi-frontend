import { UserResponseDTO } from "./user";

export type Notification = {
    id: number;
    title: string;
    description: string;
    icon: string;
    href: string;
    profileImage: string;
}

export type UserNotification = {
    id: number;
    user: UserResponseDTO;
    notification: Notification;
    readed: boolean;
}