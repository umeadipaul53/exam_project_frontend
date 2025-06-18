import React from "react";
import { useNavigate } from "react-router-dom";
import API from "./../api/api";
import { clearToken } from "../auth/tokenStore";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend to clear refresh token
      await API.post("/student/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Error during logout:", err.message);
    } finally {
      // Clear access token and broadcast across tabs
      clearToken();
      // Redirect to login
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
};

export default Logout;
