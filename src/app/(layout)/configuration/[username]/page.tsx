"use client"
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import UserService from "@/services/UserService";
import { UserResponseDTO } from "@/types/user";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const configurationPage = () => {
  const [currentUser, setCurrentUser] = useState<UserResponseDTO>();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    UserService.getUserByUsername(username)
      .then((response) => {
        setCurrentUser(response);
      })
  }, []);

  return (
    <div className="border border-gray-400">
      <div className="w-full flex items-center sticky top-0 z-50 border-b border-gray-400 backdrop-blur-sm">
        <div className="flex flex-row h-14 p-1 gap-2">
          <button className="flex h-full items-center" onClick={() => history.back()}>
            <span className="material-symbols-outlined">
              arrow_back
            </span>
          </button>
          <div className="flex flex-col justify-center">
            <h2 className="text-lg">Configuración</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <button
          className="w-full h-16 flex items-center px-2"
          onClick={() => {
            setTimeout(() => {
              setEditProfileOpen(!editProfileOpen)
          }, 100)
          }} 
          >Editar nombre</button>
          <EditProfileModal editProfileOpen={editProfileOpen} setEditProfileOpen={setEditProfileOpen} user={currentUser} setUser={setCurrentUser}></EditProfileModal>
      </div>
    </div>
  )
}

export default configurationPage;