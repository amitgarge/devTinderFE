import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { removeUser } from "../utils/slices/userSlice";
import axiosInstance from "../services/axiosInstance";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axiosInstance.post("/auth/logout");
    dispatch(removeUser());
    navigate("/auth/login");
  };

  return (
    <div className="bg-base-100 border-b border-base-300">
      <div className="navbar max-w-6xl mx-auto px-4">

        {/* Brand */}
        <div className="flex-1">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-primary hover:opacity-80 transition"
          >
            DevTinder
          </Link>
        </div>

        {/* Right Section */}
        {user && (
          <div className="flex items-center gap-4">

            {/* Avatar Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar cursor-pointer"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img alt="User" src={user.photoURL} />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-xl w-48 border border-base-300"
              >
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/connections">Connections</Link>
                </li>
                <li>
                  <Link to="/requests">Requests</Link>
                </li>
                <li className="border-t border-base-300 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="text-error"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
