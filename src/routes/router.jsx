import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import SetExamQuestions from "../pages/SetExamQuestions";
import { AuthLoader } from "../auth/authLoader";
import { AdminLoader } from "../auth/adminLoader";
import AuthInit from "../pages/AuthInit";

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
    path: "/profile",
    element: <Profile />,
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
