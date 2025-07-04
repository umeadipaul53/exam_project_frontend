import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { waitForToken } from "../../auth/tokenStore";
import API from "../../api/api";

const StartExam = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { studentClass, subject, regno, duration } = location.state || {};
  const timeAlotted = duration * 60;

  const [isStarting, setIsStarting] = useState(false);
  const [lastSelected, setLastSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timeAlotted);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();

  const currentQuestion = questions[currentIndex];
  const autoSubmitRef = useRef();

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleJumpTo = (index) => setCurrentIndex(index);

  // Countdown
  useEffect(() => {
    if (!sessionId || questions.length === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          autoSubmitRef.current?.(); // trigger exactly when timeLeft becomes 0
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, questions]);

  // Submit all answers
  const submitAllAnswers = async () => {
    console.log("📤 Submitting all answers...");
    const updatedAnswers = { ...selectedAnswers };

    if (
      lastSelected &&
      (!selectedAnswers[lastSelected.questionId] ||
        selectedAnswers[lastSelected.questionId] !== lastSelected.option)
    ) {
      updatedAnswers[lastSelected.questionId] = lastSelected.option;
    }

    const entries = Object.entries(updatedAnswers);

    if (entries.length === 0) {
      console.warn("⚠️ No answers to submit!");
      return;
    }

    const promises = entries.map(([questionId, selectedOption]) =>
      API.patch("/student/submit-answer", {
        sessionId,
        questionId,
        selectedOption,
      }).catch((err) =>
        console.error(`Failed to submit answer for Q${questionId}`, err)
      )
    );

    await Promise.all(promises);
  };

  const finishExam = async () => {
    console.log("✅ Finalizing exam...");
    try {
      await API.patch("/student/finish-exam", { sessionId });
      console.log("✅ Exam finalized successfully.");
    } catch (err) {
      console.error("Failed to finalize exam", err);
    }
  };

  const handleAutoSubmit = async () => {
    console.log("⏰ Time up! Auto-submitting...");
    setSubmitting(true);
    try {
      await submitAllAnswers();
      await finishExam();
      localStorage.removeItem("sessionId");
      localStorage.removeItem("answers");
      localStorage.removeItem("currentIndex");
      localStorage.removeItem("lastSelected");

      alert("Time's up! Exam submitted.");
      navigate("/student/dashboard");
    } catch (err) {
      alert("Failed to autosubmit exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  autoSubmitRef.current = handleAutoSubmit;

  const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit?")) return;

    console.log("🚀 Submitting test...");
    try {
      await submitAllAnswers();
      await finishExam();
      localStorage.removeItem("sessionId");
      localStorage.removeItem("answers");
      localStorage.removeItem("currentIndex");
      localStorage.removeItem("lastSelected");
      alert("Your exam was submitted successfully.");
      navigate("/student/dashboard");
    } catch (err) {
      alert("Failed to submit exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = (option) => {
    const questionId = currentQuestion._id;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
    const latest = { questionId, option };
    setLastSelected(latest);
    localStorage.setItem("lastSelected", JSON.stringify(latest));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const fetchQuestions = async () => {
    try {
      const res = await API.get(
        `/student/fetch_questions?regno=${encodeURIComponent(
          regno
        )}&subject=${encodeURIComponent(subject)}`
      );

      setQuestions(res.data.data.questions);
    } catch {
      setErrorMsg("Failed to fetch questions.");
    }
  };

  useEffect(() => {
    let hasMounted = false;
    const loadOrStartExam = async () => {
      if (hasMounted) return;
      hasMounted = true;
      if (isStarting) return;
      setIsStarting(true);

      try {
        const existingSession = localStorage.getItem("sessionId");
        if (existingSession) {
          setSessionId(existingSession);
          await fetchQuestions();

          const savedAnswers = localStorage.getItem("answers");
          const savedIndex = localStorage.getItem("currentIndex");
          if (savedAnswers) setSelectedAnswers(JSON.parse(savedAnswers));
          if (savedIndex) setCurrentIndex(parseInt(savedIndex));

          const savedLast = localStorage.getItem("lastSelected");
          if (savedLast) {
            const parsed = JSON.parse(savedLast);
            setLastSelected(parsed);
            if (parsed.questionId && parsed.option) {
              setSelectedAnswers((prev) => ({
                ...prev,
                [parsed.questionId]: parsed.option,
              }));
            }
          }
          return;
        }

        await waitForToken();
        try {
          const res = await API.post("/student/start-exam", {
            regno,
            subject,
            class: studentClass,
            year: currentYear,
          });

          const newSessionId = res.data.sessionId;
          setSessionId(newSessionId);
          localStorage.setItem("sessionId", newSessionId);
          await fetchQuestions();
        } catch (err) {
          if (err.response?.status === 403) {
            const message =
              err.response.data.message || "You have already taken this exam.";
            setErrorMsg(message);

            // Optional: Navigate back to dashboard after showing error
            setTimeout(() => navigate("/student/dashboard"), 5000);
          } else {
            setErrorMsg("Unexpected error while starting exam.");
          }
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Could not start exam.");
      } finally {
        setLoading(false);
        setIsStarting(false);
      }
    };

    loadOrStartExam();
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  useEffect(() => {
    localStorage.setItem("currentIndex", currentIndex.toString());
  }, [currentIndex]);

  useEffect(() => {
    if (lastSelected) {
      localStorage.setItem("lastSelected", JSON.stringify(lastSelected));
    }
  }, [lastSelected]);

  // UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Starting Exam...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-center p-4">
        <div className="max-w-md bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Notice</h2>
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 md:p-10 relative">
      <div className="absolute top-6 right-6 bg-white/80 backdrop-blur border border-gray-300 rounded-xl px-5 py-3 shadow-md text-sm font-semibold text-gray-800">
        ⏱ Time Left:{" "}
        <span className="text-blue-600 font-bold">{formatTime(timeLeft)}</span>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-10 mt-12 md:mt-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            📝 Question {currentIndex + 1} of {questions.length}
          </h2>
          <span className="text-sm font-medium text-gray-500">
            {currentQuestion.subject?.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-900 text-lg font-medium mb-6">
          {currentQuestion.question}
        </p>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition duration-200 text-gray-800 font-medium
              ${
                selectedAnswers[currentQuestion._id] === option
                  ? "border-blue-600 bg-blue-50 ring-1 ring-blue-400"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion._id}`}
                value={option}
                checked={selectedAnswers[currentQuestion._id] === option}
                onChange={() => handleSelect(option)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-full md:w-auto px-6 py-3 rounded-lg text-sm font-semibold transition
              ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              }`}
          >
            ← Prev
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className={`w-full md:w-auto px-6 py-3 rounded-lg text-sm font-semibold transition
              ${
                currentIndex === questions.length - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Next →
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting || timeLeft === 0}
            className={`px-8 py-3 rounded-xl font-semibold text-md shadow transition
              ${
                timeLeft === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            {submitting ? "Submitting..." : "✅ Submit Test"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-10">
        <div className="grid grid-cols-6 md:grid-cols-10 gap-2 justify-center">
          {questions.map((q, index) => {
            const answered = selectedAnswers[q._id];
            const isCurrent = index === currentIndex;
            return (
              <button
                key={q._id}
                onClick={() => handleJumpTo(index)}
                className={`w-10 h-10 text-sm rounded-md font-medium border
                ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-700"
                    : answered
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-6 w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${
                (Object.keys(selectedAnswers).length / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StartExam;
