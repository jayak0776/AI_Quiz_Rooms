import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { MdMeetingRoom } from "react-icons/md";

export default function RoomCard({ room, onRoomUpdate }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [joining, setJoining] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // ✅ FIXED DATE & STATUS LOGIC
  const now = new Date();
  const start = room.startTime ? new Date(room.startTime) : null;
  const end = room.expirationTime ? new Date(room.expirationTime) : null;

  let status = "UPCOMING";
  if (!start || !end || isNaN(start) || isNaN(end)) {
    status = "UPCOMING";
  } else if (now < start) {
    status = "UPCOMING";
  } else if (now >= start && now <= end) {
    status = "ACTIVE";
  } else if (now > end) {
    status = "ENDED";
  }

  // Current user info
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const fullName = localStorage.getItem("fullName");

  // Check if user has already joined
  const alreadyJoined = room.participants.includes(fullName);

  // Check if user has attempted the quiz
  useEffect(() => {
    const checkAttempt = async () => {
      try {
        const res = await axiosInstance.get(
          `/quiz/score/check/${room.roomCode}/user/${userId}`
        );
        setHasAttempted(res.data.submitted);
      } catch (err) {
        console.error("Error checking quiz attempt:", err);
      }
    };
    if (userId) checkAttempt();
  }, [room.roomCode, userId]);

  // Join Room function
  const handleJoinRoom = async () => {
    if (!userId || !email || !fullName) {
      alert("User information missing. Please log in again.");
      return;
    }

    if (status === "ENDED") {
      // Replace `/quiz-solution/:roomCode` with your route
      navigate(`/quiz-solution/${room.roomCode}`);
    }

    if (room.currentParticipants >= room.maxParticipants) {
      alert("Room is full!");
      return;
    }

    if (alreadyJoined) {
      alert("You have already joined this room!");
      return;
    }

    try {
      setJoining(true);
      const res = await axiosInstance.post(`/room/join/${room.roomCode}`, {
        userId,
        email,
        fullName,
      });

      alert("Joined room successfully!");
      onRoomUpdate?.(res.data);

      if (status === "ACTIVE") {
        navigate(`/room/${room.roomCode}`);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to join room", err);
      alert(err.response?.data?.message || "Failed to join room");
    } finally {
      setJoining(false);
    }
  };

  // Button logic
  let actionText = "Join Room";
  let actionDisabled = false;

  if (status === "ENDED") {
    actionText = "Expired";
    actionDisabled = true;
  } else if (hasAttempted) {
    actionText = "Attempted";
    actionDisabled = true;
  } else if (alreadyJoined && status === "UPCOMING") {
    actionText = "Waiting for Start";
    actionDisabled = true;
  } else if (alreadyJoined && status === "ACTIVE") {
    actionText = "Enter Quiz";
  } else if (joining || room.currentParticipants >= room.maxParticipants) {
    actionDisabled = true;
  }

  const handleActionClick = async () => {
    if (hasAttempted) return; // already attempted

    if (status === "ENDED") {
      navigate(`/quiz-solution/${room.roomCode}`);
      return;
    }

    if (!alreadyJoined) {
      await handleJoinRoom();
    } else if (status === "ACTIVE") {
      navigate(`/room/${room.roomCode}`);
    } else {
      alert("Quiz has not started yet. Please wait.");
    }
  };

  return (
    <>
      {/* ===== CARD ===== */}
      <div className="bg-sec rounded-sm p-5 py-2 shadow-sm max-sm:p-3 max-sm:py-2">
        <div className="flex justify-between items-center  max-sm:items-start max-sm:gap-2">
          <h2 className="font-bold text-md uppercase flex justify-center items-center text-gray-700 max-sm:flex-col max-sm:items-start max-sm:gap-1 max-sm:text-sm max-sm:break-words">
            <MdMeetingRoom className="inline mr-2 text-2xl" /><span className="text-main md:px-2"> {room.topic} </span> Quiz -{" "}
            Room Code: {room.roomCode}
          </h2>
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              status === "ACTIVE"
                ? "bg-red-100 text-red-700"
                : status === "UPCOMING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {status === "ACTIVE" ? "LIVE" : status}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4 text-sm text-gray-700 max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 max-sm:text-sm">
          <p>
            <b>Created By:</b> {room.creatorName}
          </p>
          <p>
            <b>Participants:</b> {room.currentParticipants}/{room.maxParticipants}
          </p>
          <p>
            <b>Start:</b> {start?.toLocaleString()}
          </p>
          <p>
            <b>End:</b> {end?.toLocaleString()}
          </p>
        </div>

        <div className="mt-4 flex gap-5 max-sm:flex-col max-sm:gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="text-white px-4 py-2 bg-main text-sm hover:underline hover:bg-green-900 duration-300 font-medium cursor-pointer max-sm:w-full"
          >
            View Details
          </button>

          <button
            onClick={handleActionClick}
            disabled={actionDisabled}
            className={`px-3 py-1 text-white text-sm cursor-pointer ${
              actionDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : hasAttempted
                ? "bg-blue-600"
                : alreadyJoined
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-green-600 hover:bg-green-700"
            } max-sm:w-full`}
          >
            {actionText}
          </button>
          {actionText === "Expired" && (
            <button
              onClick={() => navigate(`/quiz-solution/${room.roomCode}`)}
              className="text-green-900 text-sm hover:opacity-65 underline hover:text-green-900 font-medium cursor-pointer max-sm:text-sm max-sm:w-full"
            >
              Check Solutions
            </button>
          )}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 max-sm:items-start max-sm:pt-6">
            
            {/* MODAL */}
            <div
              className="
                bg-sec w-full max-w-2xl shadow-lg relative
                p-6 px-14
                max-sm:px-4 max-sm:p-4 max-sm:max-w-full max-sm:mx-2
                max-h-[85vh] overflow-y-auto
              "
            >
              <h2 className="text-xl font-bold uppercase mb-4">
                Room Details — {room.roomCode}{" "}
                <span className="px-2 text-main">{room.topic}</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 max-sm:grid-cols-1">
                <p><b>Creator Name:</b> {room.creatorName}</p>
                <p><b>Creator ID:</b> {room.creatorId}</p>
                <p><b>Status:</b> {status}</p>
                <p><b>Active:</b> {room.active ? "Yes" : "No"}</p>
                <p><b>Start Time:</b> {start?.toLocaleString()}</p>
                <p><b>End:</b> {end?.toLocaleString()}</p>
                <p><b>Max Participants:</b> {room.maxParticipants}</p>
                <p><b>Current Participants:</b> {room.currentParticipants}</p>
              </div>

              <div className="mt-4">
                <p className="font-medium">Participants</p>
                {room.participants.length === 0 ? (
                  <p className="text-gray-400 text-sm">No participants yet</p>
                ) : (
                  <ul className="list-disc ml-5 text-sm max-sm:ml-4 max-sm:text-xs max-h-40 overflow-y-auto">
                    {room.participants.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-3">
                <button
                  onClick={handleActionClick}
                  disabled={actionDisabled}
                  className={`px-4 py-2 text-white cursor-pointer ${
                    actionDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : hasAttempted
                      ? "bg-blue-600"
                      : alreadyJoined
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-green-600 hover:bg-green-700"
                  } max-sm:w-full`}
                >
                  {actionText}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-main text-white hover:bg-green-900 cursor-pointer max-sm:w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

    </>
  );
}