import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { addUser, removeUser } from "../utils/slices/userSlice";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

const Body = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) {
          const res = await axiosInstance.get<ApiResponse<User>>("/profile/view");
          dispatch(addUser(res.data.data));
        }
      } catch {
        dispatch(removeUser());
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
