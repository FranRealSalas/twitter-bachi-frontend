import React, { useEffect, useRef, useState } from 'react';
import { UserResponseDTO } from '@/types/user';
import UserService from '@/services/UserService';
import { ChatResponseDTO } from '@/types/chat';
import { useForm } from 'react-hook-form';
import { MessageResponseDTO } from '@/types/message';
import MessageService from '@/services/MessageService';
import CreateChatComponent from './CreateChatComponent';
import ChatListComponent from './ChatListComponent';
import MessageListComponent from './MessageListComponent';
import ChatService from '@/services/ChatService';

const ChatMenuComponent = () => {
    const [chatMenuOpen, setChatMenuOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [loggedUser, setLoggedUser] = useState<UserResponseDTO | undefined>();
    const [currentChat, setCurrentChat] = useState<ChatResponseDTO>();
    const { register, handleSubmit } = useForm<MessageResponseDTO>();
    const [selectUserForChat, setSelectUserForChat] = useState(false);

    useEffect(() => {
        UserService.getLoggedUser().then((response) => {
            setLoggedUser(response);
        })
    }, []);

    //Crear Mensajes
    const handleCreateMessage = (e: any) => {
        MessageService.createMessage(e.content, currentChat?.id, currentChat?.users.map(user => user.id)!).then((response) => {
            if (!currentChat?.id) {
                if (!currentChat || !currentChat.users) return;
                ChatService.getChatByExactParticipants(currentChat.users.map(user => user.id)).then((chat) => {
                    setCurrentChat(chat);
                })
            }
        })
    }

    return (
        <div>
            <CreateChatComponent loggedUser={loggedUser} setChatOpen={setChatOpen} selectUserForChat={selectUserForChat} setSelectUserForChat={setSelectUserForChat} setCurrentChat={setCurrentChat}></CreateChatComponent>
            {chatMenuOpen ? (
                <div className='border border-b-0 border-gray-400 rounded-t-2xl w-96 h-96'>
                    <div className='h-full flex flex-col justify-between'>
                        <div className='flex flex-col h-full'>
                            <div className='flex flex-row justify-between p-2'>
                                <div className='flex flex-row gap-1'>
                                    {chatOpen ?
                                        <button
                                            type='button'
                                            onClick={() => setChatOpen(false)}
                                            className='flex items-center'
                                        >
                                            <span className="material-symbols-outlined">
                                                arrow_back
                                            </span>
                                        </button>
                                        :
                                        <></>
                                    }
                                    <h1 className='text-lg'>
                                        {chatOpen
                                            ? currentChat?.users[1].username !== loggedUser?.username
                                                ? currentChat?.users[1].editableName || currentChat?.users[1].username
                                                : currentChat?.users[0].editableName || currentChat?.users[0].username
                                            : "Mensajes"
                                        }
                                    </h1>

                                </div>
                                <div className='flex gap-3'>
                                    <button onClick={() =>
                                        setTimeout(() => {
                                            setSelectUserForChat(true)
                                        }, 100)
                                    }>
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-white w-5 h-5">
                                            <g>
                                                <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5V12h-2v-1.537l-8 3.635-8-3.635V18.5c0 .276.224.5.5.5H13v2H4.498c-1.381 0-2.5-1.119-2.5-2.5v-13zm2 2.766l8 3.635 8-3.635V5.5c0-.276-.224-.5-.5-.5h-15c-.276 0-.5.224-.5.5v2.766zM19 18v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
                                            </g>
                                        </svg>
                                    </button>
                                    <button type='button' onClick={() => {
                                        setChatMenuOpen(!chatMenuOpen)

                                    }}>
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-white w-5 h-5">
                                            <g>
                                                <path d="M12 11.59L3.96 3.54 2.54 4.96 12 14.41l9.46-9.45-1.42-1.42L12 11.59zm0 7l-8.04-8.05-1.42 1.42L12 21.41l9.46-9.45-1.42-1.42L12 18.59z"></path>
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className='h-full'>
                                {chatOpen ? (
                                    <div className='h-full flex flex-col justify-between'>
                                        <MessageListComponent chatOpen={chatOpen} currentChat={currentChat} loggedUser={loggedUser} setCurrentChat={setCurrentChat}></MessageListComponent>
                                        <div className='w-full border-t border-gray-400 flex justify-center items-center p-2'>
                                            <div className='flex flex-row justify-center items-center gap-4 bg-customGrayChat w-full rounded-2xl px-3 py-1'>
                                                <div className='flex flex-row gap-1'>
                                                    <svg viewBox="0 0 24 24" aria-hidden="true" className='fill-sky-500 h-5 w-5 justify-center'>
                                                        <g>
                                                            <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                                                        </g>
                                                    </svg>
                                                    <svg viewBox="0 0 24 24" aria-hidden="true" className='fill-sky-500 h-5 w-5 justify-center'>
                                                        <g>
                                                            <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                                                        </g>
                                                    </svg>
                                                </div>
                                                <form className='flex flex-row rounded-2xl px-1 bg-customGrayChat text-white focus:outline-none' onSubmit={handleSubmit(handleCreateMessage)}>
                                                    <div className='w-full items-center flex'>
                                                        <input
                                                            type="text"
                                                            className='w-full rounded-2xl px-1 bg-customGrayChat text-white focus:outline-none'
                                                            placeholder='Escribe un mensaje'
                                                            {...register("content")}
                                                        />
                                                    </div>
                                                    <button type='submit' className='fill-sky-500 w-8 h-8 rounded-full'>
                                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                                            <g>
                                                                <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z"></path>
                                                            </g>
                                                        </svg>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <ChatListComponent chatMenuOpen={chatMenuOpen} loggedUser={loggedUser} setChatOpen={setChatOpen} setCurrentChat={setCurrentChat}></ChatListComponent>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
                :
                (
                    <div className='border border-b-0 border-gray-400 rounded-t-2xl w-96 h-12'>
                        <div className='flex flex-row justify-between p-2'>
                            <h1 className='text-lg'>Mensajes</h1>
                            <div className='flex gap-3'>
                                <button type='button' onClick={() => setChatMenuOpen(!chatMenuOpen)}>
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-white w-5 h-5">
                                        <g>
                                            <path d="M12 2.59l9.46 9.45-1.42 1.42L12 5.41l-8.04 8.05-1.42-1.42L12 2.59zm0 7l9.46 9.45-1.42 1.42L12 12.41l-8.04 8.05-1.42-1.42L12 9.59z"></path>
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ChatMenuComponent;