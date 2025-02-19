"use client"
import TweetComponent from "@/components/TweetComponent";
import useAuth from "@/hooks/useAuth";
import TweetService from "@/services/TweetService";
import { TweetCreation, TweetResponseDTO } from "@/types/tweet";
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import PostForm from "@/components/PostForm";

export default function Home() {
  const [tweets, setTweets] = useState<TweetResponseDTO[]>()
  const { isLogged } = useAuth();
  
  if (!isLogged()) {
    redirect(`${process.env.NEXT_PUBLIC_BACKEND_URL}login`);
  }

  useEffect(() => {
    TweetService.getTweets().then((response) => {
      setTweets(response);
    })
  }, []);

  return (
    <>
      <div className="max-w-xl">
        <div className="h-14 w-full sticky top-0 backdrop-blur-sm">
          <div className="flex flex-row z-50">
            <button
              onClick={() =>
                TweetService.getTweets().then((response) => {
                  setTweets(response);
                })}
              className="flex h-14 w-1/2 justify-center items-center hover:bg-gray-400 border border-gray-400">Para ti</button>
            <button
              onClick={() =>
                console.log("Siguiendo")
              }
              className="flex w-1/2 h-14 justify-center items-center hover:bg-gray-400 border border-gray-400">Siguiendo</button>
          </div>
        </div>
        <PostForm setTweets={setTweets}></PostForm>
        <div>
          {tweets ? (
            <div className="flex flex-col-reverse">
              {tweets.map(Tweet => (
                <div key={Tweet.id} className="w-full min-w-fit border border-grey-400">
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
    </>
  );
}
