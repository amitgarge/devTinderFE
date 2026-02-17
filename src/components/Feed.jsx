import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/slices/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axiosInstance from "../services/axiosInstance";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeed = async () => {
      const res = await axiosInstance.get("/user/feed");
      dispatch(addFeed(res.data.data));
      setLoading(false);
    };

    loadFeed();
  }, [dispatch]);

  const handleRequest = async (status, userId) => {
    await axiosInstance.post(`/request/send/${status}/${userId}`);
    dispatch(removeUserFromFeed(userId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold">You're all caught up 🎉</h2>
          <p className="text-base-content/60">
            No more developers to show right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 py-12">
      <div className="max-w-6xl mx-auto px-4 flex justify-center">
        <UserCard
          user={feed[0]}
          showActions
          onIgnore={() => handleRequest("ignored", feed[0]._id)}
          onInterested={() =>
            handleRequest("interested", feed[0]._id)
          }
        />
      </div>
    </div>
  );
};

export default Feed;
