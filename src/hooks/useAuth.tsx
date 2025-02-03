"use client"
import { LoggedUser } from '@/types/user';
import { LoginResponse } from '@/types/loginResponse';
import axios from 'axios';

const useAuth = () => {

  const login = (username: string, password: string): Promise<LoginResponse> => {
    return new Promise(function (resolve, reject) {
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/login`, {
        username,
        password
      })
        .then(response => {
          localStorage.setItem("authToken", response.data.token);
          resolve(response.data as LoginResponse)
        })
        .catch(() => reject())
    })
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("authToken");
      location.href = "/login";
    }
  };

  const isLogged = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("authToken") != null
    }
    return true;
  }

  const getUser = (): LoggedUser | undefined => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem("authToken");
      if (data !== null) {
        const userData: any = JSON.parse(Buffer.from(data.split('.')[1], 'base64').toString());
        return { username: userData.username, admin: userData.isAdmin, roles: [], editableName: userData.editableName , profilePhoto: userData.profilePhoto };
      }
    }
    return undefined;
  }

  return { login, logout, isLogged, getUser };
};

export default useAuth;