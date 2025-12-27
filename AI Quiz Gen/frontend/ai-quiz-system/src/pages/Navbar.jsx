// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token"); // check login

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Create Room", path: "/createroom" },
    { name: "Join Room", path: "/joinroom" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 text-2xl font-bold text-purple-500">
            AI Quiz
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${
                  location.pathname === link.path
                    ? "text-purple-400 font-semibold"
                    : "text-white hover:text-purple-400"
                } transition`}
              >
                {link.name}
              </Link>
            ))}
            {token && (
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-500 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 ${
                location.pathname === link.path
                  ? "text-purple-400 font-semibold"
                  : "text-white hover:text-purple-400"
              } transition`}
            >
              {link.name}
            </Link>
          ))}
          {token && (
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-red-400 hover:text-red-500 transition w-full text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
