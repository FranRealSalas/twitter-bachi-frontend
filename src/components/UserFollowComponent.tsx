import useAuth from "@/hooks/useAuth";
import UserService from "@/services/UserService";
import { UserResponseDTO } from "@/types/user";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface UserFollowComponentProps {
    username: string;
    editableName: string;
}

function UserFollowComponent({ username, editableName }: UserFollowComponentProps) {
    const [currentUser, setCurrentUser] = useState<UserResponseDTO>();
    const [loggedUser, setLoggedUser] = useState<UserResponseDTO>();
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        UserService.getLoggedUser().then((response) => {
            setLoggedUser(response);
        })
    }, []);

    useEffect(() => {
        UserService.getUserByUsername(username)
            .then((response) => {
                setCurrentUser(response);
                setIsFollowed(response.follow);
            })
    }, []);

    return (
        <div className="flex flex-row justify-between items-center p-2 hover:bg-gray-400 rounded-3xl">
            <div className="flex flex-row gap-3 items-center w-2/3 overflow-hidden">
                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploads/profile/img/${username}`} onError={(e) => e.currentTarget.src = "https://assets-staging.autoplants.cloud/default.jpg"} className="w-10 h-10 rounded-full" />
                <a href={`/users/${username}`}>
                    <div className="flex flex-col">
                        <p>{editableName}</p>
                        <p>@{username}</p>
                    </div>
                </a>
            </div>
            <div className="flex justify-end h-2/5 w-1/3">
                <button
                    className={`h-fit w-24 border border-gray-400 rounded-xl ${`${isFollowed ? "bg-gray-700" : "bg-sky-500"}`}`}
                    onClick={() => {

                        if (currentUser?.username != loggedUser?.username) {
                            if (isFollowed) {
                                UserService.removeFollow(username)
                                    .then(() => {
                                        setIsFollowed(false);
                                    })
                                    .catch(() => console.error("Error"))
                            }
                            else {
                                UserService.giveFollow(username)
                                    .then(() => {
                                        setIsFollowed(true);
                                    })
                                    .catch(() => console.error("Error"))
                            }
                        }
                        else {
                            redirect(`/configuration/${loggedUser?.username}`)
                        }
                    }}
                >{`${isFollowed ? "Siguiendo" : "Seguir"}`}</button>
            </div>
        </div>
    )
}

export default UserFollowComponent;