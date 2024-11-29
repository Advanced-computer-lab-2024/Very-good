import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {addProductToCart} from '../Services/TouristService'


const ViewCart = ({ TouristID, onBack }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

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
    </div>
  );
};

export default ViewCart;
