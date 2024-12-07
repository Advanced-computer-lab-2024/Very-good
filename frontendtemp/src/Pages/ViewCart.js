import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addProductToCart } from '../Services/TouristService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ViewCart = ({ TouristID, onBack }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch cart products for the given touristId
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/tourists/${TouristID}/cart`);
        setCartProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cart products. Please try again later.');
        setLoading(false);
      }
    };

    fetchCart();
  }, [TouristID]);

  // Delete product from cart
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/tourists/${TouristID}/cart/${productId}`);
      setCartProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId)); // Remove product from the local state
    } catch (error) {
      console.error('Error deleting product from cart:', error);
    }
  };

  const handleIncreaseQuantity = async (productId, stock) => {
    if (stock !== 0) {
      try {
        await addProductToCart(TouristID, productId); // Assuming this removes the product in your backend
        alert(`Product added to cart.`);
      } catch (error) {
        console.error("Failed to add product to cart:", error);
      }
    } else {
      alert('Product Out of Stock');
    }
  };

  const handleCheckout = () => {
    navigate('/tourist/checkout', { state: { TouristID, totalPrice } }); // Send totalPrice as state
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  const totalPrice = cartProducts.reduce((total, product) => total + product.price, 0); // Calculate total price

  const ProductCard = ({ product }) => (
    <div className="itinerary-card">
      <img
        src={product.pictures[0] || 'https://via.placeholder.com/150'}
        alt={product.name}
        style={{ maxWidth: '100px', borderRadius: '8px' }}
      />
      <h3>{product.name}</h3>
      <p>{`Price: $${product.price}`}</p>
      <p>{`Stock: ${product.stock}`}</p>
      <div className="quantity-controls">
        <button onClick={() => handleIncreaseQuantity(product._id, product.stock)}>Increase</button>
        <button onClick={() => handleDeleteProduct(product._id)} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="view-cart-container">
      <button onClick={onBack} className="back-button">
        Back
      </button>
      <h2>Your Cart</h2>
      {cartProducts.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-products">
          {cartProducts.map((product) => (
            <ProductCard key={product._id} product={product} /> // Ensure key is unique and correctly assigned
          ))}
        </div>
      )}
      <h3>{`Total Price: $${totalPrice}`}</h3> {/* Display total price */}
      <button onClick={handleCheckout} className="checkout-button">
        Checkout
      </button>
    </div>
  );
};

export default ViewCart;
