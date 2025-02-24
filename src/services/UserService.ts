import axiosInstance from "@/lib/axios";
import { User, UserFollow, UserResponseDTO } from "@/types/user";
import { AxiosError } from "axios";

const UserService = {
    async getAllUsers(): Promise<UserResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        })
    },
    async getUserByUsername(username: string): Promise<UserResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${username}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    async getLoggedUser(): Promise<UserResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/logged-user`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    async createUser(username: string, password: string, email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            console.log(username, password, email);
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users`, { username, password, email })
                .then((response) => resolve(response.data as User))
                .catch((error: AxiosError) => {
                    reject(error);
                })
        })
    },
    async editUser(username:string, editableName: string): Promise<User> {
        return new Promise((resolve, reject) => {
            axiosInstance.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/edit/${username}`, { editableName })
                .then((response) => resolve(response.data as User))
                .catch((error: AxiosError) => {
                    reject(error);
                })
        })
    },
    async uploadProfileImage(file: File): Promise<UserResponseDTO> {
        const formData = new FormData();
        formData.append("file", file);

        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploadProfileImage`, formData)
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => {
                    if (error.isAxiosError) reject(error)
                    reject(error.response?.data || error)
                })
        })
    },
    async uploadCoverImage(file: File): Promise<UserResponseDTO> {
        const formData = new FormData();
        formData.append("file", file);

        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploadCoverImage`, formData)
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => {
                    if (error.isAxiosError) reject(error)
                    reject(error.response?.data || error)
                })
        })
    },
    async giveFollow(username: string): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/follow/give?username=${username}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async removeFollow(username: string): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/follow/remove?username=${username}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async getFollowersByUsername(username: string): Promise<UserFollow[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/followers/${username}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    async getFollowingsByUsername(username: string): Promise<UserFollow[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/following/${username}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }
}

export default UserService;