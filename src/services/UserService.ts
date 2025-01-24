import axiosInstance from "@/lib/axios";
import { User, UserResponseDTO } from "@/types/user";
import { AxiosError } from "axios";

const UserService = {
    async getAllUsers(): Promise<UserResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get("http://localhost:8080/api/users")
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
            axiosInstance.get(`http://localhost:8080/api/users/${username}`)
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
            axiosInstance.post("http://localhost:8080/api/users", { username, password, email })
                .then((response) => resolve(response.data as User))
                .catch((error: AxiosError) => {
                    reject(error);
                })
        })
    },
    async editUser(username:string, editableName: string): Promise<User> {
        return new Promise((resolve, reject) => {
            axiosInstance.put(`http://localhost:8080/api/users/edit/${username}`, { editableName })
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
            axiosInstance.post("http://localhost:8080/api/users/uploadProfileImage", formData)
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
            axiosInstance.post("http://localhost:8080/api/users/uploadCoverImage", formData)
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => {
                    if (error.isAxiosError) reject(error)
                    reject(error.response?.data || error)
                })
        })
    },
    async giveFollow(username: string): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`http://localhost:8080/api/follow/give?username=${username}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async removeFollow(username: string): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`http://localhost:8080/api/follow/remove?username=${username}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    }
}

export default UserService;