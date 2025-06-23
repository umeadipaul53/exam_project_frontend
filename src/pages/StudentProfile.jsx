import React, { useState, useEffect } from "react";
import { LogOut, Pencil, UserCircle2 } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/api";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "base",
  className = "",
}) => {
  const variantClasses =
    {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      ghost: "text-gray-600 hover:bg-gray-100",
    }[variant] || "";

  const sizeClasses =
    {
      base: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-sm",
    }[size] || "";

  return (
    <button
      onClick={onClick}
      className={`rounded-md transition font-medium ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const StudentProfile = () => {
  const { logout } = useAuth();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [fullname, setFullname] = useState("");
  const [regno, setRegno] = useState("");
  const [myProfile, setMyProfile] = useState({});
  const navigate = useNavigate();

  const handleFetchProfile = async () => {
    const res = await API.get(`/student/student-profile?id=${id}`);
    const userData = res.data;

    console.log(userData);

    setMyProfile(userData);
    setUsername(userData.username);
    setEmail(userData.email);
    setPhone(userData.phone);
    setStudentClass(userData.class);
    setRegno(userData.regno);
    setFullname(userData.fullname);
  };

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
      logout();

      // 2. Optionally broadcast logout to other tabs
      if (window.BroadcastChannel) {
        new BroadcastChannel("auth").postMessage({ type: "LOGOUT" });
      }

      // 3. Navigate to login
      navigate("/login");
    }
  };

  useEffect(() => {
    handleFetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <UserCircle2 className="w-16 h-16 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {username || "Student Username"}
              </h2>
              <p className="text-sm text-gray-500">
                🎓 {regno || "Student regno"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              className="text-sm flex items-center gap-1"
              onClick={() => {
                navigate(`/student/edit_student_account?id=${id}`);
              }}
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-sm text-gray-700 border-gray-300 hover:bg-gray-200 hover:text-black flex items-center gap-1 rounded-full px-4 py-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Full Name</p>
            <p className="text-lg font-medium text-gray-800">{fullname}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-lg font-medium text-gray-800">{email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            <p className="text-lg font-medium text-gray-800">{phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Class</p>
            <p className="text-lg font-medium text-gray-800">{studentClass}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
