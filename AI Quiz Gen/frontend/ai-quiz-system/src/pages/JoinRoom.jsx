// src/pages/JoinRoom.jsx
import React, { useState } from "react";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    if (!roomCode.trim()) {
      setError("Room code is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/room/${roomCode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // optional if backend expects
        },
      });

      if (!response.ok) {
        setError("Room not found or invalid");
        return;
      }

      const data = await response.json();
      setTopic(data.topic);
      setDifficulty(data.difficulty);
      setQuestionCount(data.questionCount);
      setSuccess("Room joined successfully!");
      setError("");

    } catch (err) {
      console.error("Error joining room:", err);
      setError("Failed to join room");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-2xl text-white">
        <h2 className="text-2xl font-bold mb-4">Join Room</h2>

        <form onSubmit={handleJoinRoom} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {topic && (
            <div className="p-3 bg-gray-700 rounded-lg">
              <p><strong>Topic:</strong> {topic}</p>
              <p><strong>Difficulty:</strong> {difficulty}</p>
              <p><strong>Questions:</strong> {questionCount}</p>
            </div>
          )}

          {error && <p className="text-red-400">{error}</p>}
          {success && <p className="text-green-400">{success}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 rounded-xl font-semibold hover:bg-purple-500 transition"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
