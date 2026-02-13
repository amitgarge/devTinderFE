import { useState } from "react";
import axios from "axios";
import { addUser } from "../utils/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { BASE_API_URL } from "../utils/constants";

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async () => {
    try {
      const result = await axios.post(
        BASE_API_URL + "login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(result.data.data));
      return navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const signUp = async () => {
    try {
      const res = await axios.post(
        `${BASE_API_URL}signup`,
        { firstName, lastName, email, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend text-xl">
          {isLoginForm ? "Login" : "Sign Up"}
        </legend>

        {!isLoginForm && (
          <>
            <label className="label">First Name</label>
            <input
              type="text"
              value={firstName}
              className="input"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />

            <label className="label">Last Name</label>
            <input
              type="text"
              value={lastName}
              className="input"
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}

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

        <button
          className="btn btn-neutral mt-4"
          onClick={isLoginForm ? login : signUp}
        >
          {isLoginForm ? "Login" : "Sign Up"}
        </button>
        <p
          onClick={() => {
            setIsLoginForm((value) => !value);
          }}
        >
          {isLoginForm
            ? "New User? Sign Up Here!"
            : "Already registered? Login Here!"}
        </p>
      </fieldset>
    </div>
  );
};

export default Login;
