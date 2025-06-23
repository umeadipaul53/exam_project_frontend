import API from "../api/api";
import { redirect } from "react-router-dom";
import { getToken, setToken, setRole } from "./tokenStore";

export function AuthLoader(expectedRole) {
  return async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No access token");

      const res = await API.get("/student/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data;
      setRole(user.role); // store role
      if (expectedRole && user.role !== expectedRole)
        return redirect("/unauthorized");

      return { user, accessToken: token };
    } catch (err) {
      try {
        const refresh = await API.post(
          "/student/refresh-token",
          {},
          { withCredentials: true }
        );
        const newToken = refresh.data?.accesstoken;
        if (!newToken) throw new Error("No access token from refresh");

        setToken(newToken);

        const res = await API.get("/student/user", {
          headers: { Authorization: `Bearer ${newToken}` },
        });

        const user = res.data;
        setRole(user.role);
        if (expectedRole && user.role !== expectedRole)
          return redirect("/unauthorized");

        return { user, accessToken: newToken };
      } catch {
        return redirect("/login");
      }
    }
  };
}
