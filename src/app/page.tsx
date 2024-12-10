"use client"
import Modal from "@/components/modals/Modal";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import TweetComponent from "@/components/TweetComponent";
import useAuth from "@/hooks/useAuth";
import TweetService from "@/services/TweetService";
import { LoggedUser } from "@/types/loggedUser";
import { Tweet } from "@/types/tweet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const { register, handleSubmit, reset } = useForm<Tweet>();
  const [tweets, setTweets] = useState<Tweet[]>()
  const { getUser, isLogged } = useAuth();
  const router = useRouter();
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>();
  const [openPostButtonNavbar, setOpenPostButtonNavbar] = useState(false);

  useEffect(() => {
    const user = getUser();
    setLoggedUser(user);
  }, []);

  if (!isLogged()) {
    router.push('/login')
    return (<></>)
  }

  useEffect(() => {
    TweetService.getTweets().then((response) => {
      setTweets(response);
    })
  }, []);

  function handleCreateTweet(e: Tweet) {
    TweetService.createTweets(e.content).then(() => {
      TweetService.getTweets().then((response) => {
        setOpenPostButtonNavbar(!openPostButtonNavbar);
        setTweets(response);
        reset();
      })
    })
  }

  return (
    <>
      <div className="h-full flex flex-row px-44">
        <div className="w-1/4" >
          <Navbar openPostModal={openPostButtonNavbar} setOpenPostModal={setOpenPostButtonNavbar} />
        </div>
        <div className="flex flex-row w-2/4">
          <div className="flex flex-col w-full">
            <div className="h-16 w-full sticky top-0 backdrop-blur-sm">
              <div className="flex flex-row z-50">
                <button onClick={() => console.log("Para ti")} className="flex h-12 w-1/2 justify-center items-center hover:bg-gray-400 border border-gray-400">
                  <span>Para ti</span>
                </button>
                <button onClick={() => console.log("Siguiendo")} className="flex w-1/2 h-12 justify-center items-center hover:bg-gray-400 border border-gray-400">
                  <span>Siguiendo</span>
                </button>
              </div>
            </div>
            <div>
              <div className="fixed justify-center items-center">
                <Modal open={openPostButtonNavbar} setOpen={setOpenPostButtonNavbar}>
                  <form className="h-32 flex border border-gray-400 p-5 w-full" onSubmit={handleSubmit(handleCreateTweet)}>
                    <div className="flex w-full flex-row justify-between items-center">
                      <img src={`http://localhost:8080/api/users/uploads/img/${loggedUser?.profileImage}`} onError={(e)=> e.currentTarget.src="https://assets-staging.autoplants.cloud/default.jpg" } className="w-14 h-14 rounded-full" />
                      <div className="w-3/4">
                        <input type="text"
                          className="w-full h-full bg-black outline-none"
                          placeholder="Que esta pasando?!"
                          {...register("content")} />
                      </div>
                      <div className="flex items-end h-full">
                        <button type="submit" className="bg-sky-500 rounded-xl w-[75px] h-[30px]">Postear</button>
                      </div>
                    </div>
                  </form>
                </Modal>
              </div>
              <form className="w-full h-32 flex border border-gray-400 p-5" onSubmit={handleSubmit(handleCreateTweet)}>
                <div className="flex w-full flex-row justify-between items-center">
                  <img src={`http://localhost:8080/api/users/uploads/img/${loggedUser?.profileImage}`} onError={(e)=> e.currentTarget.src="https://assets-staging.autoplants.cloud/default.jpg" } className="w-14 h-14 rounded-full" />
                  <div className="w-3/4">
                    <input type="text"
                      className="w-full h-full bg-black outline-none"
                      placeholder="Que esta pasando?!"
                      {...register("content")} />
                  </div>
                  <div className="flex items-end h-full">
                    <button type="submit" className="bg-sky-500 rounded-xl w-[75px] h-[30px]">Postear</button>
                  </div>
                </div>
              </form>
            </div>
            <div>
              {tweets ? (
                <div className="flex flex-col-reverse">
                  {tweets.map(Tweet => (
                    <div key={Tweet.id} className="w-full">
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
        <div className="w-1/4">
          <SearchBar />
        </div>
      </div>
    </>
  );
}
