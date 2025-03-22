'use client'
import TweetComponent from "@/components/TweetComponent";
import TweetComponentOnOpen from "@/components/TweetComponentOnOpen";
import TweetService from "@/services/TweetService";
import { TweetResponseDTO } from "@/types/tweet";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TweetPage = () => {
    const parentId = Number(useParams<{ parentId: string }>().parentId);
    const [comments, setComments] = useState<TweetResponseDTO[]>([])
    const [tweet, setTweet] = useState<TweetResponseDTO>()
    const [lastId, setLastId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const scrollHandlerActive = useRef(false);

    useEffect(() => {
        TweetService.getTweetById(parentId).then((response) => {
            setTweet(response);
        });
    }, []);

    // Cargar comentarios iniciales
    useEffect(() => {
        const fetchInitialComments = async () => {
            try {
                setIsLoading(true);
                const response = await TweetService.getComments(parentId, lastId);
                if (response && response.length > 0) {
                    setComments(response);
                    setLastId(response[response.length - 1].id);
                }
            } catch (error) {
                console.error("Error loading initial tweets:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialComments();
    }, []);

    // Configura el detector de scroll
  useEffect(() => {
    // Función que detecta si hemos llegado al final del scroll
    const handleScroll = () => {
      // Guardar las medidas actuales de la página
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Calcular cuántos pixels faltan para llegar al final
      const distanceToBottom = documentHeight - (scrollTop + windowHeight);

      // Verificar si estamos a menos de 50px del final
      const isNearBottom = distanceToBottom < 50;

      // Solo cargar más tweets si estamos cerca del final y no estamos ya cargando
      if (isNearBottom && !isLoading && lastId && !scrollHandlerActive.current) {
        console.log("Cerca del final, cargando más tweets...");
        scrollHandlerActive.current = true; // Evitar múltiples disparos

        setIsLoading(true);
        TweetService.getComments(Number(parentId), lastId)
          .then((response) => {
            if (response && response.length > 0) {
              setComments(prev => [...prev, ...response]);
              setLastId(response[response.length - 1].id);
            }
          })
          .catch(err => console.error("Error loading more tweets:", err))
          .finally(() => {
            setIsLoading(false);

            // Reactivar el handler después de un breve retraso
            setTimeout(() => {
              scrollHandlerActive.current = false;
            }, 50);
          });
      }
    };

    // Solo agregar el event listener si tenemos un parentId y tenemos un lastId
    if (parentId) {
      window.addEventListener('scroll', handleScroll);
    }

    // Limpiar event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, lastId, parentId]); // Dependencias importantes


    return (
        <>
            {tweet ?
                (
                    <div className="border border-gray-400">
                        <div className="flex flex-col border-b border-gray-400 w-full" >
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
                                                <div key={comment.id} className="w-full border-b border-gray-400">
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
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}

        </>
    )

}

export default TweetPage;