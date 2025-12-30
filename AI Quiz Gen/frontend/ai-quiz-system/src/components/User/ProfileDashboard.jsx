import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

export default function ProfileDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    fullScore: 0,
    avgScore: 0,
    highest: null,
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await axiosInstance.get(`/quiz/scores/${userId}`);
        const data = res.data;
        

        if (data.length > 0) {
          const total = data.length;
          const fullScore = data.filter(a => a.score === a.outOf).length;
          const avgScore =
            data.reduce((sum, a) => sum + a.score, 0) / total;
          const highest = data.reduce((prev, curr) =>
            curr.score > prev.score ? curr : prev
          );

          setStats({
            total,
            fullScore,
            avgScore: avgScore.toFixed(2),
            highest,
          });
        }
      } catch (err) {
        console.error("Failed to fetch attempts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [userId]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] w-full text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        <span className="ml-3">Loading...</span>
      </div>

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4 bg-sec text-main px-4 py-2 rounded">
        Profile Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-main text-white p-4 rounded shadow text-center">
          <p className="font-bold text-2xl">{stats.total}</p>
          <p className="text-sm">Quizzes Attempted</p>
        </div>
        <div className="bg-main text-white p-4 rounded shadow text-center">
          <p className="font-bold text-2xl">{stats.fullScore}</p>
          <p className="text-sm">Full Score Quizzes</p>
        </div>
        <div className="bg-main text-white p-4 rounded shadow text-center">
          <p className="font-bold text-2xl">{stats.avgScore}</p>
          <p className="text-sm">Average Score</p>
        </div>
        <div className="bg-main text-white p-4 rounded shadow text-center">
          <p className="font-bold text-2xl">{stats.highest?.score || 0}</p>
          <p className="text-sm">
            Highest Score {stats.highest ? `(${stats.highest.topic})` : ""}
          </p>
        </div>
      </div>

    </div>
  );
}
