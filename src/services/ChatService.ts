import axiosInstance from "@/lib/axios";
import { Chat } from "@/types/chat";

const ChatService = {
    async createChat(usersId: number[]): Promise<Chat> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/chats`, { usersId })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async getChats(id:number|null): Promise<Chat[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/chats${id ? `?id=${id}` : ''}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }
}

export default ChatService;