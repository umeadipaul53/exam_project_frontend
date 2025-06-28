import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { UserCircle2, LogOut, PlayCircle } from "lucide-react";
import API from "../../api/api";
import { clearToken } from "../../auth/tokenStore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Printer } from "lucide-react";
import Swal from "sweetalert2";

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
      secondary: "border border-gray-400 text-gray-800 hover:bg-gray-200",
      destructive: "bg-red-600 text-white hover:bg-red-700",
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
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [fetchExam, setFetchExam] = useState([]);
  const [fetchResult, setFetchResult] = useState([]);
  const [totalExamTaken, setTotalExamTaken] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [passRate, setPassRate] = useState(0);
  const [subjectScores, setSubjectScores] = useState({});
  const [topSubjects, setTopSubjects] = useState([]);
  const [ready, setReady] = useState(null);
  const [pending, setPending] = useState([]);
  const currentYear = new Date().getFullYear();

  const userId = user?.id;
  const twofactor = user?.twofactor;

  const formatDuration = (minutes) => {
    if (minutes <= 59) {
      return `${minutes} mins`;
    } else {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins ? `${hrs} hr ${mins} min` : `${hrs} hr`;
    }
  };

  const getExam = async () => {
    try {
      const res = await API.get("/student/fetch-exam", {
        withCredentials: true,
      });

      setFetchExam(res.data.data);
    } catch (error) {
      if (error.response?.data?.message) {
        setFetchExam({ message: error.response.data.message });
      } else {
        console.log("Unexpected error:", error);
      }
    }
  };

  const getResult = async () => {
    try {
      const res = await API.get("/student/fetch-result", {
        withCredentials: true,
      });

      const resultData = Array.isArray(res.data.data) ? res.data.data : [];
      const total = resultData.length;

      setFetchResult(res.data.data);

      setTotalExamTaken(total);

      const totalScore = resultData.reduce(
        (acc, res) => acc + (res.totalscore || 0),
        0
      );
      const maxScore = resultData.reduce(
        (acc, res) => acc + (res.maxscore || 0),
        0
      );
      const avg = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      setAverageScore(parseFloat(avg).toFixed(1));

      const passCount = resultData.filter(
        (res) => res.status === "Pass"
      ).length;

      setPassRate(parseFloat(total ? (passCount / total) * 100 : 0).toFixed(2));

      const scoresMap = {};

      resultData.forEach((element) => {
        if (!scoresMap[element.title]) {
          scoresMap[element.title] = { total: 0, max: 0, count: 0 };
        }

        scoresMap[element.title].total += element.totalscore || 0;
        scoresMap[element.title].max += element.maxscore || 1;
        scoresMap[element.title].count += 1;
      });

      // Update subjectScores with full map
      setSubjectScores(scoresMap);

      // Calculate top subject
      const subjectAverages = Object.entries(scoresMap).map(
        ([subject, data]) => ({
          subject,
          avg: parseFloat(((data.total / data.max) * 100).toFixed(1)),
        })
      );

      // Find highest average
      const highestAvg = Math.max(...subjectAverages.map((s) => s.avg));

      // Filter subjects with that highest average
      const top = subjectAverages
        .filter((s) => s.avg === highestAvg)
        .map((s) => s.subject); // returns an array of subject names

      setTopSubjects(top);
    } catch (error) {
      if (error.response?.data?.message) {
        setFetchResult({ message: error.response.data.message });
      } else {
        console.log("Unexpected error:", error);
      }
    }
  };

  const handleActivate2FA = async () => {
    try {
      const response = await API.patch(
        "/student/enable-two-factor",
        {},
        { withCredentials: true }
      );

      await Swal.fire({
        title: "Great!",
        text: "2FA has been enabled",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      setUser({ ...user, twofactor: true });
    } catch (err) {
      console.error(err);
      alert("Failed to enable 2FA.");
    }
  };

  const handleDeactivate2FA = async () => {
    try {
      const response = await API.patch(
        "/student/disable-two-factor",
        {},
        { withCredentials: true }
      );

      await Swal.fire({
        title: "Great!",
        text: "2FA has been disabled",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      // Update twofactor status locally
      setUser({ ...user, twofactor: false });
    } catch (err) {
      console.error(err);
      alert("Failed to disable 2FA.");
    }
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
      clearToken();

      // 2. Optionally broadcast logout to other tabs
      if (window.BroadcastChannel) {
        new BroadcastChannel("auth").postMessage({ type: "LOGOUT" });
      }

      // 3. Navigate to login
      navigate("/login");
    }
  };

  useEffect(() => {
    getExam();
    getResult();
  }, []);

  useEffect(() => {
    const checkResultStatus = async () => {
      try {
        const res = await API.get("/student/check-result-printing-status", {
          params: { regno: user.regno, class: user.class, year: currentYear },
        });

        const dataGotten = res.data.data;

        setReady(dataGotten.allDone);
        setPending(dataGotten.pendingSubjects);
      } catch (error) {
        setReady(null);
        console.log(error);
      }
    };

    checkResultStatus();
  }, [user]);

  const examMessage = !Array.isArray(fetchExam) && fetchExam?.message;
  const resultMessage = !Array.isArray(fetchResult) && fetchResult?.message;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            📘 Student Dashboard
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to={`/student/profile?id=${userId}`}
            className="flex items-center gap-2 group"
          >
            <UserCircle2 className="h-7 w-7 text-gray-600 group-hover:text-blue-600" />
            <span className="text-sm font-medium text-gray-700 group-hover:underline">
              {user?.fullname}
            </span>
          </Link>

          {twofactor === true ? (
            <Button
              onClick={handleDeactivate2FA}
              variant="secondary"
              className="text-sm text-red-600 border-red-600 hover:bg-red-100"
            >
              Disable 2FA 🔐
            </Button>
          ) : (
            <Button
              onClick={handleActivate2FA}
              variant="secondary"
              className="text-sm text-green-600 border-green-600 hover:bg-green-100"
            >
              Enable 2FA 🔐
            </Button>
          )}

          {/* ✅ Logout Button */}
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="text-sm"
          >
            Logout 🚪
          </Button>
        </div>
      </header>

      {/* Grid Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Available Tests */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">📝 Available Tests</h2>

          {examMessage && <p className="text-sm italic">{examMessage}</p>}

          {Array.isArray(fetchExam) && fetchExam.length > 0 && (
            <div className="space-y-3">
              {fetchExam.map((test, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-white border p-4 rounded-xl shadow-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">{test.title}</p>
                    <p className="text-sm text-gray-500">
                      {test.subject} • {formatDuration(test.duration)}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      if (
                        !test.class ||
                        !test.subject ||
                        !test.duration ||
                        !user?.regno
                      ) {
                        Swal.fire(
                          "Missing Info",
                          "Incomplete test or user data",
                          "warning"
                        );
                        return;
                      }
                      navigate(
                        `/student/start_exam?class=${encodeURIComponent(
                          test.class
                        )}&subject=${encodeURIComponent(
                          test.subject
                        )}&regno=${encodeURIComponent(
                          user?.regno
                        )}&duration=${encodeURIComponent(test.duration)}`
                      );
                    }}
                    size="sm"
                    variant="default"
                    className="flex items-center gap-1"
                  >
                    <PlayCircle className="w-4 h-4" /> Start
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Completed Results */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">
            🎓 Completed Exam Results
          </h2>

          {resultMessage && <p className="text-sm italic">{resultMessage}</p>}

          {Array.isArray(fetchResult) && fetchResult.length > 0 && (
            <div className="space-y-3">
              {fetchResult.map((result, idx) => (
                <div
                  key={idx}
                  className="bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-800 mb-1">
                      {result.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Started: {result.start}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted: {result.submitted}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      Status:
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          result.status === "Pass"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.status}
                      </span>
                    </p>
                  </div>

                  <div className="text-right space-y-2">
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-2xl font-bold text-green-600">
                      {result.totalscore ?? "--"} / {result.maxscore ?? "--"}
                    </p>
                  </div>
                </div>
              ))}

              {ready && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigate(
                      `/student/print_result?class=${encodeURIComponent(
                        user.class
                      )}&regno=${encodeURIComponent(
                        user?.regno
                      )}&year=${currentYear}`
                    );
                  }}
                  className="flex items-center gap-1 text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print Result
                </Button>
              )}

              {pending && (
                <div className="text-red-500 mt-2">
                  {pending.length > 0 && (
                    <ul className="list-disc ml-5">
                      <h2 className="text-3xl text-red-600">Exams not taken</h2>
                      {pending.map((subject) => (
                        <li key={subject}>{subject}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-5 mt-8">
        <h2 className="text-lg font-semibold mb-4">
          📈 Your Performance Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Exams Taken</p>
            <p className="text-2xl font-bold text-blue-700">{totalExamTaken}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-2xl font-bold text-green-700">{averageScore}%</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Pass Rate</p>
            <p className="text-2xl font-bold text-yellow-600">{passRate}%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">
              Top Performing Subject{topSubjects.length > 1 ? "s" : ""}
            </p>
            <p className="text-sm text-gray-700">
              {" "}
              <span className="font-medium text-blue-600">
                {topSubjects.length > 0
                  ? topSubjects.join(", ")
                  : "No exam has been taken"}
              </span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
