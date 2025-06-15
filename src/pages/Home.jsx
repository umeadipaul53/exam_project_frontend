import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const upcomingTests = [
    { subject: "English", date: "June 15", time: "10:00 AM" },
    { subject: "Mathematics", date: "June 18", time: "1:00 PM" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">📘 CBT Platform</h1>
        <nav className="space-x-4">
          <button
            type="button"
            onClick={() => {
              navigate("/login");
            }}
            className="bg-blue-600 w-full my-4 text-white font-semibold text-sm py-2 cursor-pointer hover:bg-blue-800 rounded-md mr-4"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/register");
            }}
            className="bg-blue-600 w-full my-4 text-white font-semibold text-sm py-2 cursor-pointer hover:bg-blue-800 rounded-md mr-4"
          >
            Sign up
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 text-center bg-blue-100">
        <h2 className="text-3xl font-bold mb-2">Welcome to CBT Testing</h2>
        <p className="text-gray-700 mb-4">
          Take your exams online securely and efficiently
        </p>
      </section>

      {/* Upcoming Tests */}
      <section className="px-6 py-10">
        <h3 className="text-xl font-semibold mb-4">📅 Upcoming Tests</h3>
        <ul className="space-y-3">
          {upcomingTests.map((test, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium">{test.subject}</h4>
                <p className="text-sm text-gray-500">
                  {test.date} at {test.time}
                </p>
              </div>
              <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                Start Test
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 px-6 py-10">
        <h3 className="text-xl font-semibold mb-4">🛠 How It Works</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Register and log in to your student account</li>
          <li>View your test schedule</li>
          <li>Start and complete your CBTs</li>
        </ol>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t p-4 text-sm text-center text-gray-500">
        © 2025 CBT Platform |{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Contact
        </a>
      </footer>
    </div>
  );
};

export default Home;
