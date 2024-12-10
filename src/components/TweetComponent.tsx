import TweetService from "@/services/TweetService";
import Modal from "./modals/Modal";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EditModal from "./modals/EditTweetModal";
import { Tweet } from "@/types/tweet";
import { LoggedUser } from "@/types/loggedUser";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";

function TweetComponent({ Tweet, setTweets }: { Tweet: Tweet, setTweets: any }) {
    const { register, handleSubmit, reset } = useForm<Tweet>();
    const [optionsTweetOpen, setOptionsTweetOpen] = useState(false);
    const [editTweetModalOpen, setEditTweetModelOpen] = useState(false);
    const [selectedTweet, setSelectedTweet] = useState<Tweet>();
    const [loggedUser, setLoggedUser] = useState<LoggedUser | null>();
    const { getUser } = useAuth();

    useEffect(() => {
        const user = getUser();
        setLoggedUser(user);
    }, []);

    async function handleEditTweet(e: any) {
        try {
            TweetService.editTweets(Tweet.id, e.content).then(() => {
                TweetService.getTweets().then((response) => {
                    setTweets(response);
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

    return (
        <div className="flex flex-col border border-gray-400 py-2 px-4">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    <img className="w-8 h-8 rounded-full" src={`http://localhost:8080/api/users/uploads/img/${Tweet.user.username}`} onError={(e)=> e.currentTarget.src="https://assets-staging.autoplants.cloud/default.jpg" } />
                    <h2>{Tweet.user.editableName} </h2>
                    <h2>@{Tweet.user.username}</h2>
                </div>
                <div>
                    <div className="absolute">
                        <Modal open={optionsTweetOpen} setOpen={setOptionsTweetOpen}>
                            <div className="flex flex-col">

                                <EditModal open={editTweetModalOpen} setModalOpen={setEditTweetModelOpen}>
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
                                </EditModal>

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
                    <span className="material-symbols-outlined" onClick={() => setOptionsTweetOpen(true)}>more_horiz</span>
                </div>
            </div>
            <span className="w-full break-all mb-3">{Tweet.content}</span>
            <div className="flex w-full justify-center gap-40">
                <button onClick={() => console.log("Comment")} className="flex hover:bg-sky-500 rounded-full w-fit h-fit p-1">
                    <span className="material-symbols-outlined">
                        mode_comment
                    </span>
                </button>
                <button onClick={() => console.log("Retweet")} className="flex hover:bg-green-600 rounded-full w-fit h-fit p-1">
                    <span className="material-symbols-outlined">
                        repeat
                    </span>
                </button>
                <button onClick={() => console.log("Like")} className="flex hover:bg-red-700 rounded-full w-fit h-fit p-1">
                    <span className="material-symbols-outlined">
                        favorite
                    </span>
                </button>
            </div>
        </div>
    )
}

export default TweetComponent;