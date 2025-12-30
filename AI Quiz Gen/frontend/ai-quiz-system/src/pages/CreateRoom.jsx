import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const navigate = useNavigate();

  const [startTime, setStartTime] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [creatorName, setCreatorName] = useState("");

 const handleCreateRoom = async (e) => {
  e.preventDefault();

  if (!startTime || !expirationTime || !maxParticipants || !creatorId || !creatorName) {
    alert("All fields are required!");
    return;
  }

  if (expirationTime <= startTime) {
    alert("Expiration time must be after start time");
    return;
  }

  const payload = {
    roomCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    active: true,
    startTime,
    expirationTime,
    maxParticipants: Number(maxParticipants),
    currentParticipants: 0,
    creatorId: Number(creatorId),
    creatorName: creatorName.trim(),
    participants: [],
  };

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8080/api/room/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      console.error("Backend error:", data);
      alert(data.message || "Failed to create room");
      return;
    }

    alert("Room created successfully!");
    navigate("/home");

  } catch (error) {
    console.error("Create room error:", error);
    alert("Server error");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Room
        </h2>

        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label>Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
              required
            />
          </div>

          <div>
            <label>Expiration Time</label>
            <input
              type="datetime-local"
              value={expirationTime}
              onChange={(e) => setExpirationTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
              required
            />
          </div>

          <div>
            <label>Max Participants</label>
            <input
              type="number"
              min="1"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
              required
            />
          </div>

          <div>
            <label>Creator ID</label>
            <input
              type="number"
              value={creatorId}
              onChange={(e) => setCreatorId(e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
              required
            />
          </div>

          <div>
            <label>Creator Name</label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 py-2 rounded font-semibold hover:bg-purple-700 transition"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
}
