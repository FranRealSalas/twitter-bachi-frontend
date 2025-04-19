import axiosInstance from "@/lib/axios";
import { Chat, ChatResponseDTO } from "@/types/chat";
import { Pageable } from "@/types/pageable";

const ChatService = {
    async getChats(page:number): Promise<Pageable<ChatResponseDTO>> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/chats?page=${page}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    async getChatByExactParticipants(usersIds: number[]): Promise<ChatResponseDTO> {
        const params = new URLSearchParams();
        usersIds.forEach(userId => params.append("usersIds", userId.toString()));
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/chats/by-participants?${params.toString()}`;
    
        const response = await axiosInstance.get(url);
        return response.data;
    }
}

export default ChatService;