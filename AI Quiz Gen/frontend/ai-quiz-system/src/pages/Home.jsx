import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome Home</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate("/createroom")}
          className="bg-purple-600 px-6 py-3 rounded-xl"
        >
          <Plus className="inline mr-2" />
          Create Room
        </button>

        <button
          onClick={() => navigate("/joinroom")}
          className="bg-gray-700 px-6 py-3 rounded-xl"
        >
          <Users className="inline mr-2" />
          Join Room
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="text-sm text-red-400 hover:underline"
      >
        Logout
      </button>
    </div>
  );
}
