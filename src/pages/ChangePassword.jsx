import { Link } from "react-router-dom";
import API from "../api/api";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword)
      return setMessage("Passwords do not match.");

    setLoading(true);

    try {
      const res = API.put("/student/change_password", {
        token,
        newPass: newPassword,
        confirmPass: confirmPassword,
      });

      Swal.fire("Success", res.data.message, "success");
      navigate("/login");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Your password could not be changed at the moment, try again later";

      await Swal.fire("error", message, "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      setMessage("");

      try {
        const res = await API.get(`/student/change_password?token=${token}`);
        setTokenValid(true);
        setMessage(res?.data?.message || "token valid");
      } catch (error) {
        setTokenValid(false);
        const msg =
          error?.response?.data?.message ||
          "Invalid or expired token. Please request a new password reset link.";
        setMessage(msg);
      }
    };

    checkToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        {tokenValid === null ? (
          <p className="text-center text-sm text-gray-500">
            Verifying token...
          </p>
        ) : tokenValid === false ? (
          <p className="text-center text-sm text-red-500">{message}</p>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full h-11 px-3 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full h-11 px-3 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}

        {message && tokenValid && (
          <p className="text-center text-sm mt-4 text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
