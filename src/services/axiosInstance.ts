import axios from "axios";
import toast from "react-hot-toast";
import { navigateTo } from "../utils/navigateHelper";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    //backend contract alignment
    if (response.data?.success === false) {
      toast.error(response.data.message);
      return Promise.reject(new Error(response.data.message));
    }
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Something Went wrong";

      if (error.response?.status === 401) {
        navigateTo("/login");
      }
      toast.error(message);

    } else {
      toast.error("Something Went wrong!")
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
