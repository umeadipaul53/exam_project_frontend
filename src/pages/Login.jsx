import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import { setToken, setRole } from "../auth/tokenStore";
import { Link } from "react-router-dom";

const Login = () => {
  const { setAccessToken, setUser } = useAuth(); // renamed for clarity
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post(
        "/student/login",
        { email, password },
        { withCredentials: true }
      );

      const { accesstoken, student } = res.data;
      if (!accesstoken || !student) {
        throw new Error("Invalid response from server");
      }

      // Sync token to memory and shared store
      setAccessToken(accesstoken);
      setToken(accesstoken);

      const userRes = await API.get("/student/user", {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });

      const user = userRes.data;
      setUser(user);
      setRole(user.role);

      Swal.fire({
        title: "Great!",
        text: "Login successful",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      setTimeout(() => {
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "staff") navigate("/staff/dashboard");
        else navigate("/student/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire(
        "Login Failed",
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-white min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6 tracking-tight">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
