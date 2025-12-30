import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

export default function QuizRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // in seconds

  const userFullName = localStorage.getItem("fullName");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        // 1️⃣ Check if user already submitted
        const checkRes = await axiosInstance.get(`/quiz/score/check/${roomCode}/user/${userId}`);
        if (checkRes.data.submitted) {
          alert("You have already attempted this quiz.");
          return navigate("/my-rooms/dashboard");
        }

        // 2️⃣ Fetch room
        const res = await axiosInstance.get(`/room/${roomCode}`);
        const roomData = res.data;

        if (!roomData.participants?.includes(userFullName)) {
          alert("You must join the room first!");
          return navigate("/my-rooms/dashboard");
        }

        setRoom(roomData);

        const now = new Date();
        const start = new Date(roomData.startTime);
        const end = new Date(roomData.expirationTime);

        if (now >= start && now <= end) {
          const qRes = await axiosInstance.get(`/quiz/${roomCode}/questions`);
          setQuestions(qRes.data || []);
          setTimeLeft(Math.floor((end - now) / 1000)); // in seconds
        }

      } catch (err) {
        console.error(err);
        setError("Failed to fetch room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomCode, navigate, userFullName]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      alert("Time is up!");
      return handleSubmit(); // optional: auto-submit quiz
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] w-full text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        <span className="ml-3">Loading...</span>
      </div>
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!room) return null;

  const now = new Date();
  const start = new Date(room.startTime);
  const end = new Date(room.expirationTime);

  let status = "UPCOMING";
  if (now >= start && now <= end) status = "ACTIVE";
  if (now > end) status = "ENDED";

  // Convert timeLeft to mm:ss format
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle option select
  const handleSelectAnswer = (questionId, answerKey) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerKey,
    }));
  };

  // Handle submit
  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        userId,
        userFullName,
        answers: selectedAnswers,
      };

      const res = await axiosInstance.post(`/quiz/${roomCode}/submit`, payload);

      setScore(res.data.score);
      alert(`Quiz submitted! Your score will be available on the dashboard.`);
      navigate("/profile");

    } catch (err) {
      console.error("Submit failed", err);
      alert(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-28 py-8">
      <h1 className="text-2xl font-bold mb-4">Room: {room.roomCode}</h1>
      <p className={`${status === "UPCOMING" ? "text-blue-900" : status === "ENDED" ? "text-red-900" : "text-green-900"} font-semibold`}>Status: {status}</p>

      {status === "UPCOMING" && <p>Room not started yet. Please wait...</p>}
      {status === "ENDED" && <p className="py-4 text-center font-bold uppercase text-red-900 text-2xl">Room has ended.</p>}

      {status === "ACTIVE" && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quiz Questions</h2>
            {timeLeft !== null && (
              <p className="text-red-600 font-bold text-lg">
                Time Left (Min's): {formatTime(timeLeft)}
              </p>
            )}
          </div>

          {questions.length === 0 ? (
            <p>No questions available.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="p-4 border rounded-sm border-gray-300">
                  <p><b>Q{index + 1}:</b> {q.questionText}</p>
                  <div className="mt-2 space-y-1">
                    {q.options &&
                      Object.entries(q.options).map(([key, value]) => (
                        <div key={key}>
                          <input
                            type="radio"
                            id={`${q.id}-${key}`}
                            name={`question-${q.id}`}
                            value={key}
                            checked={selectedAnswers[q.id] === key}
                            onChange={() => handleSelectAnswer(q.id, key)}
                          />
                          <label htmlFor={`${q.id}-${key}`} className="ml-2 cursor-pointer">
                            {value}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || timeLeft <= 0}
                  className="mt-4 px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer disabled:bg-gray-400"
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
              </div>

              {score !== null && (
                <p className="mt-4 text-lg font-semibold">
                  Your Score will be available on the dashboard.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
