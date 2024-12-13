import React, { useState, useEffect } from 'react';
import UserSearchComponent from './UserSearchComponent';
import { User } from '@/types/user';
import UserService from '@/services/UserService';
import Modal from './modals/Modal';

const SearchBar = () => {
    const [users, setUsers] = useState<User[] | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openSearchBar, setOpenSearchBar] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        UserService.getAllUsers().then((response) => {
            setUsers(response);
            setFilteredUsers(response);
        });
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (users) {
            const filtered = users.filter((user) =>
                user.username.toLowerCase().startsWith(query.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    return (
        <div className="flex justify-center w-full py-1">
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
                        onClick={() => {
                            setOpenModal(true);
                            setOpenSearchBar(true);
                        }}
                    />
                </div>
                <div className="w-full">
                    {openSearchBar ? (
                        filteredUsers && filteredUsers.length > 0 ? (
                            <div className="flex justify-center">
                                <Modal open={openModal} setOpen={setOpenModal}>
                                    <div className="flex flex-col">
                                        {filteredUsers.map((user) => (
                                            <div key={user.id}>
                                                <a href="/">
                                                    <UserSearchComponent
                                                        username={user.username}
                                                        editableName={user.editableName}
                                                    />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </Modal>
                            </div>
                        ) : (
                            <div>No hay usuarios para mostrar.</div>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;