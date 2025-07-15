import { useState, useContext } from "react";
import Logo from "../Images/Logo_PNG.png";
import { MdOutlineMail } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import { Link, useNavigate,useLocation } from "react-router-dom";
import { RiEyeCloseLine } from "react-icons/ri";
import { AiFillEye } from "react-icons/ai";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [userType, setUserType] = useState("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    const loginCredentials = {
      email: email,
      password: password,
      role: userType,
    };
    // console.log(loginCredentials);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        loginCredentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Extract user from response
      const { token, user } = response.data;
      // Update context
      login({
        fullName: user.fullName,
        role: user.role,
        token: token,
        customer_username: user.username,
      });
      
      // Show success toast
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });

      // Clear fields
      setEmail("");
      setPassword("");
      setEmailError("");
      setLoginError("");
      setTimeout(() => navigate(from), 500);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Set login error from backend message
        setLoginError(
          error.response.data.message || "Invalid email or password."
        );
      } else {
        toast.error("Something went wrong. Please try again.", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
          transition: Bounce,
        });
      }
    }
  };

  const isUser = userType === "USER";

  const gradient = isUser
    ? "from-[#e9cbf0] to-[#712681]"
    : "from-[#ffb62a] to-[#ffd990]";

  const buttonColor = isUser
    ? "bg-[#712681] hover:bg-[#ae3dc6]"
    : "bg-[#e29400] hover:bg-[#c88400]";

  return (
    <>
      {/* <ToastContainer/> */}
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center login-bg px-2 py-6 font-RobotoSlab">
        <div
          className={`flex flex-col sm:flex-row rounded-3xl shadow-2xl overflow-hidden w-[90%] max-w-5xl bg-gradient-to-r ${gradient} h-fit sm:h-auto px-3 py-2`}
        >
          {/* Left Section */}
          <div className="w-full sm:w-1/2 text-[#5c076f] p-8 flex flex-col justify-center items-center">
            <img
              src={Logo}
              alt="EventWave Logo"
              className="h-24 mb-4 float-animation"
            />
            <h2 className="text-2xl font-semibold">Welcome to</h2>
            <p className="text-3xl font-light mt-2 text-center">EventWave</p>
          </div>

          {/* Right Section */}
          <div className="w-full sm:w-1/2 bg-white p-6 sm:p-10 relative sm:m-3 curved-container-login rounded-tr-3xl rounded-br-3xl flex flex-col justify-center">
            {/* Toggle */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex space-x-1 bg-[#d8328e] text-white p-1 rounded-full font-bold z-10">
              <button
                onClick={() => {
                  setUserType("USER");
                  setEmail("");
                  setPassword("");
                  setEmailError("");
                  setLoginError("");
                }}
                className={`px-2 py-1 rounded-full text-sm ${
                  isUser ? "bg-white text-blue-900" : "hover:bg-[#b02271]"
                }`}
              >
                User
              </button>
              <button
                onClick={() => {
                  setUserType("ORGANIZER");
                  setEmail("");
                  setPassword("");
                  setEmailError("");
                  setLoginError("");
                }}
                className={`px-2 py-1 rounded-full text-sm ${
                  !isUser ? "bg-white text-blue-900" : "hover:bg-[#b02271]"
                }`}
              >
                Organizer
              </button>
            </div>

            <h2 className="text-2xl font-semibold text-[#5c076f] mb-8 text-center mt-12 sm:mt-6">
              {userType} Login
            </h2>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="flex flex-col items-center">
              {/* Email Input */}
              <div className="mb-6 flex items-center bg-gray-100 rounded-xl outline-2 outline-purple-800/50 px-4 py-2 w-[85%]">
                <span className="text-2xl">
                  <MdOutlineMail />
                </span>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent w-full outline-none ml-2"
                  required
                />
              </div>
              {emailError && (
                <p className="text-red-600 text-sm ml-10 -mt-1 mb-4">
                  {emailError}
                </p>
              )}

              {/* Password Input */}
              <div className="mb-4 flex items-center bg-gray-100 rounded-xl outline-2 outline-purple-800/50 px-4 py-2 w-[85%] relative">
                <span className="text-2xl">
                  <IoLockClosed />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent w-full outline-none ml-2 pr-8"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 cursor-pointer text-lg"
                >
                  {showPassword ? <RiEyeCloseLine /> : <AiFillEye />}
                </span>
              </div>

              {loginError && (
                <p className="text-red-600 text-sm ml-10 -mt-1 mb-4">
                  {loginError}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-[85%] text-white py-2 rounded-full font-semibold transition ${buttonColor}`}
              >
                LOGIN
              </button>
            </form>

            <p className="mt-2.5 text-center">
              Don't have an account?{" "}
              <Link to="/register">
                <span className="text-[#d8328e]">Register</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
