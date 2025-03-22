import { Chat } from "@/types/chat";
import { UserMessage, UserResponseDTO } from "@/types/user";
import { Dispatch, SetStateAction, useEffect } from "react";

interface ChatComponentProps {
    loggedUser: UserResponseDTO | undefined;
    chat: Chat;
    setOpenChat: Dispatch<SetStateAction<boolean>>;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ setOpenChat, chat, loggedUser }) => {
    const chatUser = chat.users.filter((user) => user.username != loggedUser?.username)[0]

    return (
        <>
            {
                chat ?
                    (
                        <div className='border-y border-gray-400 flex flex-row items-center justify-between p-2' onClick={() => setOpenChat(true)}>
                            <div className="flex flex-row gap-2">
                                <img
                                    className='rounded-full w-10 h-10'
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploads/profile/img/${chatUser.profilePhoto}`}
                                />
                                <div className='flex flex-col gap-1 items-start'>
                                    <div className="flex flex-row gap-2">
                                        <h1>{chatUser.editableName}</h1>
                                        <span className="text-gray-400">@{chatUser.username}</span>
                                    </div>
                                    <span className="text-gray-400">{chatUser.lastMessage}</span>
                                </div>
                            </div>
                            <span>20:45</span>
                        </div >
                    ) : (
                        <></>
                    )
            }
        </>

    );
};

export default ChatComponent;