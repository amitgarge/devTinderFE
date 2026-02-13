import axios from "axios";
import { BASE_API_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/slices/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connectionData = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_API_URL + "user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);
  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-md mx-auto px-4">
        <h1 className="font-bold text-xl mb-6 text-center">Friends</h1>

        {/* Empty State */}
        {connectionData?.length === 0 && (
          <div className="text-center text-base-content/60">
            Oops! You have no Friends! Send the Requests to make new friends!
          </div>
        )}

        <ul className="bg-base-100 rounded-lg divide-y shadow-sm">
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
              <li key={_id} className="flex gap-3 p-4">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={photoURL}
                  alt="profile"
                />

                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-sm">
                    {firstName} {lastName}
                  </div>

                  <div className="text-xs text-base-content/60">
                    {gender} • {age}
                  </div>

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
                  <p className="text-xs text-base-content/70">{about}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Connections;
