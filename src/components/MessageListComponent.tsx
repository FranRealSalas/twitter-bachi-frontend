import MessageService from "@/services/MessageService";
import { ChatResponseDTO } from "@/types/chat";
import { MessageResponseDTO } from "@/types/message";
import { UserResponseDTO } from "@/types/user";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import MessageComponent from "./MessageComponent";
import ChatService from "@/services/ChatService";

function MessageListComponent({ currentChat, chatOpen, loggedUser, setCurrentChat }: { currentChat: ChatResponseDTO | undefined, chatOpen: boolean, loggedUser: UserResponseDTO | undefined, setCurrentChat: Dispatch<SetStateAction<ChatResponseDTO | undefined>> }) {
    const [messages, setMessages] = useState<MessageResponseDTO[]>([]);
    const [lastIdMessages, setLastIdMessages] = useState<number | null>(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const scrollHandlerActiveMessages = useRef(false);
    const scrollContainerMessagesRef = useRef<HTMLDivElement>(null);
    const [lastResponseMessageScroll, setLastResponseMessageScroll] = useState<MessageResponseDTO[]>([]);

    useEffect(() => {
        const fetchInitialMessages = async () => {
            if (!currentChat || !currentChat.users) return;

            try {
                setIsLoadingMessages(true);

                // Si no tenemos el chat.id, lo resolvemos
                if (!currentChat.id) {
                    const resolvedChat = await ChatService.getChatByExactParticipants(currentChat.users.map(user => user.id));

                    setCurrentChat(resolvedChat);

                    const response = await MessageService.getAllMessagesByChatId(resolvedChat.id, null);
                    if (response && response.length > 0) {
                        setMessages(response);
                        setLastIdMessages(response[response.length - 1].id);
                        setLastResponseMessageScroll(response);
                    }
                    return; // Ya cargaste los mensajes
                }

                // Si ya tenemos chat.id, cargamos directamente
                const response = await MessageService.getAllMessagesByChatId(currentChat.id, null);
                if (response && response.length > 0) {
                    setMessages(response);
                    setLastIdMessages(response[response.length - 1].id);
                    setLastResponseMessageScroll(response);
                }
            } catch (error) {
                console.error("Error loading initial messages:", error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchInitialMessages();
    }, [currentChat]);


    useEffect(() => {
        const handleScroll = () => {
            const scrollContainerMessages = scrollContainerMessagesRef.current;

            if (scrollContainerMessages) {
                // Obtenemos el desplazamiento y las dimensiones del contenedor
                const scrollTop = scrollContainerMessages.scrollTop;

                // Verificamos si estamos cerca del principio
                const isNearTop = scrollTop <= 50; // Si estamos a menos de 50px del principio

                // Solo cargar más mensajes si estamos cerca del principio y no estamos ya cargando
                if (isNearTop && !isLoadingMessages && lastIdMessages && !scrollHandlerActiveMessages.current && currentChat) {
                    scrollHandlerActiveMessages.current = true; // Evitar múltiples disparos

                    setIsLoadingMessages(true);
                    if (lastResponseMessageScroll.length > 0) {
                        MessageService.getAllMessagesByChatId(currentChat.id, lastIdMessages)
                            .then((response) => {
                                setLastResponseMessageScroll(response);
                                if (response && response.length > 0) {
                                    setMessages(prev => [...response, ...prev]);
                                    setLastIdMessages(response[response.length - 1].id);
                                }
                            })
                            .catch(err => console.error("Error loading more messages:", err))
                            .finally(() => {
                                setIsLoadingMessages(false);

                                // Reactivar el handler después de un breve retraso
                                setTimeout(() => {
                                    scrollHandlerActiveMessages.current = false;
                                }, 50);
                            });
                    }
                    else {
                        setIsLoadingMessages(false);
                    }
                }
            }
        };

        // Solo agregar el event listener si tenemos un currentChat y tenemos un lastIdMessages
        if (scrollContainerMessagesRef.current) {
            scrollContainerMessagesRef.current.addEventListener('scroll', handleScroll);
        }

        // Limpiar event listener cuando el componente se desmonte
        return () => {
            if (scrollContainerMessagesRef.current) {
                scrollContainerMessagesRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isLoadingMessages, lastIdMessages, currentChat]);

    useEffect(() => {
        // Solo hacer esto cuando el chat esté abierto (Nos lleva al ultimo mensaje)
        if (chatOpen) {
            const scrollContainerMessages = scrollContainerMessagesRef.current;

            // Asegurarse de que el contenedor del scroll esté disponible
            if (scrollContainerMessages) {
                // Usamos un pequeño retraso para asegurarnos de que los mensajes se hayan renderizado
                setTimeout(() => {
                    // Desplazar al final
                    scrollContainerMessages.scrollTop = scrollContainerMessages.scrollHeight;
                }, 50);
            }
        }
    }, [chatOpen, currentChat]);

    return (
        <div className='max-h-72 flex flex-col gap-2 overflow-y-auto scrollbar scrollbar-track-black scrollbar-thumb-customGrayChat py-3' ref={scrollContainerMessagesRef}>
            {
                messages ? (
                    messages.sort((a, b) => a.id - b.id).map((message) => (
                        <div key={`${message.id}`}>
                            <MessageComponent loggedUser={loggedUser} sender={message.sender} text={message.content} />
                        </div>
                    ))
                ) : null
            }
        </div>
    )
}

export default MessageListComponent;