import React, { useState, useEffect } from "react";
import "../styles/global.css"; // Reuse the existing styles
import { getItinerariesWithTourGuideId } from "../Services/tourGuideServices";
import styles from '../styles/SellerPage.module.css';
const TourGuideSalesReport = ({ id, onBack }) => {
  const [itineraries, setItineraries] = useState([]); // State to store itineraries
  const [filteredItineraries, setFilteredItineraries] = useState([]); // State for filtered itineraries
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [filterDate, setFilterDate] = useState(""); // Date filter
  const [filterMonth, setFilterMonth] = useState(""); // Month filter


  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const data = await getItinerariesWithTourGuideId(id); // Fetch itineraries by ID
        setItineraries(data);
        setFilteredItineraries(data); // Initialize with all data
      } catch (err) {
        console.error("Error fetching itineraries:", err.message);
        setError("Failed to load sales report.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, [id]);

  const getLastAvailableDate = (availableDates) => {
    if (Array.isArray(availableDates) && availableDates.length > 0) {
      return new Date(
        Math.max(...availableDates.map((date) => new Date(date)))
      );
    }
    return null;
  };

  // Handle filtering logic
  useEffect(() => {
    let filtered = itineraries;

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter((item) => {
        const lastDate = getLastAvailableDate(item.availableDates);
        return (
          lastDate &&
          lastDate.toISOString().split("T")[0] === filterDate
        );
      });
    }

    // Filter by month
    if (filterMonth) {
      filtered = filtered.filter((item) => {
        const lastDate = getLastAvailableDate(item.availableDates);
        return (
          lastDate &&
          lastDate.getMonth() + 1 === parseInt(filterMonth, 10)
        );
      });
    }

    setFilteredItineraries(filtered);
  }, [filterDate, filterMonth, itineraries]);

  const calculateSubscribers = (item) => {
    return item.touristIds && Array.isArray(item.touristIds)
      ? item.touristIds.length
      : 0;
  };

  const parsePrice = (price) => {
    return typeof price === "number" ? price : parseFloat(price) || 0;
  };

  const renderTable = () => (
    <div className="partition">
      <h3 className="partition-title">Itineraries Sales Report</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price of Subscription</th>
            <th>Total Subscribers</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Site Revenue</th>
            <th>Last Available Date</th> {/* Use the last available date */}
          </tr>
        </thead>
        <tbody>
          {filteredItineraries.map((item, index) => {
            const subscribers = calculateSubscribers(item);
            const price = parsePrice(item.price);
            const totalPrice = subscribers * price;
            const siteRevenue = totalPrice * 0.1; // 10% of total price
            const lastDate = getLastAvailableDate(item.availableDates)?.toLocaleDateString() || "N/A";

            return (
              <tr key={index}>
                <td>{item.title}</td>
                <td>{price}</td>
                <td>{subscribers}</td>
                <td>{totalPrice.toFixed(2)}</td>
                <td>{item.isActive ? "Active" : "Inactive"}</td>
                <td>{siteRevenue.toFixed(2)}</td>
                <td>{lastDate}</td> {/* Display the last available date */}
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
      <div className={styles.header}>Tour Guide Sales Report</div>

      {/* Filters Section */}
      <div className={styles['category-buttons']}>
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
        {filteredItineraries.length > 0 ? renderTable() : <p>No sales to display.</p>}
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      </div>

      <div className={styles.footer}>Powered by Very Good App</div>
    </div>
  );
};

export default TourGuideSalesReport;
