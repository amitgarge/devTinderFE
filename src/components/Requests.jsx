import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/slices/requestSlice";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";

const Requests = () => {
  const dispatch = useDispatch();
  const requestData = useSelector((store) => store.request);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosInstance.get("/user/requests/received");
        dispatch(addRequest(res.data.data));
      } catch {
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [dispatch]);

  const handleRequest = async (status, id) => {
    const promise = axiosInstance.post(
      `/request/review/${status}/${id}`,
      {}
    );

    toast.promise(promise, {
      loading: "Processing...",
      success:
        status === "accepted"
          ? "Request accepted 🎉"
          : "Request rejected",
      error: "Action failed",
    });

    await promise;
    dispatch(removeRequest(id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 py-16">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-bold mb-12 text-center">
          Pending Requests
        </h1>

        {requestData?.length === 0 && (
          <div className="text-center text-base-content/60 text-lg">
            No pending requests
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

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
              <div
                key={request._id}
                className="card bg-base-100 shadow-md rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    className="w-14 h-14 rounded-full object-cover bg-base-200 ring ring-primary ring-offset-2 ring-offset-base-100"
                    src={photoURL}
                    alt="profile"
                  />

                  <div>
                    <div className="font-semibold text-lg">
                      {firstName} {lastName}
                    </div>

                    <div className="text-sm text-base-content/60">
                      {gender} • {age}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="badge badge-outline badge-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-base-content/70 line-clamp-3 mb-4">
                  {about}
                </p>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() =>
                      handleRequest("accepted", request._id)
                    }
                    className="btn btn-sm btn-primary flex-1"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleRequest("rejected", request._id)
                    }
                    className="btn btn-sm btn-outline btn-error flex-1"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default Requests;
