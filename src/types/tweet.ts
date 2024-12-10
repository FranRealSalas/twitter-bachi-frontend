import { User } from "./user";

export type Tweet = {
    id: number;
    content: string;
    user: User;
}