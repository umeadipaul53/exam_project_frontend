import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import API from "../../api/api";

const PrintResult = () => {
  const { user } = useAuth();
  const [fetchResult, setFetchResult] = useState([]);
  const [resultTotal, setResultTotal] = useState(0);
  const [resultAvg, setResultAvg] = useState(0);
  const [totalSubj, setTotalSubj] = useState(0);

  const getResult = async () => {
    try {
      const res = await API.get("/student/fetch-result", {
        withCredentials: true,
      });

      const resultData = Array.isArray(res.data.data) ? res.data.data : [];

      //total number of subjects taken by the student
      setTotalSubj(resultData.length);

      //fetch all results of the student
      setFetchResult(res.data.data);

      setResultTotal(
        resultData.reduce((acc, res) => acc + (res.totalscore || 0), 0)
      );

      const totalScore = resultData.reduce(
        (acc, res) => acc + (res.totalscore || 0),
        0
      );

      const maxScore = resultData.reduce(
        (acc, res) => acc + (res.maxscore || 0),
        0
      );

      const avg = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

      setResultAvg(parseFloat(avg).toFixed(1));
    } catch (error) {
      if (error.response?.data?.message) {
        setFetchResult({ message: error.response.data.message });
      } else {
        console.log("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  const student = {
    name: "John Doe",
    regno: "SSS3/1234",
    class: "SSS3",
    term: "3rd Term",
    session: "2024/2025",
    subjects: [
      { name: "English Language", score: 85 },
      { name: "Mathematics", score: 92 },
      { name: "Biology", score: 78 },
      { name: "Chemistry", score: 88 },
      { name: "Physics", score: 74 },
      { name: "Literature", score: 90 },
    ],
  };

  const total = student.subjects.reduce((sum, s) => sum + s.score, 0);
  const average = (total / student.subjects.length).toFixed(2);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white text-black print:bg-white print:text-black print:p-0 print:max-w-full">
      {/* Header */}
      <div className="text-center border-b pb-4 mb-4 print:border-none">
        <h1 className="text-3xl font-bold uppercase">SOFTCODE CBT</h1>
        <p className="text-sm">Result Slip</p>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <p>
            <strong>Name:</strong> {user.fullname}
          </p>
          <p>
            <strong>Reg No:</strong> {user.regno}
          </p>
          <p>
            <strong>Class:</strong> {user.class}
          </p>
        </div>
        <div>
          <p>
            <strong>Subjects Taken:</strong> {totalSubj}
          </p>

          <p>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Subject Scores */}
      <table className="w-full border border-gray-400 mb-6 text-sm">
        <thead>
          <tr className="bg-gray-200 print:bg-gray-100">
            <th className="border border-gray-400 p-2 text-center">#</th>
            <th className="border border-gray-400 p-2 text-center">Subject</th>
            <th className="border border-gray-400 p-2 text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          {fetchResult.map((subject, index) => (
            <tr key={index} className="even:bg-gray-50 print:even:bg-white">
              <td className="border border-gray-400 p-2">{index + 1}</td>
              <td className="border border-gray-400 p-2">{subject.title}</td>
              <td className="border border-gray-400 p-2">
                {subject.totalscore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="text-sm mb-6">
        <p>
          <strong>Total:</strong> {resultTotal}
        </p>
        <p>
          <strong>Average:</strong> {resultAvg}
        </p>
        <p>
          <strong>Remark:</strong> {resultAvg >= 50 ? "Pass" : "Fail"}
        </p>
      </div>

      {/* Print Button */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Result
        </button>
      </div>
    </div>
  );
};

export default PrintResult;
