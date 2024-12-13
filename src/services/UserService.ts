import axiosInstance from "@/lib/axios";
import { User } from "@/types/user";
import { AxiosError } from "axios";

const UserService = {
    async getAllUsers(): Promise<User[]> {
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
    async getUser(): Promise<User> {
        return new Promise((resolve, reject) => {
            axiosInstance.get("http://localhost:8080/api/users")
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    async createUser(editableName: string, username: string, password: string, email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            axiosInstance.post("http://localhost:8080/api/users", { editableName, username, password, email })
                .then((response) => resolve(response.data as User))
                .catch((error: AxiosError) => {
                    reject(error);
                })
        })
    },
    async uploadProfileImage(file: File): Promise<User> {
        const formData = new FormData();
        formData.append("file", file);

        return new Promise((resolve, reject) => {
            axiosInstance.post("http://localhost:8080/api/users/uploadImage", formData)
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => {
                    if (error.isAxiosError) reject(error)
                    reject(error.response?.data || error)
                })
        })
    }
}

export default UserService;