import axiosInstance from "@/lib/axios";
import { TweetResponseDTO } from "@/types/tweet";
import { rejects } from "assert";
import { AxiosError } from "axios";
import { resolve } from "path";

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
    async createTweets(content: String, parentTweetId?: number): Promise<TweetResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`http://localhost:8080/api/tweets`, { content, parentTweetId })
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
    async getComments(id: number): Promise<TweetResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`http://localhost:8080/api/tweets/comments/${id}`)
                .then((response) => { resolve(response.data as TweetResponseDTO[]) })
                .catch(error => { reject(error) })
        })
    },
    async giveLike(id: number): Promise<String>{
        return new Promise((resolve, reject)=>{
            axiosInstance.post(`http://localhost:8080/api/likes/give?tweetId=${id}`)
            .then((response)=>{resolve(response.data as String)})
            .catch(error => {reject(error)})
        })
    },
    async removeLike(id: number): Promise<String>{
        return new Promise((resolve, reject)=>{
            axiosInstance.delete(`http://localhost:8080/api/likes/remove?tweetId=${id}`)
            .then((response)=>{resolve(response.data as String)})
            .catch(error => {reject(error)})
        })
    }
}

export default TweetService;