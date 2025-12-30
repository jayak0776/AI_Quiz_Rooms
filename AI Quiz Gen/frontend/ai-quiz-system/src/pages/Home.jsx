import React, { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MdBatteryUnknown } from "react-icons/md";
import { MdNotStarted } from "react-icons/md";

export default function Home() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [_roomDraft, setRoomDraft] = useState(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinRoomCode, setJoinRoomCode] = useState("");
    const [joining, setJoining] = useState(false);


  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  const handleCreateRoom = (e) => {
    e.preventDefault();

  
    setShowCreateModal(false);
    setShowSettingsModal(true);
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
    setRoomDraft(null);
  };

  /* 🔐 ROOM CREATION + QUESTION GENERATION */
const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    
    const creatorId = localStorage.getItem("userId");
    const creatorName = localStorage.getItem("fullName");

    if (!creatorId || !creatorName) {
      alert("User not logged in");
      return;
    }

    const roomDraft = {
      startTime,
      expirationTime,
      maxParticipants: Number(maxParticipants),
      currentParticipants: 0,
      creatorId: Number(creatorId),
      creatorName: creatorName.trim(),
      topic: topic.trim(),
      difficulty,
      questionCount: Number(questionCount),
    };

    console.log("Room Draft:", roomDraft);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please login again.");
      return;
    }

    try {
      // ---------------- STEP 1: CREATE ROOM ----------------
      const roomRes = await fetch("http://localhost:8080/api/room/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomDraft),
      });
      console.log("Room Creation Response Status:", roomRes);

      const roomData = await roomRes.json();
      const roomCode = roomData.roomCode; // now works correctly


      // ---------------- STEP 2: GENERATE QUESTIONS ----------------
      const res = await fetch("http://localhost:8080/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: topic.trim(),
          difficulty,
          questionCount: Number(questionCount),
          roomCode,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate AI quiz");

      const data = await res.json();
      console.log("AI Quiz Response:", data);

      alert("Room and AI quiz created successfully!");
      setShowSettingsModal(false);
      setRoomDraft(null);

      // Navigate to room if you want
      navigate(`/my-rooms/dashboard`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <>
  <div
    className="relative bg-white text-main px-4 sm:px-6 md:px-8 py-6 md:py-10 overflow-hidden"
    style={{ minHeight: "calc(100vh - 4rem)" }}
  >
    <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 place-items-center gap-6 sm:gap-8 md:gap-10">

      {/* HERO SECTION */}
      <div className="w-full bg-sec text-center my-4 md:col-span-2 flex items-center justify-center p-6 sm:p-8 md:p-10 shadow-md ">
        <div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-main leading-tight uppercase">
            <span className="flex justify-center items-center">
              <MdBatteryUnknown className="inline mr-2 text-3xl sm:text-3xl md:text-6xl" />
              Welcome Savant!
            </span>
          </h1>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            Quickly create or join quiz rooms — challenge friends and learn together with AI-powered questions.
          </p>
        </div>
      </div>
      
      <hr className="md:col-span-2 border-gray-200 my-6  w-full mx-auto" />
      {/* ACTION HEADING */}
      <div className="md:col-span-2 text-center mb-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-main uppercase tracking-wide">
          <span className="flex justify-center items-center"><MdNotStarted className="inline mr-2 text-3xl sm:text-4xl md:text-6xl"  />Get Started</span>
        </h2>
        <p className="mt-2 text-gray-400 text-xs sm:text-sm max-w-xl mx-auto">
          Create a new quiz room or join an existing one using a room code
        </p>
      </div>

      {/* CREATE ROOM CARD */}
      <div
          onClick={openCreateModal}
          role="button"
          tabIndex={0}
          className="group cursor-pointer bg-sec rounded-md p-6 sm:p-8 flex flex-col gap-4 shadow-md w-full sm:max-w-md md:max-w-xs lg:max-w-sm ring-1 ring-white/5 transition-all duration-200 hover:shadow-lg"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-main text-white rounded-full flex items-center justify-center shadow-lg mx-auto transition-transform duration-500 ease-in-out group-hover:rotate-90">
            <Plus className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h2 className="text-lg sm:text-xl font-bold uppercase text-center text-main">
            Create Room
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm text-center">
            Create a new quiz room and invite friends to play together.
          </p>
        </div>


      {/* JOIN ROOM CARD */}
      <div
        onClick={() => setShowJoinModal(true)}
        role="button"
        tabIndex={0}
        className="cursor-pointer bg-sec rounded-md p-6 sm:p-8 flex flex-col gap-4 shadow-md w-full sm:max-w-md md:max-w-xs lg:max-w-sm ring-1 ring-white/5 transition-transform duration-300 hover:scale-100 hover:shadow-lg"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-main text-white rounded-full flex items-center justify-center shadow-lg mx-auto">
          <Users className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold uppercase text-center text-main">
          Join Room
        </h2>
        <p className=" text-gray-400 text-xs sm:text-sm text-center">
          Join an existing room using a room code to start playing.
        </p>
      </div>
    </div>
  </div>

  {/* CREATE ROOM MODAL */}
   {showCreateModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
    <div className="bg-white shadow-xl w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6 md:p-8  mx-2">
      <h2 className="text-xl sm:text-2xl font-bold uppercase mb-4 text-center text-gray-800">Create New Room</h2>

      <form onSubmit={handleCreateRoom} className="space-y-5">
        {/* Start & Expiration Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Expiration Time</label>
            <input
              type="datetime-local"
              value={expirationTime}
              onChange={(e) => setExpirationTime(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
              required
            />
          </div>
        </div>

        {/* Max Participants */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Max Participants</label>
          <input
            type="number"
            min={1}
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            placeholder="Enter maximum participants"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
            required
          />
        </div>

        {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={closeCreateModal}
            className="px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 transition "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 sm:px-5 py-2 sm:py-3 bg-main text-white font-medium cursor-pointer hover:bg-green-900 transition"
          >
            Click to Continue
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* SETTINGS MODAL */}
          {showSettingsModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white shadow-xl w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6 md:p-8 mx-2">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-gray-800">Create Quiz Room</h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true); // start loading
              try {
                await handleSettingsSubmit(e); // your existing API call
              } finally {
                setLoading(false); // stop loading after API finishes
              }
            }}
            className="space-y-5"
          >
            {/* Topic */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Quiz Topic</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the topic for the quiz..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
                required
              />
            </div>

            {/* Difficulty & Question Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
                  required
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-medium">Number of Questions</label>
                <input
                  type="number"
                  min={1}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  placeholder="Enter number of questions"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={closeSettingsModal}
                className="px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 transition "
                disabled={loading} // disable cancel if needed
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-4 sm:px-5 py-2 sm:py-3 bg-main text-white font-medium cursor-pointer hover:bg-green-900 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading} // disable while API is running
              >
                {loading ? "Creating..." : "Create Room"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="bg-white shadow-xl w-full sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 mx-2">
            <h2 className="text-xl sm:text-2xl font-bold uppercase mb-4 text-center text-gray-800">Join Room</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!joinRoomCode.trim()) return alert("Please enter Room ID!");
                const userId = localStorage.getItem("userId");
                const fullName = localStorage.getItem("fullName");
                const email = localStorage.getItem("email");
                if (!userId || !fullName || !email) return alert("User info missing!");

                setJoining(true);
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch(`http://localhost:8080/api/room/join/${joinRoomCode}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId, fullName, email }),
                  });

                  if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Failed to join room");
                  }

                  alert("Joined room successfully!");
                  setShowJoinModal(false);
                  setJoinRoomCode("");
                  navigate(`/my-rooms/dashboard`);
                } catch (err) {
                  console.error(err);
                  alert(err.message || "Something went wrong");
                } finally {
                  setJoining(false);
                }
              }}
              className="space-y-5"
            >
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Room ID</label>
                <input
                  type="text"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value)}
                  placeholder="Enter Room ID"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-main text-sm sm:text-base"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                  disabled={joining}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`px-4 sm:px-5 py-2 sm:py-3 bg-main text-white font-medium cursor-pointer hover:bg-green-900 transition ${
                    joining ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={joining}
                >
                  {joining ? "Joining..." : "Join Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
</>

  );
}
