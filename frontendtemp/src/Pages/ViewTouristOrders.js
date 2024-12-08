import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import '../styles/global.css';

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    margin: "16px 0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: "1.5em",
    marginBottom: "8px",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "8px",
  },
  removeButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "red",
    fontSize: "18px",
    marginRight: "10px",
  },
  addButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "green",
    fontSize: "18px",
  },
  purchaseButton: {
    marginTop: "16px",
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  errorText: {
    color: "red",
    marginTop: "8px",
  },
};

const TouristOrders = ({touristId}) => {
  const location = useLocation(); // Initialize useLocation
  let fromView = true;
  if(!touristId){
    touristId = location.state?.TouristID; // Get touristID from state
    fromView = false;
  }
  const credit = location.state?.credit; // Get credit from state
  const promoCodePercentage = location.state?.promoCodePercentage; 
  console.log('TouristID:', touristId); // Log touristID to console
  console.log('Credit:', credit); // Log credit to console

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('current'); // Default to "current" orders
  const [cart, setCart] = useState({});

  // Fetch orders based on touristId
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = fromView 
          ? `http://localhost:4000/api/tourists/${touristId}/ordersView` 
          : `http://localhost:4000/api/tourists/${touristId}/orders-create-view`;
        const response = await axios.post(url, { credit, promoCodePercentage });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [touristId, fromView]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  // Filter orders based on the selected filter
  const filteredOrders = orders?.filter((order) =>
    filter === 'current' ? order.status !== 'Delivered' : order.status === 'Delivered'
  );

  // Delete order by ID
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:4000/api/tourists/${touristId}/orders/${orderId}`);
      // Update state to reflect the deleted order
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      alert('Order deleted successfully!');
    } catch (err) {
      alert('Failed to delete order. Please try again later.');
    }
  };

  const handleAddToCart = (productId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (!newCart[productId]) {
        newCart[productId] = 1;
      } else {
        newCart[productId] += 1;
      }
      return newCart;
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  return (
    <div className="container">
      <div className="header">Tourist Orders</div>
      <div className="filter-buttons">
        <button
          onClick={() => setFilter('current')}
          className={filter === 'current' ? 'active-filter' : ''}
        >
          Current Orders
        </button>
        <button
          onClick={() => setFilter('past')}
          className={filter === 'past' ? 'active-filter' : ''}
        >
          Past Orders
        </button>
      </div>
      {filteredOrders.length === 0 ? (
        <p>No {filter} orders found for this tourist.</p>
      ) : (
        <div>
          {filteredOrders.map((order) => (
            <div key={order._id} style={styles.card}>
              <h3 style={styles.title}>Order ID: {order._id}</h3>
              <p>Status: {order.status}</p>
              <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p>Total Price: ${order.totalPrice}</p>
              <h4>Products:</h4>
              <ul>
                {order.products.map((product) => (
                  <li key={product._id}>
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Stock Remaining:</strong> {product.stock - (cart[product._id] || 0)}</p>
                    <img
                      src={product.pictures[0] || 'https://via.placeholder.com/150'}
                      alt={product.name}
                      style={{ maxWidth: '100px', borderRadius: '8px' }}
                    />
                  </li>
                ))}
              </ul>
              {/* Delete Button */}
              <button
                style={styles.removeButton}
                onClick={() => handleDeleteOrder(order._id)}
              >
                Delete Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TouristOrders;
