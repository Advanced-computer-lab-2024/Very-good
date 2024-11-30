import React, { useState, useEffect } from "react";
import "../styles/global.css";
import { fetchActivities } from "../Services/activityServices"; // Fetch activities

const AdvertiserActivitiesUsersReport = ({ id, onBack }) => {
  const [activities, setActivities] = useState([]); // List of activities
  const [filteredActivities, setFilteredActivities] = useState([]); // Filtered activities based on month
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filterMonth, setFilterMonth] = useState(""); // Selected filter month (1-12)

  // Fetch activities for the advertiser
  useEffect(() => {
    const fetchAdvertiserActivities = async () => {
      try {
        const data = await fetchActivities(id); // Fetch activities for the advertiser
        setActivities(data); // Save the activities
        setFilteredActivities(data); // Set filtered activities initially to all
      } catch (err) {
        console.error("Error fetching activities:", err.message);
        setError("Failed to load activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertiserActivities();
  }, [id]);

  // Filter activities based on selected month
  useEffect(() => {
    let filtered = activities;

    if (filterMonth) {
      filtered = filtered.map((activity) => {
        // Count total subscribers (touristIds array length)
        const totalSubscribers = activity.touristIds.length;

        // Count new users that joined in the selected month
        const newUsersInMonth = activity.touristIds.filter((tourist) => {
          const joinMonth = new Date(tourist.addedAt).getMonth() + 1; // Get the month (1-indexed)
          return joinMonth === parseInt(filterMonth, 10); // Check if the tourist's addedAt month matches the filterMonth
        });

        return {
          ...activity,
          totalSubscribers, // Total participants
          newUsersCount: newUsersInMonth.length, // Number of new users in selected month
        };
      });
    }

    setFilteredActivities(filtered); // Set the filtered activities
  }, [filterMonth, activities]);

  // Render the table with activity details
  const renderTable = () => (
    <div className="partition">
      <h3 className="partition-title">Activities List</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Subscribers</th>
            <th>New Users (Selected Month)</th>
          </tr>
        </thead>
        <tbody>
          {filteredActivities?.map((activity, index) => (
            <tr key={index}>
              <td>{activity.name || "Unnamed Activity"}</td>
              <td>{activity.totalSubscribers}</td>
              <td>{activity.newUsersCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="revenue-page">
      <div className="header">Advertiser Activities</div>

      {/* Filters Section */}
      <div className="filters">
        <label>
          Filter by Month:
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="">-- Select Month --</option>
            {[...Array(12).keys()].map((month) => (
              <option key={month + 1} value={month + 1}>
                {new Date(0, month).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Render Table */}
      <div className="horizontal-partitions">
        {filteredActivities.length > 0 ? renderTable() : <p>No activities to display.</p>}
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      </div>

      <div className="footer">Powered by Very Good App</div>
    </div>
  );
};

export default AdvertiserActivitiesUsersReport;
