import React, { useState, useEffect } from "react";
import "../styles/global.css"; // Replace with your actual stylesheet filename
import { fetchProductsNoID } from "../Services/productServices";

const SellerSalesReport = ({ sellerId }) => {
    console.log("ID DA5L LEL COMPONENT:",sellerId) 
  const [products, setProducts] = useState([]); // Fetched products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filterDate, setFilterDate] = useState(null); // Date filter
  const [filterMonth, setFilterMonth] = useState(null); // Month filter

// Fetch Products for a specific seller
useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products from the server
        const fetchedProducts = await fetchProductsNoID(); // Use the provided axios method
        // Filter products to only include those with the matching sellerId
        const filteredProducts = fetchedProducts.data.filter(
            (product) => product.sellerId === sellerId
          );
        setProducts(filteredProducts); // Set filtered products in state
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sellerId]);
  

  // Calculate number of buyers for products
  const calculateNumberOfBuyers = (product) => {
    return product.touristWhoBoughtSaidProduct && Array.isArray(product.touristWhoBoughtSaidProduct)
      ? product.touristWhoBoughtSaidProduct.length
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

  // Filter products based on selected date or month
  const getFilteredProducts = () => {
    if (filterDate) {
      return products.filter((product) => {
        const productDate = new Date(product.createdAt).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
        return productDate === filterDate;
      });
    }
    if (filterMonth) {
      return products.filter((product) => {
        const productMonth = new Date(product.createdAt).getMonth(); // Get the month (0-indexed)
        return productMonth === parseInt(filterMonth) - 1; // Compare with selected month
      });
    }
    return products; // If no filter, return all products
  };

  // Render the products table
  const renderProductsTable = () => {
    const filteredProducts = getFilteredProducts();

    return (
      <div className="partition">
        <h3 className="partition-title">Seller Products Sales</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Total Buyers</th>
              <th>Total Revenue</th>
              <th>Status</th>
              <th>Site Revenue</th>
              <th>Creation Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => {
              const buyers = calculateNumberOfBuyers(product);
              const price = parsePrice(product.price);
              const totalPrice = buyers * price;
              const siteRevenue = totalPrice * 0.1; // Assume 10% commission
              const creationDate = new Date(product.createdAt).toLocaleDateString();
              const status = product.isArchived ? "Archived" : "Not Archived";

              return (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{buyers}</td>
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
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="revenue-page">
      <div className="header">Seller Products Revenue</div>

      {/* Filters Section */}
      <div className="filters">
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

      {/* Render Products Table */}
      <div className="horizontal-partitions">{renderProductsTable()}</div>

      <div className="footer">Powered by Very Good App</div>
    </div>
  );
};

export default SellerSalesReport;
