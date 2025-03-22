import { Message } from "./message";
import { UserMessage, UserResponseDTO } from "./user";

export type Chat = {
    id: number;
    users: UserMessage[];
    messages: Message[]
}