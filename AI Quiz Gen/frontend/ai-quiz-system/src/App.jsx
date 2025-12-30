import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import LoginPage from "./pages/auth/LoginPage";
import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Profile from "./pages/Profile"; // import Profile page
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Navbar from "./pages/Navbar";
import MyRooms from "./pages/MyRooms";
import RoomsDashboard from "./pages/RoomDashboard";
import QuizRoom from "./components/QuizRoom";
import ScoreDashboard from "./components/User/ScoreDashboard";
import QuizSolutionPage from "./components/QuizSolutionPage";

export default function App() {
  return (
    <BrowserRouter>
    <Navbar /> 
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createroom"
          element={
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/joinroom"
          element={
            <ProtectedRoute>
              <JoinRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-rooms/dashboard"
          element={
            <ProtectedRoute>
              <RoomsDashboard/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ScoreDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomCode"
          element={
            <ProtectedRoute>
              <QuizRoom/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-solution/:roomCode"
          element={
            <ProtectedRoute>
              <QuizSolutionPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
