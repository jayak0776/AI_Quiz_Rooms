import React, { useState } from "react";
import { LuBrainCircuit } from "react-icons/lu";
import { TiUserAdd } from "react-icons/ti";
import { useNavigate } from "react-router-dom";


const Auth = () => {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const navigate = useNavigate();


 const handleRegister = async (e) => {
  e.preventDefault();

  // 🔐 Frontend validation
  if (!fullName || !email || !password || !confirmPassword) {
    alert("All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (!agree) {
    alert("You must accept the terms & conditions");
    return;
  }

  const url = "http://localhost:8080/api/register";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    console.log("Registration Success:", data);
    alert("Registration successful! Please login.");

    navigate("/login");

    // Optional: redirect to login page
    // navigate("/login");

  } catch (error) {
    console.error("Register Error:", error);
    alert("Something went wrong. Try again!");
  }
};


  return (
    <div
      className="flex flex-col md:flex-row"
      style={{ minHeight: "calc(100vh - 4rem)" }}
    >
      {/* Left Image Panel */}
      <div className="w-full md:w-1/2 bg-main flex items-center justify-center p-6 md:p-10">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-main flex justify-center items-center shadow-sm shadow-white">
              <LuBrainCircuit className="text-6xl sm:text-8xl text-gray-300" />
            </div>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold mb-3 text-gray-300 px-2 sm:px-0">
            Your brain + AI challenges = endless fun.
          </h1>
          <p className="text-sm text-sec sm:text-md opacity-80 px-2 sm:px-0">
            Join our platform and enjoy AI-powered quiz rooms
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 bg-main flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md text-white bg-sec p-8 rounded-sm shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <TiUserAdd className="text-4xl sm:text-5xl text-main" />
            <h2 className="text-2xl sm:text-3xl text-main font-bold uppercase">Create an account</h2>
          </div>
          <p className="mb-6 text-gray-500 text-sm sm:text-md">
            Already have an account?{" "}
            <a href="/login" className="text-main hover:underline font-medium">
              Log Now
            </a>
          </p>

          <form onSubmit={handleRegister}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             
              <input
                type="text"
                placeholder="Enter your full name..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3  bg-main border placeholder-gray-500 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200 hover:border-accent"
                required
              />
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-main border placeholder-gray-500 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200 hover:border-accent"
                required
              />
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-main border placeholder-gray-500 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200 hover:border-accent"
                  required
                />
                {/* Optional: Eye icon for show/hide password */}
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Re-enter your password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-main border placeholder-gray-500 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200 hover:border-accent"
                  required
                />
                {/* Optional: Eye icon for show/hide password */}
              </div>
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-center space-x-2 text-gray-400 mt-4">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="accent-main"
                required
              />
              <span className="text-gray-500 text-sm">
                I agree to the{" "}
                <a href="#" className="text-main hover:underline">
                  Terms & Conditions
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-main cursor-pointer rounded-xs hover:opacity-90 transition font-semibold"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
