import React, { useState } from "react";
import { LuKey } from "react-icons/lu";
import { TiUserOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
  e.preventDefault();

  const url = "http://localhost:8080/api/login";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend error message
      alert(data.message || "Login failed");
      return;
    }

    // ✅ Success
    console.log("Login Success:", data);

    // If using JWT
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userid);
    localStorage.setItem("fullName", data.username);
    localStorage.setItem("email", data.email);

    alert("Login successful! Redirecting to home page...");

    navigate("/home");

    // Redirect example
    // navigate("/dashboard");

  } catch (error) {
    console.error("Login Error:", error);
    alert("Something went wrong. Try again!");
  }
};


  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Left Form Panel */}
      <div className="w-full md:w-1/2 bg-main flex items-center justify-center p-6 sm:p-6 md:p-10 lg:p-12 md:min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md text-white bg-sec p-8 sm:max-w-sm sm:p-6 md:max-w-md md:p-8 lg:p-10 rounded-sm shadow-lg">
          <div className="flex items-center gap-2 mb-4 sm:gap-3">
            <TiUserOutline className="text-4xl sm:text-5xl md:text-6xl text-main" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-main font-bold uppercase">Login to Account</h2>
          </div>
          <p className="mb-6 text-gray-500 text-sm sm:text-md">
            Don't have an account?{" "}
            <a href="/" className="text-main hover:underline font-medium">
              Register Now
            </a>
          </p>

          <form onSubmit={handleLogin}>
            <div className="grid grid-cols-1 space-y-5 sm:space-y-6 md:space-y-5">
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-main border placeholder-gray-400 placeholder:text-sm sm:placeholder:text-sm sm:px-3 sm:py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200 hover:border-accent text-sm sm:text-sm md:text-base"
                required
              />
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-main border placeholder-gray-400 placeholder:text-sm sm:placeholder:text-sm sm:px-3 sm:py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200 hover:border-accent text-sm sm:text-sm md:text-base"
                  required
                />
                {/* Optional: Eye icon for show/hide password */}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="w-full rounded-xs py-3 mt-4 bg-main cursor-pointer hover:opacity-90 transition font-semibold text-sm sm:text-sm md:text-base md:w-full lg:w-full"
              >
                Login Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Image / Quote Panel */}
      <div className="md:flex md:w-1/2 bg-main items-center justify-center text-white p-10 md:p-10 lg:p-12 md:min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="w-36 h-36 rounded-full bg-main flex justify-center items-center shadow-sm shadow-white md:w-40 md:h-40 lg:w-44 lg:h-44">
              <LuKey className="text-8xl md:text-9xl lg:text-[6rem] text-gray-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gray-300 md:text-4xl lg:text-5xl">
            Unlock your AI potential!
          </h1>
          <p className="text-md opacity-80 md:text-lg lg:text-lg">
            Log in and challenge yourself in AI-powered quiz rooms
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
