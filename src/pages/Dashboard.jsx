import React from "react";
import { useAuth } from "../auth/AuthProvider";

const Dashboard = () => {
  const { user } = useAuth();
  console.log(user);
  return <div>Welcome {user?.fullname}</div>;
};

export default Dashboard;
