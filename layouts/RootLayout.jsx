import { Outlet } from "react-router-dom";
import { AuthProvider } from "../src/auth/AuthProvider";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default RootLayout;
