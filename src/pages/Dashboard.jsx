import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserCircle2, LogOut, PlayCircle } from "lucide-react";
import API from "../api/api";
import { clearToken } from "../auth/tokenStore";
import { useNavigate } from "react-router-dom";

const sampleTests = [
  {
    name: "Math CBT 1",
    subject: "Mathematics",
    duration: "60 mins",
    status: "Not started",
  },
  {
    name: "Physics CBT",
    subject: "Physics",
    duration: "45 mins",
    status: "Completed",
  },
];

const sampleResults = [
  { name: "Physics CBT", score: "78%", status: "Passed", date: "2025-06-10" },
  { name: "Chemistry CBT", score: "65%", status: "Passed", date: "2025-06-05" },
];

const testStats = [
  { name: "Mon", tests: 2 },
  { name: "Tue", tests: 1 },
  { name: "Wed", tests: 3 },
  { name: "Thu", tests: 2 },
  { name: "Fri", tests: 4 },
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-md ${className}`}>
    {children}
  </div>
);

// Custom Button component
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

const Dashboard = () => {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <h3 className="text-2xl font-bold">Welcome {user?.fullname}</h3>
        <div className="flex items-center gap-4">
          <UserCircle2 className="h-6 w-6 text-gray-600" />
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="flex items-center gap-1 text-sm"
          >
            Logout <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Upcoming Tests</h2>
          <div className="space-y-3">
            {sampleTests.map((test, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-medium">{test.name}</p>
                  <p className="text-sm text-gray-500">
                    {test.subject} • {test.duration}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    navigate("/start_exam");
                  }}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <PlayCircle className="w-4 h-4" /> Start
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Results</h2>
          <div className="space-y-3">
            {sampleResults.map((result, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-medium">{result.name}</p>
                  <p className="text-sm text-gray-500">
                    {result.status} • {result.date}
                  </p>
                </div>
                <span className="font-semibold text-green-600">
                  {result.score}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4 mt-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Test Activity</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={testStats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard;
