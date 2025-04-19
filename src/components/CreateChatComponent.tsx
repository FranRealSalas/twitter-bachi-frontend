"use client"
import UserService from "@/services/UserService";
import { UserResponseDTO } from "@/types/user";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CreateChatModal from "./modals/ChatSearchModal";
import UserSearchComponent from "./UserSearchComponent";
import { ChatResponseDTO } from "@/types/chat";

function CreateChatComponent({ loggedUser, setChatOpen, selectUserForChat, setSelectUserForChat, setCurrentChat }: { loggedUser: UserResponseDTO | undefined, setChatOpen: Dispatch<SetStateAction<boolean>>, selectUserForChat: boolean, setSelectUserForChat: Dispatch<SetStateAction<boolean>>, setCurrentChat: Dispatch<SetStateAction<ChatResponseDTO | undefined>> }) {
    const [filteredUsers, setFilteredUsers] = useState<UserResponseDTO[] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsersForChat, setAllUsersForChat] = useState<UserResponseDTO[] | null>(null);

    useEffect(() => {
        UserService.getAllUsers().then((response) => {
            setAllUsersForChat(response);
        });
    }, []);

    //Maneja la barra de busqueda para seleccionar con quien crear el chat
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (allUsersForChat) {
            const filtered = allUsersForChat.filter((allUsersForChat) =>
                allUsersForChat.username.toLowerCase().startsWith(query.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    return (
        <div className='flex items-start'>
            <CreateChatModal open={selectUserForChat} setModalOpen={setSelectUserForChat}>
                <div>
                    <div className="flex justify-center w-full py-2">
                        <div className="flex flex-col gap-1">
                            <div className="relative w-full">
                                <span className="absolute flex left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <i className="material-symbols-outlined">search</i>
                                </span>
                                <input
                                    type="text"
                                    className="w-full h-8 rounded-xl bg-gray-700 outline-none px-10"
                                    placeholder="Buscar"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        {
                            filteredUsers ?
                                <div>
                                    {
                                        filteredUsers.length > 0 ?
                                            <div>{

                                                filteredUsers
                                                    .filter(user => user.username !== loggedUser?.username)
                                                    .sort(() => Math.random() - 0.5)
                                                    .slice(0, 4)
                                                    .map((user) => (
                                                        <div key={user.id}
                                                            onClick={() => {
                                                                // @ts-ignore
                                                                setCurrentChat({ users: [{ id: loggedUser.id }, { id: user.id, editableName: user.editableName }] })
                                                                setChatOpen(true)
                                                                setSelectUserForChat(false)
                                                            }}
                                                        >
                                                            <UserSearchComponent editableName={user.editableName} username={user.username}></UserSearchComponent>
                                                        </div>
                                                    ))
                                            }
                                            </div>
                                            :
                                            <div>No se encontro ningun usuario.</div>

                                    }
                                </div>
                                :
                                <div>
                                    {
                                        allUsersForChat ?
                                            allUsersForChat
                                                .filter(user => user.username !== loggedUser?.username)
                                                .slice(0, 4)
                                                .map((user) => (
                                                    <div key={user.id}
                                                        onClick={() => {
                                                            // @ts-ignore
                                                            setCurrentChat({ users: [{ id: loggedUser.id }, { id: user.id, editableName: user.editableName }] })
                                                            setChatOpen(true)
                                                            setSelectUserForChat(false)
                                                        }}
                                                    >
                                                        <UserSearchComponent editableName={user.editableName} username={user.username}></UserSearchComponent>
                                                    </div>
                                                ))
                                            :
                                            <>
                                            </>
                                    }
                                </div>
                        }
                    </div>
                </div>
            </CreateChatModal>
        </div>
    )
}

export default CreateChatComponent;