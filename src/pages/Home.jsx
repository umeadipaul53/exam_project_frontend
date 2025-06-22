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
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 p-4 md:px-10 items-center">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
          📘 CBT Platform
        </h1>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-100 to-white py-20 px-6">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-4 leading-tight">
          Secure Online CBT Exams
        </h2>
        <p className="text-lg text-gray-600 max-w-xl">
          Take your exams from anywhere with a seamless, efficient, and secure
          platform designed for students.
        </p>
        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Create Account
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Login
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white px-6 py-16 text-center">
        <h3 className="text-2xl font-semibold text-blue-700 mb-6">
          🛠 How It Works
        </h3>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-gray-700">
          <div className="bg-blue-50 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-lg mb-2">1. Create Your Account</h4>
            <p>Register and log in to your secure student dashboard.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-lg mb-2">2. View Your Schedule</h4>
            <p>Access upcoming exams and prepare ahead of time.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-lg mb-2">3. Start Your CBT</h4>
            <p>Launch tests on time and complete them without hassle.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t p-4 text-sm text-center text-gray-500">
        © 2025 CBT Platform —{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Contact Us
        </a>
      </footer>
    </div>
  );
};

export default Home;
