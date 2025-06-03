import { redirect } from "next/navigation";
import React from "react";
import UserAuth from "./userAuth";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = UserAuth();
  return isAuthenticated ? children : redirect("/");
};

export default Protected;
