import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token exists, redirect to home (no need to see login/register)
  if (token) return <Navigate to="/home" replace />;

  // Otherwise, render the page
  return children;
};

export default PublicRoute;
