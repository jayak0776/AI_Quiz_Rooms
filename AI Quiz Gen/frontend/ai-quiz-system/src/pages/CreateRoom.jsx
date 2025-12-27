import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const navigate = useNavigate();

  const [startTime, setStartTime] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [creatorName, setCreatorName] = useState("");

  const formatDateTime = (input) => {
    if (!input) return "";
    const dateObj = new Date(input);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const hh = String(dateObj.getHours()).padStart(2, "0");
    const min = String(dateObj.getMinutes()).padStart(2, "0");
    const ss = String(dateObj.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!startTime || !expirationTime || !maxParticipants || !creatorId || !creatorName) {
      alert("All fields are required!");
      return;
    }

    const payload = {
      roomCode: Math.random().toString(36).substring(2, 8).toUpperCase(), // auto-generate code
      active: true,
      startTime: formatDateTime(startTime),
      expirationTime: formatDateTime(expirationTime),
      maxParticipants: parseInt(maxParticipants),
      currentParticipants: 0,
      creatorId: parseInt(creatorId),
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

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create room");
        return;
      }

      alert("Room created successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Error creating room:", err);
      alert("Error creating room. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create New Room</h2>
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label>Start Time:</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label>Expiration Time:</label>
            <input
              type="datetime-local"
              value={expirationTime}
              onChange={(e) => setExpirationTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label>Max Participants:</label>
            <input
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label>Creator ID:</label>
            <input
              type="number"
              value={creatorId}
              onChange={(e) => setCreatorId(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label>Creator Name:</label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
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
