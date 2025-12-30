import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios";

export default function QuizSolutionPage() {
  const { roomCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get(`/quiz/${roomCode}/questions`);
        setQuestions(res.data); // make sure API returns [{ question, options, correctOption }]
      } catch (err) {
        console.error("Failed to fetch quiz solution:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [roomCode]);

  if (loading) return <p className="p-6">Loading quiz solution...</p>;
  if (!questions.length) return <p className="p-6">No questions found.</p>;

  return (
    <div className="px-16 py-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Solution — {roomCode}</h1>
      {questions.map((q, i) => (
            <div key={i} className="mb-4 p-4 bg-gray-100 rounded">
                <p className="font-medium">{i + 1}. {q.questionText}</p>
                <ul className=" ml-5 mt-2">
                {Object.entries(q.options).map(([key, value]) => (
                    <li key={key}>
                    <span className={key === q.correctAnswer ? "text-green-600 font-bold" : ""}>
                        {key}: {value}
                    </span>
                    </li>
                ))}
                </ul>
            </div>
            ))}

    </div>
  );
}
