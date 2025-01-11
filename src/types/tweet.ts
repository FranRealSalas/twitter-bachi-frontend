import { User, UserResponseDTO } from "./user";

export type TweetResponseDTO = {
    id: number;
    content: string;
    user: UserResponseDTO;
    parentTweetId: number;
    liked: boolean;
    saved: boolean;
}