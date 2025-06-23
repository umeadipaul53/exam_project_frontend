import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { RingLoader } from "react-spinners";
import { CircleLoader } from "react-spinners";

const EditStudentAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const [fetchUserDetail, setFetchUserDetail] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [fullname, setFullname] = useState("");
  const [regno, setRegno] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/student/student-profile?id=${id}`);
      const fetcheddata = res.data;
      setFetchUserDetail(fetcheddata);
      setUsername(fetcheddata.username || ""); //this is done to guide against undefined or
      setEmail(fetcheddata.email || "");
      setPhone(fetcheddata.phone || "");
      setFullname(fetcheddata.fullname || "");
      setStudentClass(fetcheddata.class || "");
      setRegno(fetcheddata.regno || "");
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/student/update_student_information/${id}`, {
        fullname,
        phone_number: phone,
        class: studentClass,
      }).then(() => {
        Swal.fire({
          title: "Editted",
          text: "Student details updated",
          icon: "success",
        });
      });

      navigate(`/student/profile?id=${id}`);
    } catch (error) {
      Swal.fire("Error", "Failed to update student information", "error");
    }
  };

  if (loading)
    return <RingLoader size={80} color="#7e22ce" className="mx-auto mt-20" />;

  return (
    <>
      <div>
        <div className="bg-white max-w-[900px] mx-auto px-20 py-10 my-12">
          <section className="py-6 rounded-sm">
            <form onSubmit={handleSubmit}>
              <h1> Update user details</h1>
              <main className="flex flex-col my-3">
                <label htmlFor="">
                  Userame <span className="text-red-300">*</span>{" "}
                </label>
                <input
                  type="text"
                  disabled
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
                  disabled
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
                <label htmlFor="">Regno</label>
                <input
                  type="text"
                  disabled
                  placeholder="Enter your regno"
                  className="bg-gray-100 h-10 px-2 border border-gray-300 focus:outline-purple-300 rounded-sm"
                  value={regno}
                  onChange={(e) => setRegno(e.target.value)}
                />
              </main>
              <main className="flex flex-col my-3">
                <label htmlFor="">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter your phone Number"
                  className="bg-gray-100 h-10 px-2 border border-gray-300 focus:outline-purple-300 rounded-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </main>
              <main className="flex flex-col my-3">
                <label htmlFor="">Student Class</label>

                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
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
                Save
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default EditStudentAccount;
