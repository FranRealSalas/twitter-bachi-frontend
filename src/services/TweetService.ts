import axiosInstance from "@/lib/axios";
import { TweetResponseDTO } from "@/types/tweet";
import { AxiosError } from "axios";

const TweetService = {
    async getTweets(): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get("http://localhost:8080/api/tweets")
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
            axiosInstance.post(`http://localhost:8080/api/tweets`, formData)
                .then((response) => resolve(response.data as TweetResponseDTO))
                .catch((error: AxiosError) => { reject(error) })
        })
    },
    async deleteTweets(id: number): Promise<TweetResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`http://localhost:8080/api/tweets/${id}`)
                .then((response) => { resolve(response.data as TweetResponseDTO) })
                .catch((error: AxiosError) => { reject(error) })
        })
    },
    async editTweets(id: number, content: string): Promise<TweetResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.put(`http://localhost:8080/api/tweets/${id}`, { content })
                .then((response) => { resolve(response.data as TweetResponseDTO) })
                .catch((error: AxiosError) => { reject(error) })
        })
    },
    async getTweetById(id: number): Promise<TweetResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`http://localhost:8080/api/tweets/${id}`)
                .then((response) => { resolve(response.data as TweetResponseDTO) })
                .catch(error => { reject(error) })
        })
    },
    async getTweetsByUsername(username: string): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`http://localhost:8080/api/tweets/by-username/${username}`)
                .then((response) => { resolve(response.data as TweetResponseDTO[]) })
                .catch(error => { reject(error) })
        })
    },
    async getComments(id: number): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`http://localhost:8080/api/tweets/comments/${id}`)
                .then((response) => { resolve(response.data as TweetResponseDTO[]) })
                .catch(error => { reject(error) })
        })
    },
    async giveLike(id: number): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`http://localhost:8080/api/likes/give?tweetId=${id}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async removeLike(id: number): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`http://localhost:8080/api/likes/remove?tweetId=${id}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async giveSave(id: number): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`http://localhost:8080/api/saves/give?tweetId=${id}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async removeSave(id: number): Promise<String> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`http://localhost:8080/api/saves/remove?tweetId=${id}`)
                .then((response) => { resolve(response.data as String) })
                .catch(error => { reject(error) })
        })
    },
    async getSavedTweets(username: String): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`http://localhost:8080/api/saves/${username}`)
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
            axiosInstance.get(`http://localhost:8080/api/likes/${username}`)
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