"use client"

import Modal from "@/components/modals/Modal";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import TweetComponent from "@/components/TweetComponent";
import useAuth from "@/hooks/useAuth";
import TweetService from "@/services/TweetService";
import UserService from "@/services/UserService";
import { LoggedUser } from "@/types/loggedUser";
import { TweetResponseDTO } from "@/types/tweet";
import { User } from "@/types/user";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ProfilePage = () => {
    const [tweets, setTweets] = useState<TweetResponseDTO[]>();
    const [uploadProfileImageOpen, setUploadProfileImageOpen] = useState(false);
    const [openPostButtonNavbar, setOpenPostButtonNavbar] = useState(false);
    const { username } = useParams<{ username: string }>();

    const { register, handleSubmit } = useForm<User>();

    useEffect(() => {
        TweetService.getTweets().then((response) => {
            setTweets(response);
        })
    }, []);

    async function handleUploadProfileImage(e: any) {
        UserService.uploadProfileImage(e.profilePhoto[0])
            .then((user) => {
                location.reload();
            })
            .catch((error) => {
                console.error("Error al subir la imagen", error);
            })
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="w-full flex items-center sticky top-0 z-50 border border-gray-400 backdrop-blur-sm">
                    <div className="flex flex-row h-full p-1 gap-2">
                        <button className="flex h-full items-center" onClick={() => history.back()}>
                            <span className="material-symbols-outlined">
                                arrow_back
                            </span>
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-2xl">{username} </h2>
                            <h3 className="text-sm text-gray-500">{tweets ? tweets.length + " posts" : "0 posts"} </h3>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col border border-gray-400">
                        <div className="relative">
                            <img className="w-full h-44 z-0" src="https://images.unsplash.com/opengraph/1x1.png?mark=https%3A%2F%2Fimages.unsplash.com%2Fopengraph%2Flogo.png&mark-w=64&mark-align=top%2Cleft&mark-pad=50&h=630&w=1200&blend=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1660491630578-4299a3c09db0%3Fcrop%3Dfaces%252Cedges%26h%3D630%26w%3D1200%26blend%3D000000%26blend-mode%3Dnormal%26blend-alpha%3D10%26mark-w%3D750%26mark-align%3Dmiddle%252Ccenter%26mark%3Dhttps%253A%252F%252Fimages.unsplash.com%252Fopengraph%252Fsearch-input.png%253Fw%253D750%2526h%253D84%2526txt%253DImagen%252Bde%252Bportada%2526txt-pad%253D80%2526txt-align%253Dmiddle%25252Cleft%2526txt-color%253D%252523000000%2526txt-size%253D40%2526txt-width%253D660%2526txt-clip%253Dellipsis%2526auto%253Dformat%2526fit%253Dcrop%2526q%253D60%26auto%3Dformat%26fit%3Dcrop%26q%3D60%26ixid%3DM3wxMjA3fDB8MXxzZWFyY2h8Nnx8aW1hZ2VuJTIwZGUlMjBwb3J0YWRhfGVzfDB8fHx8MTczMDgyNzA3MXww%26ixlib%3Drb-4.0.3&blend-w=1&auto=format&fit=crop&q=60"></img>
                            <img
                                onClick={() => { setUploadProfileImageOpen(!uploadProfileImageOpen) }}
                                className="h-28 w-28 rounded-full border-2 border-gray-400 absolute z-100 top-28 left-5"
                                src={`http://localhost:8080/api/users/uploads/img/${username}`}
                                onError={(e) => e.currentTarget.src = "https://assets-staging.autoplants.cloud/default.jpg"}
                            />
                            <Modal open={uploadProfileImageOpen} setOpen={setUploadProfileImageOpen}>
                                <form onSubmit={handleSubmit(handleUploadProfileImage)} className="flex flex-col z-50 gap-4">
                                    <input {...register("profilePhoto")} type="file" />
                                    <button type="submit" className="border">Cargar</button>
                                </form>
                            </Modal>
                        </div>
                        <div className="h-44">
                        </div>
                    </div>
                </div>
                <div className="h-full">
                    <div>
                        {tweets ? (
                            <div className="flex flex-col-reverse">
                                {tweets.map(Tweet => (
                                    <div key={Tweet.id} className="w-full border border-gray-400">
                                        <TweetComponent Tweet={Tweet} setTweets={setTweets}></TweetComponent>
                                    </div>
                                )
                                )}
                            </div>
                        )
                            :
                            (
                                <>No hay tweets.</>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )

}

export default ProfilePage;