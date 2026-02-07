import { useState } from "react";
import axios from "axios";
import { addUser } from "../utils/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("yogesh@gmail.com");
  const [password, setPassword] = useState("Yogesh@1234");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const result = await axios.post(
        "http://127.0.0.1:3000/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(result.data.data));
      return navigate("/")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend text-xl">Login</legend>

        <label className="label">Email</label>
        <input
          type="email"
          value={email}
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          value={password}
          className="input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-neutral mt-4" onClick={handleClick}>
          Login
        </button>
      </fieldset>
    </div>
  );
};

export default Login;
