import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../services/axiosInstance";
import { addUser } from "../utils/slices/userSlice";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = axiosInstance.post("/profile/view");
        dispatch(addUser(res.data.data));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return children;
};

export default AuthLoader;
