import { Message, MessageResponseDTO } from "./message";
import { UserResponseDTO } from "./user";

export type Chat = {
    id: number;
    users: UserResponseDTO[];
    messages: Message[];
    date: Date;
}

export type ChatResponseDTO = {
    id: number;
    users: UserResponseDTO[];
    messages: Message[];
    lastMessage: MessageResponseDTO;
    date: Date;
}
