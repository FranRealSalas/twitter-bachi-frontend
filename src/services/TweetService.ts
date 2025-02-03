import axiosInstance from "@/lib/axios";
import { TweetResponseDTO } from "@/types/tweet";
import { AxiosError } from "axios";

const TweetService = {
    async getTweets(): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async createTweets(content: String, fileList: FileList, parentTweetId?: number): Promise<TweetResponseDTO> {
        const formData = new FormData();
            for (let i = 0; i < fileList?.length; i++) {
                formData.append("images", new Blob([fileList.item(i)!],{type : fileList.item(i)!.type}));
            }
        formData.append('content', new Blob([JSON.stringify({ content, parentTweetId })],{type: "application/json"}))

        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets`, formData)
                .then((response) => resolve(response.data as TweetResponseDTO))
                .catch((error: AxiosError) => { reject(error) })
        })
    },
    async deleteTweets(id: number): Promise<TweetResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets/${id}`)
                .then((response) => { resolve(response.data as TweetResponseDTO) })
                .catch((error: AxiosError) => { reject(error) })
        })
    },
    async editTweets(id: number, content: string): Promise<TweetResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets/${id}`, { content })
                .then((response) => { resolve(response.data as TweetResponseDTO) })
                .catch((error: AxiosError) => { reject(error) })
        })
    },
    async getTweetById(id: number): Promise<TweetResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets/${id}`)
                .then((response) => { resolve(response.data as TweetResponseDTO) })
                .catch(error => { reject(error) })
        })
    },
    async getTweetsByUsername(username: string): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets/by-username/${username}`)
                .then((response) => { resolve(response.data as TweetResponseDTO[]) })
                .catch(error => { reject(error) })
        })
    },
    async getComments(id: number): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets/comments/${id}`)
                .then((response) => { resolve(response.data as TweetResponseDTO[]) })
                .catch(error => { reject(error) })
        })
    },
    async getCommentsByUsername(username:string): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets/comments/by-username/${username}`)
                .then((response) => { resolve(response.data as TweetResponseDTO[]) })
                .catch(error => { reject(error) })
        })
    },
    async getTweetsWithImagesByUsername(username:string): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tweets/with-image/${username}`)
                .then((response) => { resolve(response.data as TweetResponseDTO[]) })
                .catch(error => { reject(error) })
        })
    },
    async giveLike(id: number): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/likes/give?tweetId=${id}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async removeLike(id: number): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/likes/remove?tweetId=${id}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async giveSave(id: number): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/saves/give?tweetId=${id}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async removeSave(id: number): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/saves/remove?tweetId=${id}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async getSavedTweets(username: String): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/saves/${username}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async getLikedTweets(username: String): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/likes/${username}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

export default TweetService;