"use client"
import TweetComponent from "@/components/TweetComponent";
import TweetService from "@/services/TweetService";
import { TweetResponseDTO } from "@/types/tweet";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const savesPage = () => {
  const { username } = useParams<{ username: string }>();
  const [savedTweets, setSavedTweets] = useState<TweetResponseDTO[]>([])
  const [lastId, setLastId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollHandlerActive = useRef(false);

  // Cargar tweets iniciales
  useEffect(() => {
    const fetchInitialTweets = async () => {
      try {
        setIsLoading(true);
        const response = await TweetService.getSavedTweets(username, null);
        if (response && response.length > 0) {
          setSavedTweets(response);
          setLastId(response[response.length - 1].id);
        }
      } catch (error) {
        console.error("Error loading initial tweets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialTweets();
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
        TweetService.getSavedTweets(username, lastId)
          .then((response) => {
            if (response && response.length > 0) {
              setSavedTweets(prev => [...prev, ...response]);
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

    // Solo agregar el event listener si tenemos un username y tenemos un lastId
    if (username) {
      window.addEventListener('scroll', handleScroll);
    }

    // Limpiar event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, lastId, username]); // Dependencias importantes

  return (
    <div>
      <div className="w-full flex items-center sticky top-0 z-50 border border-gray-400 backdrop-blur-sm">
        <div className="flex flex-row h-14 p-1 gap-2">
          <button className="flex h-full items-center" onClick={() => history.back()}>
            <span className="material-symbols-outlined">
              arrow_back
            </span>
          </button>
          <div className="flex flex-col justify-center">
            <h2 className="text-lg">Guardados</h2>
          </div>
        </div>
      </div>
      <div>
        {savedTweets ? (
          <div className="flex flex-col">
            {savedTweets.map(savedTweet => (
              <div key={savedTweet.id} className="w-full border border-grey-400">
                <TweetComponent Tweet={savedTweet} setTweets={setSavedTweets}></TweetComponent>
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
  )
}

export default savesPage;