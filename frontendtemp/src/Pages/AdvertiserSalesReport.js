import React, { useState, useEffect } from "react";
import "../styles/global.css"; // Reuse the existing styles
import { fetchActivities } from "../Services/activityServices";

const AdvertiserSalesReport = ({ advertiserId,onBack }) => {
  console.log("AdvertiserID Sent to the Sales Page:", advertiserId);
  const [activities, setActivities] = useState([]); // State to store activities
  const [filteredActivities, setFilteredActivities] = useState([]); // State for filtered activities
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [filterDate, setFilterDate] = useState(""); // Date filter
  const [filterMonth, setFilterMonth] = useState(""); // Month filter

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const data = await fetchActivities(advertiserId); // Fetch activities by advertiser ID
        setActivities(data);
        setFilteredActivities(data); // Initialize with all data
      } catch (err) {
        console.error("Error fetching activities:", err.message);
        setError("Failed to load sales report.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, [advertiserId]);

  // Handle filtering logic
  useEffect(() => {
    let filtered = activities;

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.createdAt).toISOString().split("T")[0] === filterDate
      );
    }

    // Filter by month
    if (filterMonth) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.createdAt).getMonth() + 1 === parseInt(filterMonth, 10)
      );
    }

    setFilteredActivities(filtered);
  }, [filterDate, filterMonth, activities]);

  const calculateSubscribers = (activity) => {
    return activity.touristIds && Array.isArray(activity.touristIds)
      ? activity.touristIds.length
      : activity.subscribers || 0;
  };
  const parsePrice = (price) => {
    if (typeof price === "string" && price.startsWith("$")) {
      return parseFloat(price.substring(1));
    }
    return parseFloat(price);
  };
  const calculateRevenue = (item) => {
    const subscriptions = item.subscriptions || 0; // Assuming `subscriptions` is a field
    const price = item.price || 0; // Assuming `price` is a field
    return subscriptions * price;
  };

  const renderTable = () => (
    <div className="partition">
      <h3 className="partition-title">Advertiser Sales Report</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Activity Name</th>
            <th>Price per Subscription</th>
            <th>Total Subscriptions</th>
            <th>Total Revenue</th>
            <th>Status</th>
            <th>Site share</th>
            <th>Date</th> {/* New field to show date */}
          </tr>
        </thead>
        <tbody>
          {filteredActivities.map((item, index) => {
            const date = new Date(item.createdAt).toLocaleDateString(); // Format the date
            const subscribers =calculateSubscribers(item);
            const RealPrice = (subscribers*item.price);
            const siteShare = RealPrice*0.1;
            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.price || 0}</td>
                <td>{subscribers || 0}</td>
                <td>{RealPrice.toFixed(2)}</td>
                <td>{item.bookingOpen ? "Open" : "Closed"}</td>
                <td>{siteShare.toFixed(2)}</td>
                <td>{date}</td> {/* Display date */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="revenue-page">
      <div className="header">Advertiser Sales Report</div>

      {/* Filters Section */}
      <div className="filters">
        <label>
          Filter by Date:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>
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
        {filteredActivities.length > 0 ? renderTable() : <p>No sales to display.</p>}
        <button className="back-button" onClick={onBack}>
            back
            </button>
      </div>

      <div className="footer">Powered by Very Good App</div>
    </div>
  );
};

export default AdvertiserSalesReport;
