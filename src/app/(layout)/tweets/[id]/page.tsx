'use client'
import TweetComponent from "@/components/TweetComponent";
import TweetComponentOnOpen from "@/components/TweetComponentOnOpen";
import TweetService from "@/services/TweetService";
import { TweetResponseDTO } from "@/types/tweet";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TweetPage = () => {
    const { id } = useParams<{ id: string }>();
    const [comments, setComments] = useState<TweetResponseDTO[]>()
    const [tweet, setTweet] = useState<TweetResponseDTO>()

    useEffect(() => {
        TweetService.getComments(Number(id)).then((response) => {
            setComments(response);
        });
        TweetService.getTweetById(Number(id)).then((response) => {
            setTweet(response);
        });
    }, []);

    return (
        <>
            {tweet ?
                (
                    <>
                        <div className="flex flex-col border border-gray-400 w-full" >
                            <div className="w-full flex items-center sticky top-0 z-50 backdrop-blur-sm">
                                <div className="flex flex-row h-full p-1 gap-2">
                                    <button className="flex h-full items-center" onClick={() => history.back()}>
                                        <span className="material-symbols-outlined">
                                            arrow_back
                                        </span>
                                    </button>
                                    <div className="flex flex-col">
                                        <h2 className="text-2xl">Post</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <TweetComponentOnOpen Tweet={tweet}></TweetComponentOnOpen>
                            </div>
                        </div >
                        <div className="w-full flex flex-col">
                            <div>
                                {comments ? (
                                    <div className="flex flex-col">

                                        {comments.length > 0 ?
                                            comments.map(comment => (
                                                <div key={comment.id} className="w-full border border-gray-400">
                                                    <TweetComponent Tweet={comment} setTweets={setComments}></TweetComponent>
                                                </div>
                                            )
                                            ) : (
                                                <p>No hay comentarios.</p>
                                            )}
                                    </div>
                                )
                                    :
                                    (
                                        <>Cargando...</>
                                    )
                                }
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Cargando...</p>
                )}

        </>
    )

}

export default TweetPage;