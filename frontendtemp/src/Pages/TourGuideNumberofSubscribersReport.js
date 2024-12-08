import React, { useState, useEffect } from "react";
import "../styles/global.css";
import { getItinerariesWithTourGuideId } from "../Services/tourGuideServices"; // Fetch itineraries
import styles from '../styles/SellerPage.module.css';

const TourGuideItinerariesUsersReport = ({ id, onBack }) => {
  const [itineraries, setItineraries] = useState([]); // List of itineraries
  const [filteredItineraries, setFilteredItineraries] = useState([]); // Filtered itineraries based on month
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filterMonth, setFilterMonth] = useState(""); // Selected filter month (1-12)

  // Fetch itineraries for the tour guide
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const data = await getItinerariesWithTourGuideId(id); // Fetch itineraries for the guide
        setItineraries(data); // Save the itineraries
        setFilteredItineraries(data); // Set filtered itineraries initially to all
      } catch (err) {
        console.error("Error fetching itineraries:", err.message);
        setError("Failed to load itineraries.");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [id]);

  // Filter itineraries based on selected month
  useEffect(() => {
    let filtered = itineraries;

    if (filterMonth) {
      filtered = filtered.map((item) => {
        // Count total participants (touristIds array length)
        const totalSubscribers = item.touristIds.length;

        // Count new users that joined in the selected month
        const newUsersInMonth = item.touristIds.filter((tourist) => {
          const joinMonth = new Date(tourist.addedAt).getMonth() + 1; // Get the month (1-indexed)
          return joinMonth === parseInt(filterMonth, 10); // Check if the tourist's addedAt month matches the filterMonth
        });

        return {
          ...item,
          totalSubscribers, // Total participants
          newUsersCount: newUsersInMonth.length, // Number of new users in selected month
        };
      });
    }

    setFilteredItineraries(filtered); // Set the filtered itineraries
  }, [filterMonth, itineraries]);

  // Render the table with itinerary details
  const renderTable = () => (
    <div className="partition">
      <h3 className="partition-title">Itineraries List</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Subscribers</th>
            <th>New Users (Selected Month)</th>
          </tr>
        </thead>
        <tbody>
          {filteredItineraries?.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.title || "Unnamed Itinerary"}</td>
                <td>{item.totalSubscribers}</td>
                <td>{item.newUsersCount}</td>
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
      <div className={styles.header}>Tour Guide Itineraries</div>

      {/* Filters Section */}
      <div className={styles['category-buttons']}>
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
        {filteredItineraries.length > 0 ? renderTable() : <p>No itineraries to display.</p>}
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      </div>

      <div className={styles.footer}>Powered by Very Good App</div>
    </div>
  );
};

export default TourGuideItinerariesUsersReport;
