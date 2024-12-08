import React, { useState, useEffect } from "react";
import "../styles/global.css"; // Replace with your actual stylesheet filename
import { fetchAllActivities } from "../Services/activityServices";
import { fetchAllItineraries } from "../Services/itineraryServices";
import { fetchProductsNoID } from "../Services/productServices";
import styles from '../styles/SellerPage.module.css'; 
const RevenuePage = () => {
  const [activities, setActivities] = useState([]); // Fetched activities
  const [itineraries, setItineraries] = useState([]); // Fetched itineraries
  const [products, setProducts] = useState([]); // Fetched products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filterDate, setFilterDate] = useState(null); // Date filter
  const [filterMonth, setFilterMonth] = useState(null); // Month filter

  // Helper to get the last available date for itineraries
  const getLastAvailableDate = (dates) => {
    if (Array.isArray(dates) && dates.length > 0) {
      return new Date(
        Math.max(...dates.map((date) => new Date(date).getTime()))
      );
    }
    return null;
  };

  // Fetch Activities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedActivities = await fetchAllActivities();
        setActivities(fetchedActivities.data); // Activities already have a `date` attribute
      } catch (err) {
        console.error("Error fetching activities:", err.message);
        setError("Failed to load activities.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch Itineraries
  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const fetchedItineraries = await fetchAllItineraries();
        const itinerariesWithLastDate = fetchedItineraries.data.map((itinerary) => ({
          ...itinerary,
          lastAvailableDate: getLastAvailableDate(itinerary.availableDates),
        }));
        setItineraries(itinerariesWithLastDate);
      } catch (err) {
        console.error("Error fetching itineraries:", err.message);
        setError("Failed to load itineraries.");
      } finally {
        setLoading(false);
      }
    };
    fetchData2();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchData3 = async () => {
      try {
        const fetchedProducts = await fetchProductsNoID();
        setProducts(fetchedProducts.data);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchData3();
  }, []);

  // Calculate subscribers for activities and itineraries
  const calculateSubscribers = (item) => {
    return item.touristIds && Array.isArray(item.touristIds) ? item.touristIds.length : item.subscribers || 0;
  };

  // Calculate number of buyers for products
  const calculateNumberOfBuyersofAproduct = (item) => {
    return item.touristWhoBoughtSaidProduct && Array.isArray(item.touristWhoBoughtSaidProduct)
      ? item.touristWhoBoughtSaidProduct.length
      : 0;
  };

  // Parse price into numeric value
  const parsePrice = (price) => {
    if (typeof price === "string" && price.startsWith("$")) {
      return parseFloat(price.substring(1));
    }
    return parseFloat(price);
  };

  // Handle filter change
  const handleFilterChange = (type, value) => {
    if (type === "date") {
      setFilterDate(value);
      setFilterMonth(null); // Clear month filter if date is selected
    } else if (type === "month") {
      setFilterMonth(value);
      setFilterDate(null); // Clear date filter if month is selected
    }
  };

  // Filter data based on selected date or month
  const getFilteredData = (data, type) => {
    if (filterDate) {
      return data.filter((item) => {
        const itemDate =
          type === "itineraries"
            ? item.lastAvailableDate
            : new Date(item.date); // Use lastAvailableDate for itineraries, ⁠ date ⁠ for activities
                  // Ensure the date is valid before using it
      if (!(itemDate instanceof Date) || isNaN(itemDate.getTime())) {
        console.error("Invalid date:", itemDate); // You can log this to debug
        return false; // Skip invalid dates
      }
        return itemDate && itemDate.toISOString().split("T")[0] === filterDate;
      });
    }
    if (filterMonth) {
      return data.filter((item) => {
        const itemDate =
          type === "itineraries"
            ? item.lastAvailableDate
            : type === "activities"
            ? new Date(item.date)
            : new Date(item.createdAt);
        return (
          itemDate &&
          itemDate.getMonth() === parseInt(filterMonth, 10) - 1 // Compare with selected month
        );
      });
    }
    return data; // If no filter, return all data
  };

  // Render partition for activities, itineraries, and products
  const renderPartition = (title, data, type = null) => (
    <div className="partition">
      <h3 className="partition-title">{title}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Total Subscribers/Buyers</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Site Revenue</th>
            <th>Creation Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const subscribers =
              title === "Gift Shop Sales"
                ? calculateNumberOfBuyersofAproduct(item)
                : calculateSubscribers(item);

            const price = parsePrice(item.price);
            const totalPrice = subscribers * price;
            const siteRevenue = totalPrice * 0.1;

            let status;
            if (title === "Activities") {
              status = item.bookingOpen ? "Open" : "Closed";
            } else if (title === "Itineraries") {
              status = item.isActive ? "Active" : "Inactive";
            } else if (title === "Gift Shop Sales") {
              status = item.isArchived ? "Archived" : "Not Archived";
            }

            const displayName =
              title === "Itineraries" ? item.title : item.name;

            // Format creation date
            const creationDate =
              type === "itineraries"
                ? item.lastAvailableDate.toLocaleDateString()
                : new Date(item.date || item.createdAt).toLocaleDateString();

            return (
              <tr key={index}>
                <td>{displayName}</td>
                <td>{item.price}</td>
                <td>{subscribers}</td>
                <td>{totalPrice.toFixed(2)}</td>
                <td>{status}</td>
                <td>{siteRevenue.toFixed(2)}</td>
                <td>{creationDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="revenue-page">
      <div className={styles.header}>Revenue Overview</div>

      {/* Filters Section */}
      <div className={styles['category-buttons']}>
        <label>
          Filter by Date:
          <input
            type="date"
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />
        </label>
        <label>
          Filter by Month:
          <select onChange={(e) => handleFilterChange("month", e.target.value)}>
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Render Horizontal Partitions */}
      <div className="horizontal-partitions">
        {renderPartition("Activities", getFilteredData(activities, "activities"))}
        {renderPartition("Itineraries", getFilteredData(itineraries, "itineraries"), "itineraries")}
        {renderPartition("Gift Shop Sales", getFilteredData(products))}
      </div>
      <button onClick={() => window.location.reload()}>Back </button>
      <div className={styles.footer}>Powered  by Very Good app</div>
    </div>
  );
};

export default RevenuePage;
