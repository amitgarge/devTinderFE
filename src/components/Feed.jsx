import axios from "axios";
import { BASE_API_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/slices/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const loadFeed = async () => {
    try {
      const res = await axios.get(BASE_API_URL + "user/feed", {
        withCredentials: true,
      });
      console.log(res);
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadFeed();
  }, []);
  return (
    feed && (
      <div className="min-h-screen grid place-items-center">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
