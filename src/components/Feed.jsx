import axios from "axios";
import { BASE_API_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/slices/feedSlice";
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

      dispatch(addFeed(res.data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loadFeed();
  }, []);

  const handleRequest = async (status, userId) => {
    await axios.post(
      `${BASE_API_URL}request/send/${status}/${userId}`,
      {},
      { withCredentials: true },
    );

    dispatch(removeUserFromFeed(userId));
  };
  return (
    feed?.length > 0 && (
      <div className="min-h-screen grid place-items-center">
        <UserCard
          user={feed[0]}
          showActions={true}
          onIgnore={() => handleRequest("ignored", feed[0]._id)}
          onInterested={() => handleRequest("interested", feed[0]._id)}
        />
      </div>
    )
  );
};

export default Feed;
