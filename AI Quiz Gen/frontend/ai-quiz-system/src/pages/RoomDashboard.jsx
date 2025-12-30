import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AllRooms from "./AllRooms";
import MyRooms from "./MyRooms";
import MyParticipants from "./MyParticipants";
import { MdDashboardCustomize } from "react-icons/md";
import { Plus } from "lucide-react";
import { GrGroup } from "react-icons/gr";

export default function RoomsDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const renderTab = () => {
    if (activeTab === "all") return <AllRooms />;
    if (activeTab === "myRooms") return <MyRooms />;
    if (activeTab === "myParticipants") return <MyParticipants />;
  };

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [expirationTime, setExpirationTime] = useState("");
    const [maxParticipants, setMaxParticipants] = useState(10);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [roomDraft, setRoomDraft] = useState(null);
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [questionCount, setQuestionCount] = useState(5);
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

        window.location.reload();
  
        // Navigate to room if you want
        // navigate(`/room/${roomCode}`);
        // navigate(`/my-rooms/dashboard`);
      } catch (err) {
        console.error(err);
        alert(err.message || "Something went wrong");
      }
    };

  return (
    <div className="px-6 md:px-12 py-8">
      {/* Header with Create Room */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl text-main uppercase font-bold flex justify-center items-center"><MdDashboardCustomize className="inline mr-2" />Rooms Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          className={`px-4 py-2  ${activeTab === "all" ? "bg-main text-white" : "bg-gray-200 cursor-pointer"}`}
          onClick={() => setActiveTab("all")}
        >
          All Rooms
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "myRooms" ? "bg-main text-white" : "bg-gray-200 cursor-pointer"}`}
          onClick={() => setActiveTab("myRooms")}
        >
          My Rooms
        </button>
        <button
          className={`px-4 py-2  ${activeTab === "myParticipants" ? "bg-main text-white" : "bg-gray-200 cursor-pointer"}`}
          onClick={() => setActiveTab("myParticipants")}
        >
          My Participants
        </button>
        </div>
      <div className="flex justify-evenly gap-4 mb-6">
         <button
          onClick={openCreateModal}
          className={`px-4 py-2 bg-main hover:bg-green-900 text-white cursor-pointer text-sm`}
        >
          <span className="flex items-center"><Plus className="inline mr-1" />Create Room</span>
        </button>
        <button
          onClick={() => setShowJoinModal(true)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-200 duration-300 cursor-pointer"
        >
          <span className="flex items-center"><GrGroup className="inline mr-1" />Join Room</span>
        </button>
      </div>
      </div>

      {/* Tab content */}
      {renderTab()}
      {/* CREATE ROOM MODAL */}
      {showCreateModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-white shadow-xl w-full max-w-lg p-6">
      <h2 className="text-2xl font-bold uppercase mb-4 text-center text-gray-800">Create New Room</h2>

      <form onSubmit={handleCreateRoom} className="space-y-5">
        {/* Start & Expiration Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Expiration Time</label>
            <input
              type="datetime-local"
              value={expirationTime}
              onChange={(e) => setExpirationTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-main"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={closeCreateModal}
            className="px-4 py-2 border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-main text-white font-medium cursor-pointer hover:bg-green-900 transition"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* SETTINGS MODAL */}
          {showSettingsModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="bg-white  shadow-xl w-full max-w-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Create Quiz Room</h2>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-main"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-main"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-main"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={closeSettingsModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                disabled={loading} // disable cancel if needed
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-5 py-2  bg-main text-white font-medium cursor-pointer hover:bg-green-900 transition ${
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold uppercase mb-4 text-center text-gray-800">Join Room</h2>

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
                  window.location.reload(); // refresh to update room list
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-main"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2ounded-md border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                  disabled={joining}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`px-5 py-2  bg-main text-white font-medium cursor-pointer hover:bg-green-900 transition ${
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


    </div>
    
  );
}