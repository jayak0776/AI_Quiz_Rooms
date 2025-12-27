// src/pages/Profile.jsx
import React from "react";

export default function Profile() {
  // Static data (replace with API fetch later)
  const students = [
    { id: 1, name: "Jaya Kumar", score: 95, status: "Passed" },
    { id: 2, name: "Alex Johnson", score: 80, status: "Passed" },
    { id: 3, name: "Samantha Lee", score: 60, status: "Pending" },
    { id: 4, name: "David Smith", score: 45, status: "Failed" },
    { id: 5, name: "Priya Singh", score: 88, status: "Passed" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <h1 className="text-4xl font-bold mb-6 text-purple-400">Profile</h1>

      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.score}</td>
                <td
                  className={`px-6 py-4 whitespace-nowrap font-semibold ${
                    student.status === "Passed"
                      ? "text-green-400"
                      : student.status === "Failed"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {student.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
