import React, { useState, useEffect } from "react";

const questions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Shakespeare", "Tolstoy", "Hemingway", "Orwell"],
    correctAnswer: "Shakespeare",
  },
];

const StartExam = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const confirm = window.confirm(
      "Are you sure you want to submit your answers?"
    ); // you can use sweet alert here
    if (confirm) {
      console.log("Submitted Answers:", selectedAnswers);
      alert("Your test has been submitted!");
      // You can send answers to your backend here
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative">
      {/* Timer */}
      <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded px-4 py-2 shadow text-sm font-medium text-gray-700">
        Time Left: <span className="font-semibold">{formatTime(timeLeft)}</span>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Question {currentIndex + 1} of {questions.length}
        </h2>

        <p className="text-gray-800 font-medium mb-6">
          {currentQuestion.question}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <label
              key={idx}
              className={`block border p-3 rounded-lg cursor-pointer transition ${
                selectedAnswers[currentQuestion.id] === option
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={selectedAnswers[currentQuestion.id] === option}
                onChange={() => handleSelect(option)}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded text-sm font-medium ${
              currentIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className={`px-4 py-2 rounded text-sm font-medium ${
              currentIndex === questions.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartExam;
