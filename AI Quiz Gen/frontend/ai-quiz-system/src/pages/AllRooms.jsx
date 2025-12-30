import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import RoomCard from "../components/RoomCard";

export default function AllRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axiosInstance.get("/room/all-rooms"); // fetch all rooms
        setRooms(res.data.rooms);
      } catch (err) {
        console.error("Error fetching rooms", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const getRoomStatus = (room) => {
  const now = new Date();
  const start = new Date(room.startTime);
  const end = new Date(room.expirationTime);

  if (now >= start && now <= end) return "ACTIVE";
  if (now < start) return "UPCOMING";
  return "ENDED";
};

const statusPriority = {
    ACTIVE: 1,
    UPCOMING: 2,
    ENDED: 3,
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    const statusA = getRoomStatus(a);
    const statusB = getRoomStatus(b);

    return statusPriority[statusA] - statusPriority[statusB];
  });

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] w-full text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        <span className="ml-3">Loading...</span>
      </div>


  return (
    <div className="px-2 py-4">

      {rooms.length === 0 ? (
        <p className="text-gray-500">No rooms available</p>
      ) : (
        <div className="grid gap-6">
          {sortedRooms.map((room) => (
            <RoomCard
              key={room.roomCode}
              room={room}
            />
          ))}
        </div>
      )}
    </div>
  );
}
