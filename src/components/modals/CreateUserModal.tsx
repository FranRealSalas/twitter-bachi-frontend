import UserService from "@/services/UserService";
import { User } from "@/types/user";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import { Dispatch, SetStateAction } from "react";
import Swal from 'sweetalert2'

export function CreateUserModal({ createUserOpen, setCreateUserOpen }: { createUserOpen: boolean, setCreateUserOpen: Dispatch<SetStateAction<boolean>> }) {
    const { register, formState: { errors }, handleSubmit, reset } = useForm<User>();

    async function handleCreateSubmit(e: any,) {
        UserService.createUser( e.username, e.password, e.email)
            .then(() => {
                setCreateUserOpen(false);
                reset();
            })
            .catch((error) => {
                console.log(error.response.data);
            })
    }

    return (
        <Modal open={createUserOpen} setOpen={setCreateUserOpen}>
            <div className="flex flex-col gap-3 items-center w-96">
                <h1 className="text-2xl">Crear Usuario</h1>
                <form className="flex flex-col gap-2 w-full text-black" onSubmit={handleSubmit(handleCreateSubmit)}>
                    <input className="border h-10 px-2 rounded-xl" type="text" placeholder="Nombre de usuario" id="createUsername"
                        {...register("username", {
                            required: {
                                value: true,
                                message: "El nombre de usuario es requerido"
                            }
                        })}
                    />
                    {
                        errors.username && <span className="text-red-600">{errors.username.message}</span>
                    }

                    <input className="border h-10 px-2 rounded-xl" type="password" placeholder="Contraseña"
                        {...register("password", {
                            required: {
                                value: true,
                                message: "La contraseña es requerida"
                            }
                        })}
                    />
                    {
                        errors.password && <span className="text-red-600">{errors.password.message}</span>
                    }
                    <input className="border h-10 px-2 rounded-xl" type="text" placeholder="Ejemplo@gmail.com"
                        {...register("email", {
                            required: {
                                value: true,
                                message: "El email es requerido"
                            }
                        })}
                    />
                    {
                        errors.email && <span className="text-red-600">{errors.email.message}</span>
                    }
                    <button className="border h-10 rounded-xl w-full p-2 text-sky-500 hover:bg-gray-900" type="submit"
                        onClick={() => (Swal.fire({
                            title: "Exitoso!",
                            text: "El usuario fue creado.",
                            icon: "success"
                        }))}
                    >Crear</button>
                </form>
            </div>
        </Modal>
    )
}