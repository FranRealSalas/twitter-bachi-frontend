import { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";
import { UserResponseDTO } from "@/types/user";
import { useForm } from "react-hook-form";
import { TweetResponseDTO } from "@/types/tweet";
import UserService from "@/services/UserService";
import { useParams } from "next/navigation";


export function EditProfileModal({ editProfileOpen, setEditProfileOpen, user, setUser }: { editProfileOpen: boolean, setEditProfileOpen: Dispatch<SetStateAction<boolean>>, user: UserResponseDTO, setUser: Dispatch<SetStateAction<UserResponseDTO | undefined>> }) {
    const { register, handleSubmit } = useForm<TweetResponseDTO>();
    const { username } = useParams<{ username: string }>();

    function handleEditProfile(e: any) {
        UserService.editUser(username, e.user.editableName).then(() => {
            UserService.getUserByUsername(username).then((response) => {
                setUser(response);
            })
        })
    }

    return (
        <Modal open={editProfileOpen} setOpen={setEditProfileOpen}>
            <form onSubmit={handleSubmit(handleEditProfile)}>
                <input
                    {...register("user.editableName")}
                    defaultValue={user ? user.editableName : ""}
                    className="text-black"></input>
                <button type="submit">Confirmar</button>
            </form>
        </Modal>
    )
}