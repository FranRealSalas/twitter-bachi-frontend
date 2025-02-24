"use client"
import NotificationService from "@/services/NotificationService";
import { UserNotification } from "@/types/notification";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const NotificationsPage = () => {
    const [userNotifications, setUserNotifications] = useState<UserNotification[]>();
    const { username } = useParams<{ username: string }>();

    useEffect(() => {
        NotificationService.getNotificationsByUsername(username)
            .then((response) => {
                console.log(response);
                setUserNotifications(response);
            })
    }, []);

    return (
        <div>
            <div className="w-full flex items-center sticky top-0 z-50 border border-gray-400 backdrop-blur-sm">
                <div className="flex flex-row h-14 p-1 gap-2">
                    <button className="flex h-full items-center" onClick={() => history.back()}>
                        <span className="material-symbols-outlined">
                            arrow_back
                        </span>
                    </button>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-lg">Notificaciones</h2>
                    </div>
                </div>
            </div>
            <div>
                {userNotifications ? (
                    <div className="flex flex-col-reverse">
                        {userNotifications.map(userNotifications => (
                            <div key={userNotifications.id} className="w-full min-w-fit border border-grey-400">
                                <div className="flex flex-row p-3">
                                    <span>
                                        {userNotifications.notification.icon === "follow_icon" ?
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-sky-400 w-8 h-8"><g><path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"></path></g></svg>
                                            :
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-red-500 w-8 h-8"><g><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
                                        }
                                    </span>
                                    <div>
                                        <img
                                            className="h-14 w-14 rounded-full p-2"
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/uploads/profile/img/${userNotifications.notification.profileImage}`}
                                        />
                                        <h1
                                            className="cursor-pointer"
                                            onClick={() => { redirect(userNotifications.notification.href) }}>{userNotifications.notification.description}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                )
                    :
                    (
                        <>No hay notificaciones.</>
                    )
                }
            </div>
        </div>
    )
}

export default NotificationsPage;