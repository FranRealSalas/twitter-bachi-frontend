import { User } from "./user";

export type TweetResponseDTO = {
    id: number;
    content: string;
    user: User;
    parentTweetId: number;
    liked: boolean;
}