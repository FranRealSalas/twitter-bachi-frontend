import axiosInstance from "@/lib/axios";
import { Message, MessageResponseDTO } from "@/types/message";
import { UserResponseDTO } from "@/types/user";

const MessageService = {
    async createMessage(content: string, sender: UserResponseDTO|undefined, chatId: number|undefined, usersId: number[]): Promise<Message> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/messages`, { content, sender, chatId, usersId })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async getAllMessagesByChatId(chatId: number|null, id:number|null): Promise<MessageResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/messages/${chatId}${id ? `?id=${id}` : ''}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

export default MessageService;