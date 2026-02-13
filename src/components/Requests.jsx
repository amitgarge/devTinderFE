import axios from "axios";
import { BASE_API_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/slices/requestSlice";
import toast from "react-hot-toast";

const Requests = () => {
  const dispatch = useDispatch();
  const requestData = useSelector((store) => store.request);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(
          BASE_API_URL + "user/requests/received",
          { withCredentials: true },
        );

        dispatch(addRequest(data.data));
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong!";

        toast.error(message);
      }
    };

    fetchRequests();
  }, [dispatch]);

  // 🔹 Example handlers (replace with real API calls)
  const handleRequest = async (status, id) => {
    const promise = axios.post(
      `${BASE_API_URL}request/review/${status}/${id}`,
      {},
      { withCredentials: true },
    );

    await toast.promise(promise, {
      loading: "Processing...",
      success: "Request updated!",
      error: "Action failed",
    });

    dispatch(removeRequest(id));
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-center mb-8">
          Pending Requests
        </h1>

        {/* Empty State */}
        {requestData?.length === 0 && (
          <div className="text-center text-base-content/60">
            No pending requests
          </div>
        )}

        {/* Requests List */}
        <ul className="bg-base-100 rounded-xl shadow-sm divide-y">
          {requestData?.map((request) => {
            const {
              _id,
              firstName,
              lastName,
              age,
              gender,
              photoURL,
              about,
              skills,
            } = request.fromUserId;

            return (
              <li
                key={_id}
                className="flex items-start gap-4 p-4 hover:bg-base-200 transition duration-200"
              >
                {/* Avatar */}
                <img
                  className="w-14 h-14 rounded-full object-cover"
                  src={photoURL}
                  alt="profile"
                />

                {/* User Info */}
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-sm leading-tight">
                    {firstName} {lastName}
                  </div>

                  <div className="text-xs text-base-content/60">
                    {gender} • {age}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="badge badge-outline badge-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* About */}
                  <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
                    {about}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 justify-center">
                  <button
                    onClick={() => handleRequest("accepted", request._id)}
                    className="btn btn-sm btn-success"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleRequest("rejected", request._id)}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    Reject
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Requests;
