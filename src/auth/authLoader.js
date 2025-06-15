import API from "../api/api";
import { redirect } from "react-router-dom";
import { getToken, setToken } from "./tokenStore";

export async function AuthLoader() {
  try {
    const token = getToken();
    if (!token) throw new Error("No access token");

    const user = await API.get("/student/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { user: user.data, accessToken: token };
  } catch (err) {
    console.error("Access token invalid or expired:", err.message);

    // Try refreshing
    try {
      const refresh = await API.post(
        "/student/refresh-token",
        {},
        { withCredentials: true }
      );

      const newToken = refresh.data?.accesstoken;
      if (!newToken) throw new Error("No access token in refresh response");

      setToken(newToken);

      const user = await API.get("/student/user", {
        headers: { Authorization: `Bearer ${newToken}` },
      });

      console.log(user.data);
      return { user: user.data, accessToken: newToken };
    } catch (refreshErr) {
      console.error("Refresh token failed:", refreshErr.message);
      return redirect("/login");
    }
  }
}
