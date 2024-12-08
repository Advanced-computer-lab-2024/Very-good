import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addProductToCart } from '../Services/TouristService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from '../styles/TouristPage.module.css'; // Import CSS Module

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
      setCartProducts(cartProducts.filter((product) => product._id !== productId)); // Remove product from the local state
    } catch (error) {
      console.error('Error deleting product from cart:', error);
    }
  };
  const handleIncreaseQuantity = async(productId,stock)=>{
    if(stock!=0){
        // how to increase amount ? y3m zwd el object tani fl cart , shoof method maran btat3 add cart w htha hna 
        try {
            await addProductToCart(TouristID, productId); // Assuming this removes the product in your backend
            alert(`Product added to cart.`);
        } catch (error) {
            console.error("Failed to add product to cart:", error);
        } } else {
            alert ('Product Out of Stock')
        }
    } 

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

  return (
    <div className={styles['category-buttonsk']}>
      <button onClick={onBack} className="back-button">
        Back
      </button>
      <h2>Your Cart</h2>
      {cartProducts.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={styles['category-buttons']}>
          {cartProducts.map((product) => (
            <div key={product._id} className="cart-product-card">
              <img
                src={product.pictures[0] || 'https://via.placeholder.com/150'}
                alt={product.name}
                style={{ maxWidth: '100px', borderRadius: '8px' }}
              />
              <h3>{product.name}</h3>
              <p>{`Price: $${product.price}`}</p>
              <p>{`Stock: ${product.stock}`}</p>
              <div className="quantity-controls">
                {/* Increase Quantity Button (Currently commented out) */}
                 <button onClick={() => handleIncreaseQuantity(product._id,product.stock)}>Increase</button> 
                 
                {/* Decrease Quantity Button (Currently commented out) */}
          {/*       <button onClick={() => handleDecreaseQuantity(product._id)}>Decrease</button> */}

                {/* Delete Button */}
                <button onClick={() => handleDeleteProduct(product._id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <h3 className={styles.header} style={{ fontSize: "1em"}}>{`Total Price: $${totalPrice}`}</h3> {/* Display total price */}
      <button onClick={handleCheckout} className="checkout-button">
        Checkout
      </button>
    </div>
  );
};

export default ViewCart;
