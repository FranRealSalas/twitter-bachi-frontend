import { Chat } from "./chat";
import { UserResponseDTO } from "./user";

export type Message = {
    id: number;
    content: string;
    sender: UserResponseDTO;
    chat: Chat;
}

export type MessageResponseDTO = {
    id: number;
    content: string;
    sender: UserResponseDTO;
    date: Date;
}