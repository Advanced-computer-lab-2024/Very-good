import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/global.css"; // Replace with your actual stylesheet filename

const NumberofUsers = () => {
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admins/getUserStatistics");
        setUserStats(response.data);
      } catch (err) {
        console.error("Error fetching user statistics:", err.message);
        setError("Failed to load user statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-stats-page">
      <div className="header">User Statistics Overview</div>
      <div className="partition">
        <h3 className="partition-title">User Statistics</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Number of Users</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(userStats).map((month, index) => (
              <tr key={index}>
                <td>{month}</td>
                <td>{userStats[month]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="footer">تح��ات فيري جوود اب</div>
    </div>
  );
};

export default NumberofUsers;
