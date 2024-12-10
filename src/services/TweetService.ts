import axiosInstance from "@/lib/axios";
import { Tweet } from "@/types/tweet";
import { AxiosError } from "axios";

const TweetService = {
    async getTweets(): Promise<Tweet[]> {
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
    async createTweets(content: String): Promise<Tweet> {
        return new Promise((resolve, reject) => {
            axiosInstance.post("http://localhost:8080/api/tweets", { content })
                .then((response) => resolve(response.data as Tweet))
                .catch((error: AxiosError) => { reject(error) })
        })
    },
    async deleteTweets(id: number): Promise<Tweet> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`http://localhost:8080/api/tweets/${ id }`)
                .then((response) => { resolve(response.data as Tweet) })
                .catch((error: AxiosError) => { reject(error) })
        })
    },
    async editTweets(id: number, content: string): Promise<Tweet> {
        return new Promise((resolve, reject) => {
            axiosInstance.put(`http://localhost:8080/api/tweets/${id}`, { content })
                .then((response) => { resolve(response.data as Tweet) })
                .catch((error: AxiosError) => { reject(error) })
        })
    }
}

export default TweetService;