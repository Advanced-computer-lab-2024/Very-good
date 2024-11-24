import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {fetchWishlistProducts} from "../Services/TouristService";

const ViewWishList = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchaseError, setPurchaseError] = useState(null); // Error state for purchases

    const location = useLocation();
    const touristId = location?.state?.touristId;  // Ensure touristId is available
    console.log("touristId : ", touristId);

    const ProductCard = ({ product }) => {
        return (
            <div className="itinerary-card">
                <h3>{product.name}</h3>
                <p><strong>Description:</strong> {product.description || "No description available"}</p>
                <p><strong>Price:</strong> {product.price} EGP</p>
                <p><strong>Rating:</strong> {product.rating}</p>
                <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
    
                {/*<button onClick={() => handlePurchase(product)} disabled={product.stock <= 0}>
                    {product.stock > 0 ? "Purchase" : "Out of Stock"}
                </button>*/}
*
    
                {/* Show error if wallet balance is insufficient */}
                {/*purchaseError && <p style={{ color: 'red' }}>{purchaseError}</p>*/}
            </div>
        );
    };
  
    useEffect(() => {
      const getWishlist = async () => {
        try {
          setLoading(true);
          const products = await fetchWishlistProducts(touristId);
          console.log("wishList products : ", products)
          setWishlistProducts(products);
        } catch (error) {
          setPurchaseError("Failed to load wishlist products.");
        } finally {
          setLoading(false);
        }
      };
  
      if (touristId) {
        getWishlist();
      }
    }, [touristId]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="wishlist-page">
        <h2>Your Wishlist</h2>
        {wishlistProducts.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div className="product-list">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                touristId={touristId}
                //handleAddToWishList={handleAddToWishList}
                //handlePurchase={handlePurchase}
                purchaseError={purchaseError}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default ViewWishList;