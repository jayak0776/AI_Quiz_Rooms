import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token exists, render the protected page
  if (token) return children;

  // If no token, redirect to login/register
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
