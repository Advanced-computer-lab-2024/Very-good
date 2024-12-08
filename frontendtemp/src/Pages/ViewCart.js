import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addProductToCart } from '../Services/TouristService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ViewCart = ({ TouristID, onBack }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productStockMap, setProductStockMap] = useState(new Map()); // Initialize product stock map
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch cart products for the given touristId
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/tourists/${TouristID}/cart`);
        setCartProducts(response.data);
        setLoading(false);
        const stockMap = new Map();
        response.data.forEach(product => {
          stockMap.set(product._id, product.stock);
        });
        setProductStockMap(stockMap); // Save stock in the map
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
      const response = await axios.delete(`http://localhost:4000/api/tourists/${TouristID}/cart/${productId}`);
      console.log("hwa dh el response : ", response);
      setCartProducts(response.data.updatedCart); // Update the state with the updated cart from the backend
    } catch (error) {
      console.error('Error deleting product from cart:', error);
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    const currentStock = productStockMap.get(productId);
    const currentQuantity = cartProducts.filter(product => product._id === productId).length;
    if (currentQuantity < currentStock) {
      try {
        await addProductToCart(TouristID, productId); // Assuming this adds the product in your backend
        setCartProducts((prevProducts) => {
          const productIndex = prevProducts.findIndex((product) => product._id === productId);
          if (productIndex !== -1) {
            const updatedProducts = [...prevProducts];
            updatedProducts.push(prevProducts[productIndex]);
            return updatedProducts;
          }
          return [...prevProducts];
        });
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
        <button onClick={() => handleIncreaseQuantity(product._id)}>Increase</button>
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
