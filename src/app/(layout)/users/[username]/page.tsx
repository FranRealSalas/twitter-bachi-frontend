"use client"

import Modal from "@/components/modals/Modal";
import TweetComponent from "@/components/TweetComponent";
import useAuth from "@/hooks/useAuth";
import TweetService from "@/services/TweetService";
import UserService from "@/services/UserService";
import { TweetResponseDTO } from "@/types/tweet";
import { User } from "@/types/user";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ProfilePage = () => {
    const [tweets, setTweets] = useState<TweetResponseDTO[]>();
    const [uploadProfileImageOpen, setUploadProfileImageOpen] = useState(false);
    const [uploadCoverImageOpen, setUploadCoverImageOpen] = useState(false);
    const { username } = useParams<{ username: string }>();
    const [isFollowed, setIsFollowed] = useState(false);

    const { register, handleSubmit } = useForm<User>();

    useEffect(() => {
        UserService.getUserByUsername(username)
        .then((response) => {
            setIsFollowed(response.follow);
        })
    }, []);

    useEffect(() => {
        TweetService.getTweets().then((response) => {
            setTweets(response);
        })
    }, []);

    async function handleUploadProfileImage(e: any) {
        UserService.uploadProfileImage(e.profilePhoto[0])
            .then(() => {
                location.reload();
            })
            .catch((error) => {
                console.error("Error al subir la imagen", error);
            })
    }

    async function handleUploadCoverImage(e: any) {
        UserService.uploadCoverImage(e.coverPhoto[0])
            .then(() => {
                location.reload();
            })
            .catch((error) => {
                console.error("Error al subir la imagen", error);
            })
    }

    return (
        <>
            <div className="flex flex-col w-full">
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
                            <img
                                onClick={() => { setUploadCoverImageOpen(!uploadCoverImageOpen) }}
                                className="w-full h-44 z-0 border-b"
                                src={`http://localhost:8080/api/users/uploads/cover/img/${username}`}
                                onError={(e) => e.currentTarget.src = "https://assets-staging.autoplants.cloud/default.jpg"}
                            />
                            <img
                                onClick={() => { setUploadProfileImageOpen(!uploadProfileImageOpen) }}
                                className="h-28 w-28 rounded-full border-2 border-gray-400 absolute z-100 top-28 left-5"
                                src={`http://localhost:8080/api/users/uploads/profile/img/${username}`}
                                onError={(e) => e.currentTarget.src = "https://assets-staging.autoplants.cloud/default.jpg"}
                            />
                            <Modal open={uploadProfileImageOpen} setOpen={setUploadProfileImageOpen}>
                                <form onSubmit={handleSubmit(handleUploadProfileImage)} className="flex flex-col z-50 gap-4">
                                    <input {...register("profilePhoto")} type="file" />
                                    <button type="submit" className="border">Cargar</button>
                                </form>
                            </Modal>
                            <Modal open={uploadCoverImageOpen} setOpen={setUploadCoverImageOpen}>
                                <form onSubmit={handleSubmit(handleUploadCoverImage)} className="flex flex-col z-50 gap-4">
                                    <input {...register("coverPhoto")} type="file" />
                                    <button type="submit" className="border">Cargar</button>
                                </form>
                            </Modal>
                        </div>
                        <div className="flex w-full h-44 justify-end">
                            <button
                                className={`h-fit w-24 m-2 p-1 border rounded-xl ${isFollowed? "bg-gray-700" : "bg-sky-500"}`}
                                onClick={() => {
                                    if (isFollowed) {
                                        UserService.removeFollow(username)
                                            .then(() => {
                                                setIsFollowed(!isFollowed);
                                                console.log("Follow removed");
                                            })
                                            .catch(() => console.error("Error"))
                                    }
                                    else {
                                        UserService.giveFollow(username)
                                            .then(() => {
                                                setIsFollowed(!isFollowed);
                                                console.log("Follow successfully");
                                            })
                                            .catch(() => console.error("Error"))
                                    }
                                }}
                            >{isFollowed? "Siguiendo" : "Seguir"}</button>
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