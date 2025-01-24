"use client"
import TweetComponent from "@/components/TweetComponent";
import TweetService from "@/services/TweetService";
import { TweetResponseDTO } from "@/types/tweet";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const savesPage = () => {
  const { username } = useParams<{ username: string }>();
  const [savedTweets, setSavedTweets] = useState<TweetResponseDTO[]>()

  useEffect(() => {
    TweetService.getSavedTweets(username).then((response) => {
      setSavedTweets(response);
    })
  }, []);

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
          <div className="flex flex-col-reverse">
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