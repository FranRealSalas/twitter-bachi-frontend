import { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";
import { UserResponseDTO } from "@/types/user";
import { useForm } from "react-hook-form";
import { TweetResponseDTO } from "@/types/tweet";
import UserService from "@/services/UserService";
import { useParams } from "next/navigation";


export function EditProfileModal({ editProfileOpen, setEditProfileOpen, user, setUser }: { editProfileOpen: boolean, setEditProfileOpen: Dispatch<SetStateAction<boolean>>, user: UserResponseDTO | undefined, setUser: Dispatch<SetStateAction<UserResponseDTO | undefined>> }) {
    const { register, handleSubmit } = useForm<TweetResponseDTO>();
    const { username } = useParams<{ username: string }>();

    function handleEditProfile(e: any) {
        UserService.editUser(username, e.user.editableName).then(() => {
            UserService.getUserByUsername(username).then((response) => {
                setUser(response);
                setEditProfileOpen(false);
                location.reload();
            })
        })
    }

    return (
        <Modal open={editProfileOpen} setOpen={setEditProfileOpen}>
            <form onSubmit={handleSubmit(handleEditProfile)} className="w-full">
                <div className="flex flex-row w-full justify-between">
                    <input
                        {...register("user.editableName")}
                        defaultValue={user ? user.editableName : ""}
                        className="text-black"></input>
                    <button
                        type="submit"
                        className="bg-sky-500 p-1 rounded-full"
                    >Confirmar</button>
                </div>
            </form>
        </Modal>
    )
}