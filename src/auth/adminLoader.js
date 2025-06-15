import { redirect } from "react-router-dom";
import { AuthLoader } from "./authLoader";

export async function AdminLoader(args) {
  const user = await AuthLoader(args);

  if (user?.role !== "admin") return redirect("/login");
  return user;
}
