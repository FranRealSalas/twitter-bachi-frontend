"use client"
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { CreateUserModal } from '@/components/modals/CreateUserModal';

const LoginPage = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [createUserOpen, setCreateUserOpen] = useState(false);

    const handleLogin = (e: any) => {
        e.preventDefault()

        login(username, password)
            .then(response => {
                if (typeof window !== 'undefined') {
                    location.href = "/";
                }
            })
            .catch(() => {
                console.log("datos invalidos");
            })
    };


    return (
        <div className="flex flex-col gap-4 h-screen w-full items-center justify-center bg-black text-black">
            <div className="w-full max-w-md px-4">
                <h1 className="text-center text-4xl mb-6 text-white">Inicia sesión en X</h1>
                <div>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <input
                                type="text"
                                id="username"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-400 rounded"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                id="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-400 rounded"
                            />
                        </div>

                        <button type="submit" className="w-full p-2 text-sky-500 rounded border hover:bg-gray-900">
                            Iniciar Sesión
                        </button>
                    </form>
                    <div className='flex flex-row m-2 justify-center items-center'>
                        <div className='border w-full h-0 m-1'></div>
                        <span className='text-white'>O</span>
                        <div className='border w-full h-0 m-1'></div>
                    </div>
                    <div className='flex justify-center items-center z-50'>
                        <div className='text-white absolute'>
                            <CreateUserModal createUserOpen={createUserOpen} setCreateUserOpen={setCreateUserOpen} />
                        </div>
                    </div>
                    <button onClick={() => { setCreateUserOpen(!createUserOpen) }} className='bg-sky-500 rounded w-full p-2 text-white'>Crear cuenta</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;