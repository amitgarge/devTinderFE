import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

axiosInstance.interceptors.response.use(
    (response)=>{
        //backend contract alignment
        if(response.data?.success === false) {
            toast.error(response.data.message);
            return Promise.reject(new Error(response.data.message));
        }
        return response;
    },
    (error) =>{
        const message = error.response?.data?.message || "Something Went wrong";

        if(error.response?.status === 401){
            window.location.href = "/login";
        }
        toast.error(message);
        return Promise.reject(error);
    }
)

export default axiosInstance;