import axiosInstance from "@/lib/axios";
import { UserNotification } from "@/types/notification";

const NotificationService = {
    async getNotificationsByUsername(username: string): Promise<UserNotification[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/notifications/${username}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

export default NotificationService;