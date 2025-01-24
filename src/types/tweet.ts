import { Image } from "./image";
import { UserResponseDTO } from "./user";

export type TweetResponseDTO = {
    id: number;
    content: string;
    user: UserResponseDTO;
    parentTweetId: number;
    liked: boolean;
    saved: boolean;
    likeCount: number;
    saveCount: number;
    countComments: number;
    images: Image[];
}

export type TweetCreation = {
    content: string;
    images: FileList;
    parentTweetId: number;
}