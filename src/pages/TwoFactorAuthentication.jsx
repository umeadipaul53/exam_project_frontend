import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import { setToken, setRole } from "../auth/tokenStore";

const TwoFactorAuthentication = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [resendAvailable, setResendAvailable] = useState(false);

  const inputRefs = useRef([]);
  const idmain = searchParams.get("id");

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendAvailable(true);
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d$/.test(value)) {
      if (index < 5) inputRefs.current[index + 1]?.focus();
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const id = formData.get("id");

    if (!id) {
      Swal.fire("Error", "Missing verification ID", "error");
      setLoading(false);
      return;
    }

    const codeDigits = inputRefs.current.map((input) => input?.value || "");
    if (codeDigits.some((d) => !/^\d$/.test(d))) {
      alert("Please enter all 6 digits.");
      setLoading(false);
      return;
    }

    const code = codeDigits.join("");

    try {
      const res = await API.post("/student/verify-two-factor-authentication", {
        id,
        code,
      });

      const { accesstoken } = res.data;
      if (!accesstoken) throw new Error("Invalid response from server");

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
        text: "Account verified",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      setTimeout(() => {
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "staff") navigate("/staff/dashboard");
        else navigate("/student/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Verification failed:", error);
      Swal.fire(
        "Two Factor Authentication Failed",
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!idmain) return;

    try {
      setLoading(true);
      await API.post("/student/resend-otp", { id: idmain }); // ✅ Customize API route if needed
      Swal.fire("OTP Sent", "A new code has been sent to your email.", "info");
      setTimer(120);
      setResendAvailable(false);
    } catch (error) {
      console.error("Resend failed:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to resend OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg max-w-sm mx-auto mt-20">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Verify Your Account
      </h2>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Enter the 6-digit code we sent to your email.
      </p>

      <form onSubmit={handleVerify}>
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              maxLength="1"
              autoFocus={i === 0}
              className="w-12 h-14 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              disabled={loading}
            />
          ))}
        </div>

        <input type="hidden" value={idmain} name="id" />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        {resendAvailable ? (
          <button
            onClick={handleResend}
            className="text-blue-600 hover:underline font-medium"
            disabled={loading}
          >
            Resend OTP
          </button>
        ) : (
          <span> {timer}s</span>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuthentication;
