import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../utils/slices/userSlice";
import axiosInstance from "../services/axiosInstance";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const res = await axiosInstance.get("/profile/view");
        dispatch(addUser(res.data.data));
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
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return children;
};

export default AuthLoader;
