import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/slices/connectionSlice";
import axiosInstance from "../services/axiosInstance";

const Connections = () => {
  const dispatch = useDispatch();
  const connectionData = useSelector((store) => store.connection);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      const res = await axiosInstance.get("/user/connections");
      dispatch(addConnection(res.data.data));
      setLoading(false);
    };

    fetchConnections();
  }, [dispatch]);

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
          Friends
        </h1>

        {/* Empty State */}
        {connectionData?.length === 0 && (
          <div className="text-center text-base-content/60 text-lg">
            You don’t have any connections yet.
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

          {connectionData?.map((connection) => {
            const {
              _id,
              firstName,
              lastName,
              age,
              gender,
              photoURL,
              about,
              skills,
            } = connection;

            return (
              <div
                key={_id}
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

                <p className="text-sm text-base-content/70 line-clamp-3">
                  {about}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default Connections;
