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

    navigate("/home");

    // Redirect example
    // navigate("/dashboard");

  } catch (error) {
    console.error("Login Error:", error);
    alert("Something went wrong. Try again!");
  }
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Form Panel */}
      <div className="flex w-full md:w-1/2 bg-[#2c2638] items-center justify-center p-10">
        <div className="w-full max-w-md text-white">
          <div className="flex items-center gap-2 mb-2">
            <TiUserOutline className="text-5xl" />
            <h2 className="text-3xl capitalize font-bold mb-2">Login to Account</h2>
          </div>
          <p className="mb-6 text-gray-400 px-4 py-2">
            Don't have an account?{" "}
            <a href="/" className="text-[#6d54b5] hover:underline font-medium">
              Register Now
            </a>
          </p>

          <form onSubmit={handleLogin}>
            <div className="grid grid-cols-1 space-y-5">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-[#2c2638] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6d54b5]"
                required
              />
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-[#2c2638] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6d54b5]"
                  required
                />
                {/* Optional: Eye icon for show/hide password */}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-tr from-indigo-900 via-purple-900 to-[#6d54b5] cursor-pointer rounded-md hover:bg-[#6d54b5] transition font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Right Image / Quote Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-indigo-900 via-purple-900 to-[#6d54b5] items-center justify-center text-white p-10">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="w-36 h-36 rounded-full bg-[#2c2638] flex justify-center items-center shadow-sm shadow-white">
              <LuKey className="text-8xl text-gray-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gray-300">
            Unlock your AI potential!
          </h1>
          <p className="text-md opacity-80">
            Log in and challenge yourself in AI-powered quiz rooms
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
