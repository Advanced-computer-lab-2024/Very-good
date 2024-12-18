import React, { useState } from 'react';
import { filterProductsByPrice } from '../RequestSendingMethods'; // Import the request sending method
import styles from '../styles/TouristPage.module.css'; // Import CSS Module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const FilterProductByPrice = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState('');

  const handleFilterSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError(''); // Reset error message

    // Call the request sending method
    try {
      const products = await filterProductsByPrice({ minPrice, maxPrice });
      setFilteredProducts(products.data); // Set the filtered products
    } catch (err) {
      setError(err.message); // Handle errors
    }
  };

  const [showReviews, setShowReviews] = useState({});

  const toggleReviews = (productId) => {
      setShowReviews(prevState => ({
          ...prevState,
          [productId]: !prevState[productId]
      }));
  };

  const ProductCard = ({ product }) => {
      return (
          <div className="itinerary-card">
              <h3>{product.name}</h3>
              <p><strong>Description:</strong> {product.description || "No description available"}</p>
              <p><strong>Price:</strong> {product.price} EGP</p>
              <p><strong>Rating:</strong> {product.rating}</p>
              <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>

              <button onClick={() => toggleReviews(product._id)}>
                  {showReviews[product._id] ? "Hide Reviews" : "View Reviews"}
              </button>

              {showReviews[product._id] && (
                  <div className="reviews-section">
                      {product.reviewsArray && product.reviewsArray.length > 0 ? (
                          product.reviewsArray.map(review => (
                              <div key={review._id} className="review">
                                  <p><strong>Comment:</strong> {review.comment}</p>
                                  <p><strong>Tourist ID:</strong> {review.touristId}</p>
                                  <p>--------------------------------------------------</p>
                              </div>
                          ))
                      ) : (
                          <p>No reviews available for this product.</p>
                      )}
                  </div>
              )}

                        {product.pictures && product.pictures.length > 0 && (
                            <div>
                                <p>Product Image:</p>
                                <img
                                    src={product.pictures[0]}
                                    alt="Product"
                                    style={{ marginLeft : '27%', maxWidth: '2000px', maxHeight: '200px', objectFit: 'cover' ,}}
                                />
                            </div>
                        )}
          </div>
      );
  };
  

  return (
    <div className="filter-product-by-price">
      <h1>Filter Products by Price</h1>
      <form onSubmit={handleFilterSubmit}>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Minimum Price"
          required
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Maximum Price"
          required
        />
        <button type="submit">Filter Products</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {/* Render filtered products */}
      <div className="filtered-products-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-item">
              <ProductCard key={product._id} product={product} />
            </div>
          ))
        ) : (
          <p>No products found within this price range.</p>
        )}
      </div>
    </div>
  );
};

export default FilterProductByPrice;
