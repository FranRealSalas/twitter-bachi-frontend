import TweetService from "@/services/TweetService";
import Modal from "./modals/Modal";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TweetCreation, TweetResponseDTO } from "@/types/tweet";
import Swal from "sweetalert2";
import PostModal from "./modals/PostTweetModal";
import ModalContentImages from "./modals/ModalContentImages";
import { redirect } from 'next/navigation';

function TweetComponentOnOpen({ Tweet, setTweets }: { Tweet: TweetResponseDTO, setTweets?: any }) {
    const { register, handleSubmit, reset } = useForm<TweetCreation>();
    const [optionsTweetOpen, setOptionsTweetOpen] = useState(false);
    const [editTweetModalOpen, setEditTweetModelOpen] = useState(false);
    const [selectedTweet, setSelectedTweet] = useState<TweetResponseDTO>();
    const [inputPostContent, setInputPostContent] = useState("");
    const [openPostButtonNavbar, setOpenPostButtonNavbar] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likeCount, setLikeCount] = useState(Tweet.likeCount);
    const [saveCount, setSaveCount] = useState(Tweet.saveCount);
    const [formattedTimeOnTweetOpen, setFormattedTimeOnTweetOpen] = useState("")

    async function handleEditTweet(e: any) {
        try {
            TweetService.editTweets(Tweet.id, e.content).then(() => {
                TweetService.getTweets().then((response) => {
                    setTweets && setTweets(response);
                    setEditTweetModelOpen(false);
                    setOptionsTweetOpen(false);
                    reset();
                })
            })
        }
        catch (error) {
            console.error("Error al editar el tweet:", error);
        }
    };

    function handleUpdatePostContent(e: any) {
        setInputPostContent(e.target.value);
    }

    useEffect(() => {
        setIsLiked(Tweet.liked);
        setIsSaved(Tweet.saved);
    }, [Tweet])

    useEffect(() => {
        const date = new Date(Tweet.date)
        const formattedTime = date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour12: true,
        });
        setFormattedTimeOnTweetOpen(formattedTime)
    }, []);

    function handleCreateTweet(e: TweetCreation) {
        if (e.content.length !== 0) {
            TweetService.createTweets(e.content, e.images, Tweet.id).then(() => {
                TweetService.getTweets().then((response) => {
                    setOpenPostButtonNavbar(false);
                    setTweets && setTweets(response);
                    reset();
                    location.reload();
                })
            })
        }
        else {
            alert("Vacio");
        }
    }

    return (
        <div className="flex flex-col py-2 px-4 gap-3 min-w-72 max-w-xl">
            {Tweet ? (
                <>
                    <div className="flex flex-row justify-between min-w-fit">
                        <div className="flex flex-row gap-2">
                            <img
                                onClick={() => {
                                    redirect(`/users/${Tweet.user.username}`)
                                }}
                                className="w-8 h-8 rounded-full cursor-pointer"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploads/profile/img/${Tweet.user.profilePhoto}`}
                                onError={(e) => e.currentTarget.src = "https://assets-staging.autoplants.cloud/default.jpg"}
                            />
                            <h2
                                onClick={() => {
                                    redirect(`/users/${Tweet.user.username}`)
                                }}
                                className="cursor-pointer"
                            >
                                <span className="hover:underline">{Tweet.user.editableName}</span>
                            </h2>
                            <h2
                                onClick={() => {
                                    redirect(`/users/${Tweet.user.username}`)
                                }}
                                className="cursor-pointer"
                            >@{Tweet.user.username}</h2>
                        </div>
                        <div>
                            <div className="absolute">
                                <Modal open={optionsTweetOpen} setOpen={setOptionsTweetOpen}>
                                    <div className="flex flex-col">

                                        <PostModal open={editTweetModalOpen} setModalOpen={setEditTweetModelOpen}>
                                            <div className="flex flex-col w-full">
                                                <form onSubmit={handleSubmit(handleEditTweet)} className="w-full h-32 flex flex-col">
                                                    <input className="h-full bg-black outline-none" type="text"
                                                        {...register("content")}
                                                        defaultValue={selectedTweet?.content || ""}
                                                    />
                                                    <button type="submit" onClick={() =>
                                                        Swal.fire({
                                                            title: "Exitoso!",
                                                            text: "El tweet fue editado.",
                                                            icon: "success"
                                                        })}>Confirmar</button>
                                                </form>
                                            </div>
                                        </PostModal>

                                        <button onClick={async () => {
                                            setSelectedTweet(Tweet);
                                            setEditTweetModelOpen(true);
                                        }} className="flex justify-start w-full">Editar</button>

                                        <button onClick={() =>
                                            Swal.fire({
                                                title: "¿Estas seguro?",
                                                text: "No podras revertirlo!",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                cancelButtonText: 'Cancelar',
                                                confirmButtonText: "Sí, eliminar!"
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    await TweetService.deleteTweets(Tweet.id)
                                                    TweetService.getTweets().then((response) => {
                                                        setOptionsTweetOpen(false);
                                                        setTweets(response);
                                                    })
                                                    Swal.fire({
                                                        title: "Eliminado!",
                                                        text: "El tweet fue eliminado.",
                                                        icon: "success"
                                                    });
                                                }
                                            })}
                                            className="flex items-center justify-center w-full text-red-600">Eliminar</button>

                                    </div>
                                </Modal>
                            </div>
                            <span className="material-symbols-outlined cursor-pointer" onClick={() => setOptionsTweetOpen(true)}>more_horiz</span>
                        </div>
                    </div>

                    <a className="w-full" href={`/tweets/${Tweet.id}`}>
                        <span className="w-full break-all">
                            {Tweet.content}
                        </span>
                        <div className="flex flex-wrap">
                            {Tweet.images ? (
                                Tweet.images.slice(0, 4).map((image, index) => {
                                    const [openModalImage, setOpenModalImage] = useState(false);
                                    return (
                                        <div key={image.id}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setOpenModalImage(true);
                                            }}
                                            className="w-1/2 aspect-square overflow-hidden">
                                            {index === 3 ? (
                                                <div className="h-full w-full p-1 rounded-2xl flex justify-center relative cursor-pointer">
                                                    <img
                                                        className="blur object-cover"
                                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets/uploads/tweetImages/${image.imageName}`}
                                                    />
                                                    <p className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg">Ver mas</p>
                                                </div>
                                            ) : (
                                                <img
                                                    className="p-1 object-cover h-full w-full rounded-2xl cursor-pointer"
                                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets/uploads/tweetImages/${image.imageName}`}
                                                />

                                            )}
                                            <ModalContentImages openModalImage={openModalImage} setOpenModalImage={setOpenModalImage} images={Tweet.images} index={index}></ModalContentImages>
                                        </div>
                                    )
                                })
                            )
                                : (
                                    <></>
                                )
                            }
                        </div>
                    </a>

                    <PostModal open={openPostButtonNavbar} setModalOpen={setOpenPostButtonNavbar}>
                        <form className="flex w-full h-40 border border-gray-400 p-5" onSubmit={handleSubmit(handleCreateTweet)}>
                            <div className="flex w-full flex-row justify-between items-center gap-2">
                                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploads/profile/img/${Tweet.user.profilePhoto}`} onError={(e) => e.currentTarget.src = "https://assets-staging.autoplants.cloud/default.jpg"} className="w-12 h-12 rounded-full" />
                                <input type="text"
                                    className="h-full w-full p-2 bg-black outline-none"
                                    placeholder="Que esta pasando?!"
                                    {...register("content")}
                                    onChange={handleUpdatePostContent} />
                                <div className="flex items-end h-full">
                                    <button type="submit" className={`rounded-xl w-[75px] h-[30px] ${inputPostContent.length === 0 ? 'bg-gray-500' : 'bg-sky-500'}`} disabled={inputPostContent.length === 0}>
                                        Postear
                                    </button>
                                </div>
                            </div>
                        </form>
                    </PostModal>

                    <div className="flex flex-row gap-3 text-gray-400">
                        <span>{`${formattedTimeOnTweetOpen}`}</span>
                    </div>

                    <div className="flex flex-row justify-center sm:gap-14 gap-12">
                        <div className="flex flex-row items-center">
                            <button onClick={(e) => {
                                setOpenPostButtonNavbar(!openPostButtonNavbar)
                            }}
                                className="flex hover:bg-sky-500 rounded-full w-fit h-fit p-1">
                                <div>
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                                        <g>
                                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                                        </g>
                                    </svg>
                                </div>
                            </button>
                            <span className="text-white text-sm">{Tweet.countComments >= 0 ? Tweet.countComments : " 0 "}</span>
                        </div>
                        <button onClick={(e) => {
                            e.preventDefault();
                            console.log("Retweet");
                        }}
                            className="flex hover:bg-green-600 rounded-full w-fit h-fit p-1">
                            <div>
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                                    <g>
                                        <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                                    </g>
                                </svg>
                            </div>
                        </button>
                        <div className="flex flex-row items-center">
                            <button onClick={() => {
                                if (isLiked) {
                                    TweetService.removeLike(Tweet.id)
                                        .then(() => {
                                            setIsLiked(!isLiked);
                                            setLikeCount(likeCount - 1);
                                        })
                                        .catch(() => console.error("Error"))
                                }
                                else {
                                    TweetService.giveLike(Tweet.id)
                                        .then(() => {
                                            setIsLiked(!isLiked);
                                            setLikeCount(likeCount + 1);
                                        })
                                        .catch(() => console.error("Error"))
                                }
                            }}
                                className="flex hover:bg-red-500 rounded-full w-fit h-fit p-1">
                                <div>
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className={`w-5 h-5 ${isLiked ? "fill-red-600" : "fill-white"}`} >
                                        <g>
                                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                                        </g>
                                    </svg>
                                </div>
                            </button>
                            <span className="text-white text-sm">{likeCount >= 0 ? likeCount : " 0 "}</span>
                        </div>
                        <div className="flex flex-row items-center">
                            <button onClick={(e) => {
                                if (isSaved) {
                                    TweetService.removeSave(Tweet.id)
                                        .then(() => {
                                            setIsSaved(!isSaved);
                                            setSaveCount(saveCount - 1);
                                        })
                                        .catch(() => console.error("Error"))
                                }
                                else {
                                    TweetService.giveSave(Tweet.id)
                                        .then(() => {
                                            setIsSaved(!isSaved);
                                            setSaveCount(saveCount + 1);
                                        })
                                        .catch(() => console.error("Error"))
                                }
                            }}
                                className="flex hover:bg-sky-500 rounded-full w-fit h-fit p-1">
                                <div>
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className={`w-5 h-5 ${isSaved ? "fill-sky-600" : "fill-white"}`}>
                                        <g>
                                            <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
                                        </g>
                                    </svg>
                                </div>
                            </button>
                            <span className="text-white text-sm">{saveCount >= 0 ? saveCount : " 0 "}</span>
                        </div>
                    </div>
                </>
            ) : (
                <>Cargando...</>
            )}
        </div>
    )
}

export default TweetComponentOnOpen;