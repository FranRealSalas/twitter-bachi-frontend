import useAuth from "@/hooks/useAuth";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

const axiosInstance = axios.create({
    baseURL: BASE_URL
});

axiosInstance.interceptors.request.use(async (request) => {
    const token = localStorage.getItem("authToken");

    if (!request.headers["Authorization"] && token) {
        request.headers["Authorization"] = `Bearer ${token}`;
    }

    return request;
},
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const prevRequest = error?.config;
        if ((error?.response.status === 403) && !prevRequest?.sent) {
            useAuth().logout()
            return;
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;