import ChatService from "@/services/ChatService";
import { ChatResponseDTO } from "@/types/chat";
import { Pageable } from "@/types/pageable";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ChatComponent from "./ChatComponent";
import { UserResponseDTO } from "@/types/user";

function ChatListComponent({ chatMenuOpen, setChatOpen, setCurrentChat, loggedUser }: { chatMenuOpen: boolean, setChatOpen: Dispatch<SetStateAction<boolean>>, setCurrentChat: Dispatch<SetStateAction<ChatResponseDTO | undefined>>, loggedUser: UserResponseDTO | undefined }) {
    const [allChats, setAllChats] = useState<ChatResponseDTO[]>([]);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const scrollHandlerActiveChats = useRef(false);
    const scrollContainerChatsRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState<Pageable<ChatResponseDTO>>()


    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = scrollContainerChatsRef.current;
            if (scrollContainer) {
                const scrollTop = scrollContainer.scrollTop;
                const clientHeight = scrollContainer.clientHeight;
                const scrollHeight = scrollContainer.scrollHeight;
    
                const isNearBottom = scrollHeight - scrollTop - clientHeight <= 50;
    
                if (isNearBottom && !isLoadingChats && !scrollHandlerActiveChats.current) {
                    scrollHandlerActiveChats.current = true;
    
                    if (currentPage && !currentPage?.last) {
                        ChatService.getChats(currentPage.number + 1)
                            .then((response) => {
                                if (response && response.content.length > 0) {
                                    setAllChats((prev) => [...prev, ...response.content]);
                                    setCurrentPage(response);
                                }
                            })
                            .catch((err) => console.error("Error cargando más chats:", err))
                            .finally(() => {
                                setIsLoadingChats(false);
                                setTimeout(() => {
                                    scrollHandlerActiveChats.current = false;
                                }, 50);
                            });
                    } else {
                        setIsLoadingChats(false);
                    }
                }
            }
        };
    
        const scrollElement = scrollContainerChatsRef.current;
    
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
        }
    
        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isLoadingChats, currentPage]);
    

    // Cargar chats iniciales
    useEffect(() => {
        if (!chatMenuOpen) return;

        setIsLoadingChats(true);
        ChatService.getChats(0)
            .then((response) => {
                console.log(response)
                setCurrentPage(response)
                if (response && response.content.length > 0) {
                    setAllChats(response.content);
                }
            })
            .catch((error) => {
                console.error('Error loading initial chats:', error);
            })
            .finally(() => {
                setIsLoadingChats(false);
            })

    }, [chatMenuOpen]);


    return (
        <div className='h-full flex flex-col'>
            <div className='max-h-80 flex flex-col gap-2 overflow-y-auto scrollbar scrollbar-track-black scrollbar-thumb-customGrayChat py-3' ref={scrollContainerChatsRef}>
                {
                    allChats ? (
                        allChats.map((chat) => (
                            <div key={`${chat.id}`}
                                onClick={() => {
                                    setCurrentChat(chat)
                                }}>
                                <ChatComponent setOpenChat={setChatOpen} chat={chat} loggedUser={loggedUser} />
                            </div>
                        ))
                    ) : null
                }
            </div>
        </div>
    )

}

export default ChatListComponent;