import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { setToken } from "../auth/tokenStore";

const AuthInit = ({ children }) => {
  const { accessToken, user } = useLoaderData();
  const { setAccessToken, setUser } = useAuth();

  useEffect(() => {
    if (accessToken) {
      setToken(accessToken); // persist in tokenStore
      setAccessToken(accessToken);
    }
    if (user) {
      setUser(user);
    }
  }, [accessToken, user]);

  return children;
};

export default AuthInit;
