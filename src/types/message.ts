import { Chat } from "./chat";
import { LoggedUser, UserMessage, UserResponseDTO } from "./user";

export type Message = {
    id: number;
    content: string;
    sender: UserResponseDTO;
    chat: Chat;
}