import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import { SiHomeassistant } from "react-icons/si";
import { MdMeetingRoom } from "react-icons/md";
import { AiFillProfile } from "react-icons/ai";
import { HiLogout } from "react-icons/hi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  const navLinks = [
    { name: "Lobby", path: "/home", icon: SiHomeassistant },
    { name: "Room's", path: "/my-rooms/dashboard", icon: MdMeetingRoom },
    { name: "Profile", path: "/profile", icon: AiFillProfile },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-main text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* LOGO */}
            <div className="text-2xl font-bold uppercase flex items-center cursor-pointer">
              <BsFillPatchQuestionFill className="mr-2" />
              AI Quiz
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center space-x-8 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`uppercase flex items-center transition ${
                    location.pathname === link.path
                      ? "text-white font-semibold"
                      : "text-gray-300 hover:text-sec"
                  }`}
                >
                  <link.icon className="mr-2 text-lg" />
                  {link.name}
                </Link>
              ))}

              {token && (
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-500 uppercase font-semibold flex items-center transition"
                >
                  <HiLogout className="mr-2 text-lg" />
                  Logout
                </button>
              )}
            </div>

            {/* MOBILE HAMBURGER */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-md text-white hover:bg-white/10 transition"
                aria-label="Open Menu"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-main">

          {/* HEADER */}
          <div className="flex justify-between items-center h-16 px-4 border-b border-white/10">
            <div className="flex items-center text-xl font-bold uppercase text-white">
              <BsFillPatchQuestionFill className="mr-2" />
              AI Quiz
            </div>

            {/* CLOSE ICON */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-white hover:bg-white/10 transition"
              aria-label="Close Menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* LINKS */}
          <div className="flex flex-col gap-5 px-6 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`uppercase flex items-center gap-3 text-lg transition ${
                  location.pathname === link.path
                    ? "text-sec font-semibold"
                    : "text-white hover:text-sec"
                }`}
              >
                <link.icon className="text-xl" />
                {link.name}
              </Link>
            ))}

            {token && (
              <button
                onClick={handleLogout}
                className="mt-6 uppercase text-red-400 hover:text-red-500 flex items-center gap-3 transition"
              >
                <HiLogout className="text-xl" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* SPACER */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
