import React from "react";
import { Navigate } from "react-router-dom";

const withAuth = (Component) => {
  return function ProtectedComponent(props) {
    const token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/auth" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;