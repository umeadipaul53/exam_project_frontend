import React, { useState } from "react";
import Swal from "sweetalert2";
import Loader from "../utils/Loader";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [studentClass, setClass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/student/student_registration", {
        username,
        email,
        password,
        fullname,
        phone_number,
        class: studentClass,
      }).then((res) => {
        Swal.fire({
          title: "Great!!!",
          text: res.data.message,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      });
      setUsername("");
      setEmail("");
      setPassword("");
      setFullname("");
      setPhone_number("");
      setClass("");
      setLoading(false);
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      Swal.fire("Error", message, "error");
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <div>
        <div className="bg-white max-w-[900px] mx-auto px-20 py-10 my-12">
          <section className="py-6 rounded-sm">
            <form onSubmit={handleSubmit}>
              <h1> Create Student Account</h1>
              <main className="flex flex-col my-3">
                <label htmlFor="">
                  Userame <span className="text-red-300">*</span>{" "}
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="bg-gray-100 h-10 px-2 border border-gray-300 focus:outline-purple-300 rounded-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </main>
              <main className="flex flex-col my-3">
                <label htmlFor="">Email</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="bg-gray-100 h-10 px-2 border border-gray-300 focus:outline-purple-300 rounded-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </main>
              <main className="flex flex-col my-3">
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="bg-gray-100 h-10 px-2 border border-gray-300 focus:outline-purple-300 rounded-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </main>
              <main className="flex flex-col my-3">
                <label htmlFor="">Fullname</label>
                <input
                  type="text"
                  placeholder="Enter your fullname"
                  className="bg-gray-100 h-10 px-2 border border-gray-300 focus:outline-purple-300 rounded-sm"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </main>
              <main className="flex flex-col my-3">
                <label htmlFor="">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="bg-gray-100 h-10 px-2 border border-gray-300 focus:outline-purple-300 rounded-sm"
                  value={phone_number}
                  onChange={(e) => setPhone_number(e.target.value)}
                />
              </main>
              <main className="flex flex-col my-3">
                <label htmlFor="">Class</label>
                <select
                  className="bg-gray-100 h-10 px-2 border border-gray-300 focus:outline-purple-300 rounded-sm"
                  value={studentClass}
                  onChange={(e) => setClass(e.target.value)}
                >
                  <option value="" disabled>
                    Select Class
                  </option>
                  <option value="JSS1">JSS1</option>
                  <option value="JSS2">JSS2</option>
                  <option value="JSS3">JSS3</option>
                  <option value="SSS1">SSS1</option>
                  <option value="SSS2">SSS2</option>
                  <option value="SSS3">SSS3</option>
                </select>
              </main>
              <button
                type="submit"
                className="bg-blue-600 w-full my-4 text-white font-semibold text-sm py-2 cursor-pointer hover:bg-blue-800 rounded-md mr-4"
              >
                Create account
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default Register;
