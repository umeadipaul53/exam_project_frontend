import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const sendLink = await API.post("/student/forgot_password", { email });
      setTimeout(() => {
        setLoading(false);
        setMessage(sendLink.data.message);
      }, 1500);

      const result = await Swal.fire({
        title: "Great!!!",
        text: sendLink.data.message,
        icon: "success",
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "ok",
      });

      if (result.isConfirmed) {
        setEmail("");
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Reset password link could not be sent. Please try again.";

      await Swal.fire("Error", message, "error");
      setLoading(false);
    }
  };
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address below and we’ll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleForgotPassword} className="space-y-4">
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
              className="w-full h-11 px-3 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-green-600 mt-4">{message}</p>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
