import React, { useState } from "react";
import { LuBrainCircuit } from "react-icons/lu";
import { TiUserAdd } from "react-icons/ti";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    console.log({ username, fullname, email, password, agree });
    // TODO: connect with API
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Image Panel */}
      <div className="w-full md:w-1/2 bg-gradient-to-tr from-indigo-900 via-purple-900 to-[#6d54b5] flex items-center justify-center text-white p-6 md:p-10">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#2c2638] flex justify-center items-center shadow-sm shadow-white">
              <LuBrainCircuit className="text-6xl sm:text-8xl text-gray-300" />
            </div>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold mb-3 text-gray-300 px-2 sm:px-0">
            Your brain + AI challenges = endless fun.
          </h1>
          <p className="text-sm sm:text-md opacity-80 px-2 sm:px-0">
            Join our platform and enjoy AI-powered quiz rooms
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 bg-[#2c2638] flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md text-white">
          <div className="flex items-center gap-2 mb-4">
            <TiUserAdd className="text-4xl sm:text-5xl" />
            <h2 className="text-2xl sm:text-3xl capitalize font-bold">Create an account</h2>
          </div>
          <p className="mb-6 text-gray-400 text-sm sm:text-md">
            Already have an account?{" "}
            <a href="/login" className="text-[#6d54b5] hover:underline font-medium">
              Log Now
            </a>
          </p>

          <form onSubmit={handleRegister}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-[#2c2638] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6d54b5]"
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-[#2c2638] border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6d54b5]"
                required
              />
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

            {/* Terms & Conditions */}
            <label className="flex items-center space-x-2 text-gray-400 mt-4">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="accent-[#6d54b5]"
                required
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-[#6d54b5] hover:underline">
                  Terms & Conditions
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-tr from-indigo-900 via-purple-900 to-[#6d54b5] cursor-pointer rounded-md hover:bg-[#6d54b5] transition font-semibold"
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
