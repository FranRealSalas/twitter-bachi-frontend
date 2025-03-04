"use client"

import Modal from "@/components/modals/Modal";
import TweetComponent from "@/components/TweetComponent";
import TweetService from "@/services/TweetService";
import UserService from "@/services/UserService";
import { TweetResponseDTO } from "@/types/tweet";
import { UserResponseDTO } from "@/types/user";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { redirect } from 'next/navigation';

const ProfilePage = () => {
    const [tweets, setTweets] = useState<TweetResponseDTO[]>();
    const [uploadProfileImageOpen, setUploadProfileImageOpen] = useState(false);
    const [uploadCoverImageOpen, setUploadCoverImageOpen] = useState(false);
    const { username } = useParams<{ username: string }>();
    const { register, handleSubmit } = useForm<UserResponseDTO>();
    const [isFollowed, setIsFollowed] = useState(false);
    const [loggedUser, setLoggedUser] = useState<UserResponseDTO>();
    const [currentUser, setCurrentUser] = useState<UserResponseDTO>();
    const [selectedButton, setSelectedButton] = useState('Posts');

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

    useEffect(() => {
        TweetService.getTweetsByUsername(username).then((response) => {
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

    const handleButtonClick = (buttonName: string) => {
        setSelectedButton(buttonName);
        if (buttonName === 'Posts') {
            TweetService.getTweetsByUsername(username).then((response) => {
                setTweets(response);
            })
        }
        if (buttonName === 'Me gusta') {
            TweetService.getLikedTweets(username).then((response) => {
                setTweets(response);
            })
        }
        if (buttonName === 'Respuestas') {
            TweetService.getCommentsByUsername(username).then((response) => {
                setTweets(response);
            })
        }
        if (buttonName === 'Multimedia') {
            TweetService.getTweetsWithImagesByUsername(username).then((response) => {
                setTweets(response);
            })
        }
    };


    return (
        <>
            <div className="flex flex-col w-full">
                <div className="w-full flex items-center sticky top-0 z-50 border border-gray-400 backdrop-blur-sm">
                    <div className="flex flex-row h-14 p-1 gap-2 w-full">
                        <button className="flex h-full items-center" onClick={() => history.back()}>
                            <span className="material-symbols-outlined">
                                arrow_back
                            </span>
                        </button>
                        <div className="flex flex-col w-full items-start">
                            <h2 className="text-lg">{currentUser?.username} </h2>
                            <h3 className="text-sm text-gray-500">{tweets ? tweets.length + " posts" : "0 posts"} </h3>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col border border-gray-400">
                        <div className="relative">
                            <img
                                onClick={() => {
                                    setTimeout(() => {
                                        setUploadCoverImageOpen(!uploadCoverImageOpen)
                                    }, 100)
                                }}
                                className="w-full h-48 z-0 border-b"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploads/cover/img/${currentUser?.coverPhoto}`}
                                onError={(e) => e.currentTarget.src = "https://i.pinimg.com/736x/d8/61/19/d86119efae3acd37391c4c1a9f130529.jpg"}
                            />
                            <img
                                onClick={() => {
                                    setTimeout(() => {
                                        setUploadProfileImageOpen(!uploadProfileImageOpen)
                                    }, 100)
                                }}
                                className="h-28 w-28 rounded-full border-2 border-gray-400 absolute z-100 top-28 left-5"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploads/profile/img/${currentUser?.profilePhoto}`}
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
                        <div className="w-full h-48 p-5">
                            <div className="flex justify-end h-2/5">
                                <button
                                    className={`h-fit w-24 border rounded-xl ${currentUser?.username == loggedUser?.username ? "bg-gray-700" : `${isFollowed ? "bg-gray-700" : "bg-sky-500"}`}`}
                                    onClick={() => {
                                        if (currentUser?.username != loggedUser?.username) {
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
                                        }
                                        else {
                                            redirect(`/configuration/${loggedUser?.username}`)
                                        }
                                    }}
                                >{currentUser?.username == loggedUser?.username ? "Editar perfil" : `${isFollowed ? "Siguiendo" : "Seguir"}`}</button>
                            </div>
                            <div className="flex flex-col h-3/5 justify-between">
                                <div className="flex flex-row gap-8 items-center">
                                    <div>
                                        <h2 className="text-2xl">{currentUser?.editableName}</h2>
                                        <h3 className="text-sm">@{currentUser?.username}</h3>
                                    </div>
                                    <div className="flex flex-row gap-2 items-center h-fit border rounded-full p-1">
                                        <svg viewBox="0 0 22 22" aria-hidden="true" className="h-4 w-4 fill-sky-500">
                                            <g>
                                                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                            </g>
                                        </svg>
                                        <span className="text-sm">Consigue la verificacion</span>
                                    </div>
                                </div>
                                <div className="flex items-end gap-4">
                                    <span
                                        className="cursor-pointer"
                                        onClick={() => {
                                            redirect(`/followings/${loggedUser?.username}`)
                                        }}
                                    >{currentUser?.followerCount} Siguiendo</span>
                                    <span
                                        className="cursor-pointer"
                                        onClick={() => {
                                            redirect(`/followers/${loggedUser?.username}`)
                                        }}
                                    >{currentUser?.followedCount} Seguidores</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row w-full border justify-evenly p-2">
                    <button
                        className={selectedButton === 'Posts' ? 'border-b-2 border-sky-500' : ''}
                        onClick={() => handleButtonClick('Posts')}
                    >
                        Posts
                    </button>
                    <button
                        className={selectedButton === 'Respuestas' ? 'border-b-2 border-sky-500' : ''}
                        onClick={() => handleButtonClick('Respuestas')}
                    >
                        Respuestas
                    </button>
                    <button
                        className={selectedButton === 'Multimedia' ? 'border-b-2 border-sky-500' : ''}
                        onClick={() => handleButtonClick('Multimedia')}
                    >
                        Multimedia
                    </button>
                    <button
                        className={selectedButton === 'Me gusta' ? 'border-b-2 border-sky-500' : ''}
                        onClick={() => handleButtonClick('Me gusta')}
                    >
                        Me gusta
                    </button>
                </div>
                <div className="h-full">
                    <div>
                        {tweets ? (
                            <div className="flex flex-col">
                                {tweets.map(Tweet => (
                                    <div key={Tweet.id} className="w-full border border-gray-400">
                                        <TweetComponent Tweet={Tweet} setTweets={setTweets}></TweetComponent>
                                    </div>
                                ))
                                }
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