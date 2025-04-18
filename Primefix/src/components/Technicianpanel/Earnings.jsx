// src/components/technicianpanel/Earnings.jsx

import React, { useState, useEffect } from "react";
import "./Earnings.css";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// TODO: Replace this with actual logged-in technician ID from context or auth
const TECHNICIAN_ID = 55643256632;

// Backend base URL (update if you deploy to production)
const BACKEND_URL = "http://localhost:4000";

const Earnings = () => {
  const [jobHistory, setJobHistory] = useState([]);
  const [jobInput, setJobInput] = useState({
    job: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    fetchJobHistory();
  }, []);

  const fetchJobHistory = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/earnings/history/${TECHNICIAN_ID}`);
      const jobs = res.data.map((job, index) => ({
        id: index + 1,
        job: job.job,
        amount: `₹${job.amount}`,
        rawAmount: job.amount,
        date: job.date.split("T")[0],
      }));
      setJobHistory(jobs);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleInputChange = (e) => {
    setJobInput({ ...jobInput, [e.target.name]: e.target.value });
  };

  const handleAddJob = async () => {
    const { job, amount, date } = jobInput;

    if (job && amount && date) {
      try {
        const response = await axios.post(`${BACKEND_URL}/api/earnings/add`, {
          technicianId: TECHNICIAN_ID,
          job,
          amount: parseInt(amount),
          date,
        });

        const savedJob = {
          id: jobHistory.length + 1,
          job: response.data.job,
          amount: `₹${response.data.amount}`,
          rawAmount: response.data.amount,
          date: response.data.date.split("T")[0],
        };

        setJobHistory([savedJob, ...jobHistory]);
        setJobInput({ job: "", amount: "", date: "" });
      } catch (error) {
        console.error("Error saving job:", error);
      }
    }
  };

  const getTotalEarnings = () =>
    jobHistory.reduce((acc, job) => acc + job.rawAmount, 0);

  const getMonthlyEarnings = () => {
    const thisMonth = new Date().getMonth();
    return jobHistory
      .filter((job) => new Date(job.date).getMonth() === thisMonth)
      .reduce((acc, job) => acc + job.rawAmount, 0);
  };

  return (
    <div className="earnings-container">
      <h2>💰 Earnings & Payment</h2>

      <div className="add-job-form">
        <input
          type="text"
          placeholder="Job Name"
          name="job"
          value={jobInput.job}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={jobInput.amount}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date"
          value={jobInput.date}
          onChange={handleInputChange}
        />
        <button onClick={handleAddJob}>Add Job</button>
      </div>

      <div className="summary-box">
        <div>
          <h3>Total Earnings</h3>
          <p>₹{getTotalEarnings()}</p>
        </div>
        <div>
          <h3>This Month</h3>
          <p>₹{getMonthlyEarnings()}</p>
        </div>
        <div>
          <h3>Jobs Completed</h3>
          <p>{jobHistory.length}</p>
        </div>
      </div>

      {jobHistory.length > 0 && (
        <>
          <h3 className="history-heading">Earnings Chart</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobHistory.slice(0, 7).reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rawAmount" fill="#27ae60" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h3 className="history-heading">Recent Payments</h3>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Job</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {jobHistory.map((job) => (
                <tr key={job.id}>
                  <td>{job.date}</td>
                  <td>{job.job}</td>
                  <td>{job.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Earnings;
