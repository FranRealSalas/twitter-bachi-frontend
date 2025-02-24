"use client"
import UserFollowComponent from "@/components/UserFollowComponent";
import UserService from "@/services/UserService";
import { UserFollow, UserResponseDTO } from "@/types/user";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const FollowersPage = () => {
  const [followRelation, setFollowRelation] = useState<UserFollow[]>();
  const { username } = useParams<{ username: string }>();
  const [currentUser, setCurrentUser] = useState<UserResponseDTO>();

  useEffect(() => {
    UserService.getUserByUsername(username)
      .then((response) => {
        setCurrentUser(response);
      })
  }, []);

  useEffect(() => {
    UserService.getFollowersByUsername(username)
      .then((response) => {
        setFollowRelation(response);
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
            <h2 className="text-lg">{currentUser?.editableName}</h2>
            <h2 className="text-lg">@{currentUser?.username}</h2>
          </div>
        </div>
      </div>
      <div className="h-14 w-full sticky top-0 backdrop-blur-sm">
        <div className="flex flex-row z-50">
          <button
            onClick={() => {
              redirect(`/followers/${username}`)
            }}
            className={`flex h-14 w-1/2 justify-center items-center hover:bg-gray-400 border border-gray-400`}>
            <span className='border-b-2 border-sky-500'>Seguidores</span>
          </button>
          <button
            onClick={() => {
              redirect(`/followings/${username}`)
            }}
            className={`flex w-1/2 h-14 justify-center items-center hover:bg-gray-400 border-[.1px] border-gray-400`}>
            <span>Siguiendo</span>
          </button>
        </div>
      </div>
      <div>
        {followRelation ? (
          <div className="flex flex-col-reverse">
            {followRelation.map(FollowRelation => (
              <div key={FollowRelation.id} className="w-full min-w-fit border border-grey-400">
                <UserFollowComponent username={FollowRelation.follower.username} editableName={FollowRelation.follower.editableName}></UserFollowComponent>
              </div>
            )
            )}
          </div>
        )
          :
          (
            <></>
          )
        }
      </div>
    </div>
  )
}

export default FollowersPage;