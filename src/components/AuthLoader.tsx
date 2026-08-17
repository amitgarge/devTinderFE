import { useEffect, useState, type ReactNode } from "react";
import { useAppDispatch } from "@/utils/hooks";
import { addUser, removeUser } from "../utils/slices/userSlice";
import axiosInstance from "../services/axiosInstance";
import { connectSocket } from "../services/socket";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

interface AuthLoadProps {
  children: ReactNode
}

const AuthLoader = ({ children }: AuthLoadProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const res = await axiosInstance.get<ApiResponse<User>>("/profile/view");
        dispatch(addUser(res.data.data));
        connectSocket();
      } catch {
        dispatch(removeUser());
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
};

export default AuthLoader;