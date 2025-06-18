import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import { setToken } from "../auth/tokenStore";

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
      setUser(student);

      Swal.fire({
        title: "Great!",
        text: "Login successful",
        icon: "success",
        timer: 1500,
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard"); // Navigate only after user clicks OK
        }
      });
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
    <div className="bg-white max-w-[900px] mx-auto px-20 py-10 my-12">
      <section className="py-6 rounded-sm">
        <form onSubmit={handleLogin}>
          <h1 className="text-xl font-semibold mb-4">Account Access</h1>

          <div className="flex flex-col my-3">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your Email"
              className="bg-gray-100 h-10 px-2 border border-gray-300 focus:outline-purple-300 rounded-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col my-3">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="bg-gray-100 h-10 px-2 border border-gray-300 focus:outline-purple-300 rounded-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 w-full my-4 text-white font-semibold text-sm py-2 cursor-pointer hover:bg-blue-800 rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
