import React from "react";
import { useNavigate } from "react-router-dom";
import API from "./../api/api";
import { clearToken } from "../auth/tokenStore";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend to clear the refresh token and delete it from DB
      await API.post("/student/logout", null, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Error during logout:", err?.response?.data || err.message);
      // Optionally: show a toast or message to user
    } finally {
      // 1. Clear access token from memory/session/broadcast
      clearToken();

      // 2. Optionally broadcast logout to other tabs
      if (window.BroadcastChannel) {
        new BroadcastChannel("auth").postMessage({ type: "LOGOUT" });
      }

      // 3. Navigate to login
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
