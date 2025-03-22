import React, { useState, useEffect } from 'react';
import { User, UserResponseDTO } from '@/types/user';
import UserService from '@/services/UserService';
import Modal from './modals/Modal';
import UserFollowComponent from './UserFollowComponent';

const WhoToFollowComponent = () => {
    const [users, setUsers] = useState<UserResponseDTO[] | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loggedUser, setLoggedUser] = useState<UserResponseDTO>();

    useEffect(() => {
        UserService.getLoggedUser().then((response) => {
            setLoggedUser(response);
        })
    }, []);

    useEffect(() => {
        UserService.getAllUsers().then((response) => {
            setUsers(response);
        });
    }, []);

    return (
        <div className="border border-gray-400 rounded-2xl p-2">
            <h2 className="text-2xl">A quién seguir</h2>
            <div className="flex flex-col w-full">
                {
                    users && users.length > 0 ? (
                        <div className="flex justify-center w-full">
                            <div className="flex flex-col w-full">
                                {users.sort(() => Math.random() - 0.5).slice(0, 5).map((user) => (
                                    <div key={user.id}>
                                        {user.username != loggedUser?.username ?
                                            <div>
                                                <UserFollowComponent
                                                    username={user.username}
                                                    editableName={user.editableName}
                                                />
                                            </div> :
                                            <>
                                            </>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center w-full">
                            <Modal open={openModal} setOpen={setOpenModal}>
                                <div className="flex flex-col w-full">
                                    <div>No hay usuarios para mostrar.</div>
                                </div>
                            </Modal>
                        </div>
                    )
                }
            </div>

        </div>
    );
};

export default WhoToFollowComponent;