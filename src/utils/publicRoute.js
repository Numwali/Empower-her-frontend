import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isLogged } = useSelector((state) => state.auth);
  let location = useLocation();

  if (isLogged) {
    return <Navigate to="/resources" state={{ from: location }} replace />;
  }
  return children;
};

export default PublicRoute;
