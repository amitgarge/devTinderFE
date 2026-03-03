import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../utils/slices/userSlice";
import axiosInstance from "../services/axiosInstance";
import { connectSocket } from "../services/socket";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const res = await axiosInstance.get("/profile/view");
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