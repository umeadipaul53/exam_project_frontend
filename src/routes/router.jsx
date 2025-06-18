import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import SetExamQuestions from "../pages/SetExamQuestions";
import { AuthLoader } from "../auth/authLoader";
import { AdminLoader } from "../auth/adminLoader";
import AuthInit from "../pages/AuthInit";
import StudentProfile from "../pages/StudentProfile";
import Register from "../pages/Register";
import StartExam from "../pages/StartExam";
import VerifyAccount from "../pages/VerifyAccount";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-student-account",
    element: <VerifyAccount />,
  },
  {
    path: "/profile",
    element: (
      <AuthInit>
        <StudentProfile />
      </AuthInit>
    ),
    loader: AuthLoader,
  },
  {
    path: "/start_exam",
    element: (
      <AuthInit>
        <StartExam />
      </AuthInit>
    ),
    loader: AuthLoader,
  },
  {
    path: "/dashboard",
    element: (
      <AuthInit>
        <Dashboard />
      </AuthInit>
    ),
    loader: AuthLoader,
  },
  {
    path: "/set-exam-question",
    element: <SetExamQuestions />,
    loader: AdminLoader,
  },
]);

export default router;
