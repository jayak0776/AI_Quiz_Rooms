import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ScoreDashboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await axiosInstance.get(`/quiz/scores/${userId}`);
        setScores(res.data);
        setAttempts(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch scores:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, [userId]);

  if (loading) return <p className="p-6 text-gray-700"></p>;
  if (!scores.length) return <p className="p-6 text-gray-700">No quiz attempts yet.</p>;

  // ✅ Move chart data **inside the component function**
  const barData = {
    labels: scores.map(s => s.topic),
    datasets: [
      {
        label: 'Out Of',
        data: scores.map(s => s.outOf),
        backgroundColor: 'rgba(59,130,246,0.3)',
        borderColor: 'rgba(59,130,246,0.5)',
        borderWidth: 1
      },
      {
        label: 'Score',
        data: scores.map(s => s.score),
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderColor: 'rgba(34,197,94,1)',
        borderWidth: 1
      } 
    ]
  };

  const lineData = {
    labels: scores.map(s => s.topic),
    datasets: [
      {
        label: 'Score Trend',
        data: scores.map(s => s.score),
        fill: false,
        backgroundColor: 'rgba(59,130,246,0.7)',
        borderColor: 'rgba(59,130,246,1)',
        tension: 0.4
      }
    ]
  };

  const pieData = {
    labels: scores.map(s => s.topic),
    datasets: [
      {
        label: 'Score Distribution',
        data: scores.map(s => s.score),
        backgroundColor: scores.map(() => `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},0.7)`),
        borderColor: '#fff',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className=" p-3 space-y-8">
      <h1 className="text-2xl font-bold mb-4 bg-sec text-main px-4 py-2 rounded">Quiz Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10" >
        <div className="bg-sec p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 bg-main text-white px-2" >Score per Quiz</h2>
          <Bar data={barData} options={{ responsive: true }} />
        </div>

        <div className="bg-sec p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 bg-main text-white px-2">Score Trend</h2>
          <Line data={lineData} options={{ responsive: true }} />
        </div>

       <div className="bg-sec p-4 rounded shadow md:col-span-2">
            <h2 className="text-lg font-semibold mb-2 bg-main text-white px-4">Score Distribution</h2>
            <div className="flex justify-center">
                <Pie
                data={pieData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false, // allows custom height
                }}
                height={250} // reduce height
                width={250}  // reduce width
                />
            </div>
        </div>
      </div>
      {/* Table of All Attempts */}
      <div className="bg-sec p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2 text-main">All Quiz Attempts</h2>

        {attempts.length === 0 ? (
          <p className="text-gray-700">No quiz attempts yet.</p>
        ) : (
          // ✅ Scroll wrapper (horizontal + vertical)
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full min-w-[640px] table-auto border-collapse">
              <thead className="bg-main text-white sticky top-0 z-10">
                <tr>
                  <th className="border px-2 py-1">Room Code</th>
                  <th className="border px-2 py-1">Total</th>
                  <th className="border px-2 py-1">Score</th>
                  <th className="border px-2 py-1">Topic</th>
                  <th className="border px-2 py-1">Attempt Date</th>
                </tr>
              </thead>

              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id}>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {a.roomCode}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {a.outOf}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {a.score}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {a.topic}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {new Date(a.attemptedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
