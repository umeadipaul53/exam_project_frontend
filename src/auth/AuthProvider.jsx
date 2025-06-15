import React, { createContext, useContext, useEffect, useState } from "react";
import {
  setToken as syncToken,
  getToken,
  clearToken,
  subscribe,
} from "./tokenStore";
import API from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user using refresh token on first load
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const refreshRes = await API.post(
          "/student/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data?.accesstoken;
        if (!newToken) throw new Error("No access token received");

        setAccessToken(newToken);
        syncToken(newToken);

        const userRes = await API.get("/student/user", {
          headers: { Authorization: `Bearer ${newToken}` },
        });

        console.log(userRes.data);
        setUser(userRes.data);
      } catch (err) {
        console.warn(
          "User not logged in or refresh failed:",
          err?.response?.data || err.message
        );
        setAccessToken(null);
        syncToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  // Sync logout across tabs
  useEffect(() => {
    const unsubscribe = subscribe((token) => {
      if (!token) {
        setAccessToken(null);
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        logout: () => {
          clearToken();
          setAccessToken(null);
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
