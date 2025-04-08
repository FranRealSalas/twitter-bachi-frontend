import { UserResponseDTO } from "@/types/user";

interface MessageComponentProps {
    text: string;
    sender: UserResponseDTO | undefined;
    loggedUser: UserResponseDTO| undefined;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ text, sender, loggedUser }) => {

    return (
        <div className={`flex flex-col px-3 gap-2 ${(loggedUser?.username == sender?.username) ? "items-end" : "items-start"}`}>
            <div className={`w-fit p-2 rounded-3xl max-w-64 break-words whitespace-normal ${(loggedUser?.username == sender?.username) ? "bg-sky-500" : "bg-gray-600"}`}>
                <span>{text}</span>
            </div>
        </div>
    );
};

export default MessageComponent;