'use client'

import TweetComponent from "@/components/TweetComponent";
import useAuth from "@/hooks/useAuth";
import TweetService from "@/services/TweetService";
import { TweetCreation, TweetResponseDTO } from "@/types/tweet";
import { useEffect, useState, useRef } from "react";
import { redirect } from 'next/navigation';
import PostForm from "@/components/PostForm";

export default function Home() {
  const [tweets, setTweets] = useState<TweetResponseDTO[]>([]);
  const { isLogged } = useAuth();
  const [forYou, setForYou] = useState(true);
  const [lastId, setLastId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollHandlerActive = useRef(false);
  
  if (!isLogged()) {
    redirect(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`);
  }

  // Cargar tweets iniciales
  useEffect(() => {
    const fetchInitialTweets = async () => {
      try {
        setIsLoading(true);
        const response = await TweetService.getTweets(null);
        if (response && response.length > 0) {
          setTweets(response);
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
        TweetService.getTweets(lastId)
          .then((response) => {
            if (response && response.length > 0) {
              setTweets(prev => [...prev, ...response]);
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

    // Solo agregar el event listener si estamos en la pestaña "Para ti" y tenemos un lastId
    if (forYou) {
      window.addEventListener('scroll', handleScroll);
    }
    
    // Limpiar event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, lastId, forYou]); // Dependencias importantes

  const handleForYouClick = async () => {
    try {
      setIsLoading(true);
      const response = await TweetService.getTweets(null);
      setTweets(response || []);
      setLastId(response && response.length > 0 ? response[response.length - 1].id : null);
      setForYou(true);
    } catch (error) {
      console.error("Error loading for you tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowingClick = async () => {
    try {
      setIsLoading(true);
      const response = await TweetService.getTweetsByFollowed();
      setTweets(response || []);
      setLastId(null); // No scroll infinito en la pestaña "Siguiendo"
      setForYou(false);
    } catch (error) {
      console.error("Error loading following tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-xl">
        <div className="h-14 w-full sticky top-0 backdrop-blur-sm">
          <div className="flex flex-row z-50">
            <button 
              onClick={handleForYouClick}
              className={`flex h-14 w-1/2 justify-center items-center hover:bg-gray-400 border border-gray-400`}
            >
              <span className={`${forYou ? 'border-b-2 border-sky-500' : ''}`}>Para ti</span>
            </button>
            <button 
              onClick={handleFollowingClick}
              className={`flex w-1/2 h-14 justify-center items-center hover:bg-gray-400 border-[.1px] border-gray-400`}
            >
              <span className={`${!forYou ? 'border-b-2 border-sky-500' : ''}`}>Siguiendo</span>
            </button>
          </div>
        </div>
        <div className="border">
          <PostForm setTweets={setTweets}></PostForm>
        </div>
        <div>
          {tweets && tweets.length > 0 ? (
            <div className="flex flex-col">
              {tweets.map(tweet => (
                <div key={`${tweet.id}-${tweet.date}`} className="w-full min-w-fit border border-grey-400">
                  <TweetComponent Tweet={tweet} setTweets={setTweets}></TweetComponent>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">No hay tweets.</div>
          )}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500 mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}