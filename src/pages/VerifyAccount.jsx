import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("invalid or missing verification token.");
    }

    const verify = async () => {
      try {
        const res = await API.get(`/student/verify?token=${token}`);
        setStatus("success");
        setMessage(res.data.message || "Your account has been verified!");
      } catch (error) {
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Verification failed.";
        setStatus("error");
        setMessage(errMsg);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        {status === "loading" && (
          <p className="text-blue-500 text-lg font-medium">Verifying...</p>
        )}
        {status === "success" && (
          <>
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Success!
            </h2>
            <p className="text-gray-700">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-700">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyAccount;
