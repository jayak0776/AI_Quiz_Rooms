import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

export default function ProfileInfoDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/user/${userId}`);
        setUser(res.data); // should match the structure returned from backend
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
    else setLoading(false);
  }, [userId]);

  if (loading) return <p className="p-6 text-gray-700"></p>;
  if (!user) return <p className="p-6 text-gray-700">User not found</p>;

  return (
    <div className="p-6 bg-main rounded shadow space-y-2">
      <h1 className="text-2xl font-bold text-white ">Profile Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-sec text-main p-4 rounded shadow">
          <p className="text-gray-500 font-medium text-xs">Full Name</p>
          <p className="text-sm font-semibold text">{user.fullName}</p>
        </div>

        <div className="bg-sec text-main p-4 rounded shadow">
          <p className="text-gray-500 font-medium text-xs" >Email</p>
          <p className="text-sm font-semibold text">{user.email}</p>
        </div>

        <div className="bg-sec text-main p-4 rounded shadow">
          <p className="text-gray-500 font-medium text-xs">User ID</p>
          <p className="text-sm font-semibold">{user.id}</p>
        </div>

        <div className="bg-sec text-main p-4 rounded shadow">
          <p className="text-gray-500 font-medium text-xs">Joined On</p>
          <p className="text-sm font-semibold">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
