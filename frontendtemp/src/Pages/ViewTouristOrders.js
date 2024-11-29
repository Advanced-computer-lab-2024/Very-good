import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/global.css';

const TouristOrders = ({ touristId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('current'); // Default to "current" orders

  // Fetch orders based on touristId
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/tourists/${touristId}/orders-create-view`);
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [touristId]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  // Filter orders based on the selected filter
  const filteredOrders = orders.filter((order) =>
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
            <div key={order._id} className="order-card">
              <h3>Order ID: {order._id}</h3>
              <p>Status: {order.status}</p>
              <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p>Total Price: ${order.totalPrice}</p>
              <h4>Products:</h4>
              <ul>
                {order.products.map((product) => (
                  <li key={product._id}>
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Stock Remaining:</strong> {product.stock}</p>
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
                className="delete-button"
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
