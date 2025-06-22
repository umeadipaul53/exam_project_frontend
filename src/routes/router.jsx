import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import SetExamQuestions from "../pages/SetExamQuestions";
import { AuthLoader } from "../auth/authLoader";
import AuthInit from "../pages/AuthInit";
import StudentProfile from "../pages/StudentProfile";
import Register from "../pages/Register";
import StartExam from "../pages/StartExam";
import VerifyAccount from "../pages/VerifyAccount";
import ForgotPassword from "../pages/ForgotPassword";
import ChangePassword from "../pages/ChangePassword";
import UnAuthorized from "../pages/UnAuthorized";
import PrintResult from "../pages/PrintResult";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/unauthorized",
    element: <UnAuthorized />,
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
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/change_password",
    element: <ChangePassword />,
  },
  {
    path: "/student/profile",
    element: (
      <AuthInit>
        <StudentProfile />
      </AuthInit>
    ),
    loader: AuthLoader("user"),
  },
  {
    path: "/student/print_result",
    element: (
      <AuthInit>
        <PrintResult />
      </AuthInit>
    ),
    loader: AuthLoader("user"),
  },
  {
    path: "/student/start_exam",
    element: (
      <AuthInit>
        <StartExam />
      </AuthInit>
    ),
    loader: AuthLoader("user"),
  },
  {
    path: "/student/dashboard",
    element: (
      <AuthInit>
        <Dashboard />
      </AuthInit>
    ),
    loader: AuthLoader("user"),
  },
  {
    path: "/admin/set-exam-question",
    element: <SetExamQuestions />,
    loader: AuthLoader("admin"),
  },
]);

export default router;
