import { Chat, ChatResponseDTO } from "@/types/chat";
import { UserResponseDTO } from "@/types/user";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ChatComponentProps {
    loggedUser: UserResponseDTO | undefined;
    chat: ChatResponseDTO;
    setOpenChat: Dispatch<SetStateAction<boolean>>;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ setOpenChat, chat, loggedUser }) => {
    const chatUser = chat.users.filter((user) => user.username != loggedUser?.username)[0]
    const [lastMessageHour, setLastMessageHour] = useState("");

    useEffect(() => {
        // Verificar si el mensaje existe y si tiene una fecha válida
        if (!chat.lastMessage || !chat.lastMessage.date) {
            return; // Si no hay mensaje o la fecha no está disponible, no hacer nada
        }

        const lastMessageDate = new Date(chat.lastMessage.date);

        if (isNaN(lastMessageDate.getTime())) {
            return;
        }

        const currentDate = new Date();

        // Calcular la diferencia en milisegundos
        const timeDifference = currentDate.getTime() - lastMessageDate.getTime()

        // Si la diferencia es menor a 24 horas (24 * 60 * 60 * 1000 milisegundos)
        if (timeDifference < 24 * 60 * 60 * 1000) {
            // Mostrar solo la hora y los minutos
            const formattedHour = lastMessageDate.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
            });
            setLastMessageHour(formattedHour);
        } else {
            // Mostrar la fecha completa si han pasado más de 24 horas
            const formattedDate = lastMessageDate.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
            setLastMessageHour(formattedDate);
        }
    }, [chat]);

    return (
        <>
            {
                chat ?
                    (
                        <div className='border-y border-gray-400 flex flex-row items-center justify-between p-2 w-full' onClick={() => setOpenChat(true)}>
                            <div className="flex flex-row gap-2 w-full">
                                <img
                                    className='rounded-full w-10 h-10'
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploads/profile/img/${chatUser.profilePhoto}`}
                                />
                                <div className='flex flex-col gap-1 items-start w-full'>
                                    <div className="flex flex-row gap-2">
                                        <h1>{chatUser.editableName}</h1>
                                        <span className="text-gray-400">@{chatUser.username}</span>
                                    </div>
                                    <div className="flex flex-row w-full justify-between">
                                        <span className="text-gray-400">{chat.lastMessage?.content}</span>
                                        <span className="text-gray-400">{lastMessageHour}</span>
                                    </div>
                                </div>
                            </div>
                        </div >
                    ) : (
                        <></>
                    )
            }
        </>

    );
};

export default ChatComponent;