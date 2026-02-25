import { useState, useRef } from "react";
import { addUser } from "../utils/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const firstNameRef = useRef(null);

  // ---------------- PASSWORD STRENGTH ----------------
  const getPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (password.match(/^(?=.*[A-Z])(?=.*\d).{8,}$/)) return "Strong";
    return "Medium";
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // ---------------- VALIDATION ----------------
  const validateField = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let message = "";

    switch (name) {
      case "email":
        if (!emailRegex.test(value.trim()))
          message = "Enter a valid email address";
        break;

      case "password":
        if (value.length < 6)
          message = "Password must be at least 6 characters";
        break;

      case "confirmPassword":
        if (!isLoginForm && value !== formData.password)
          message = "Passwords do not match";
        break;

      case "firstName":
        if (!isLoginForm && value.trim().length < 2)
          message = "First name must be at least 2 characters";
        break;

      case "lastName":
        if (!isLoginForm && value.trim().length < 2)
          message = "Last name must be at least 2 characters";
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));

    return message === "";
  };

  const validateAll = () => {
    const fields = isLoginForm
      ? ["email", "password"]
      : ["firstName", "lastName", "email", "password", "confirmPassword"];

    let isValid = true;

    for (let field of fields) {
      const valid = validateField(field, formData[field]);
      if (!valid && isValid) {
        // Auto-focus first invalid field
        if (field === "firstName") firstNameRef.current?.focus();
        if (field === "email") emailRef.current?.focus();
        if (field === "password") passwordRef.current?.focus();
      }
      if (!valid) isValid = false;
    }

    return isValid;
  };

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const submitForm = async () => {
    if (!validateAll()) return;

    try {
      setLoading(true);

      const endpoint = isLoginForm ? "/login" : "/signup";

      const payload = isLoginForm
        ? { email: formData.email, password: formData.password }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          };

      const res = await axiosInstance.post(endpoint, payload);

      dispatch(addUser(res.data.data));
      toast.success(
        isLoginForm ? "Welcome back 👋" : "Account created successfully 🎉",
      );

      navigate(isLoginForm ? "/" : "/profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary">DevTinder</h1>
          <p className="text-base-content/60 mt-2">
            Connect with developers around you
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl rounded-2xl p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitForm();
            }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {isLoginForm ? "Login" : "Create Account"}
            </h2>

            <div className="space-y-4">
              {!isLoginForm && (
                <>
                  <input
                    ref={firstNameRef}
                    name="firstName"
                    placeholder="First Name"
                    className={`input input-bordered w-full ${errors.firstName ? "input-error" : ""}`}
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.firstName && (
                    <p className="text-error text-sm">{errors.firstName}</p>
                  )}

                  <input
                    name="lastName"
                    placeholder="Last Name"
                    className={`input input-bordered w-full ${errors.lastName ? "input-error" : ""}`}
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.lastName && (
                    <p className="text-error text-sm">{errors.lastName}</p>
                  )}
                </>
              )}

              <input
                ref={emailRef}
                name="email"
                type="email"
                placeholder="Email"
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && (
                <p className="text-error text-sm">{errors.email}</p>
              )}

              <div>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`input input-bordered w-full pr-16 ${errors.password ? "input-error" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {!isLoginForm && formData.password && (
                  <p
                    className={`text-sm mt-1 ${
                      passwordStrength === "Weak"
                        ? "text-error"
                        : passwordStrength === "Medium"
                          ? "text-warning"
                          : "text-success"
                    }`}
                  >
                    Strength: {passwordStrength}
                  </p>
                )}

                {errors.password && (
                  <p className="text-error text-sm">{errors.password}</p>
                )}
              </div>

              {!isLoginForm && (
                <>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={`input input-bordered w-full pr-16 ${
                        errors.confirmPassword ? "input-error" : ""
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </>
              )}

              <button
                className="btn btn-primary w-full mt-4"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : isLoginForm ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </button>

              <p
                className="text-sm text-center cursor-pointer hover:text-primary"
                onClick={() => {
                  setErrors({});
                  setIsLoginForm(!isLoginForm);
                }}
              >
                {isLoginForm
                  ? "New here? Create an account"
                  : "Already have an account? Login"}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
