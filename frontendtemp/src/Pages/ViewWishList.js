import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {fetchWishlistProducts, removeProductFromWishlist} from "../Services/TouristService";
import {updateProduct} from '../Services/productServices';
import { purchaseProduct } from '../RequestSendingMethods';  // Assuming the function for purchase is imported
import {makePayment} from '../Services/payementServices'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ViewWishList = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchaseError, setPurchaseError] = useState(null); // Error state for purchases

    const location = useLocation();
    const touristId = location?.state?.touristId;  // Ensure touristId is available
    const email = location?.state?.email;
    console.log("touristId : ", touristId);

    const ProductCard = ({ product, handleRemoveFromWishlist }) => {
      return (
          <div className="itinerary-card">
              <h3>{product.name}</h3>
              <p><strong>Description:</strong> {product.description || "No description available"}</p>
              <p><strong>Price:</strong> {product.price} EGP</p>
              <p><strong>Rating:</strong> {product.rating}</p>
              <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
  
              <button
                  className="remove-button"
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  title="Remove from Wishlist"
                  style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "red",
                      fontSize: "18px",
                      marginLeft: "10px"
                  }}
              >
                  <FontAwesomeIcon icon={faTrash} />
              </button>
  
              <button onClick={() => handlePurchase(product)} disabled={product.stock <= 0}>
                  {product.stock > 0 ? "Purchase" : "Out of Stock"}
              </button>
  
              {/* Show error if wallet balance is insufficient */}
              {purchaseError && <p style={{ color: 'red' }}>{purchaseError}</p>}
          </div>
      );
  };
  
  

    const handlePurchase = async (product) => {
      try {
          const response = await purchaseProduct(email, product._id.toString());

          if (response && response.message === "Product purchased successfully") {      
              alert("Product purchased successfully")        
              makePayment(touristId, product.price);
          }

          let sellerId = product.sellerId;          
          let productId = product._id;  
          let salesN =  product.sales +1 
          let stockN = product.stock  -1   
          let updatedData = {  
              sales: salesN ,
              stock: stockN       // Replace with the data you want to update
          };

          updateProduct(sellerId, productId, updatedData)
              .then(updatedProduct => {
                  console.log("Product updated successfully:", updatedProduct);
                  console.log("seller id" , sellerId)
                  console.log("product id" , productId)
                  console.log("stock old" , product.stock , "stock new", stockN)
                  console.log("sales  " , product.sales , "sales new", salesN)
                  console.log("seller id updates" , updatedProduct.sellerId)
                  console.log("product id updates " , updatedProduct.id)
                  console.log("stock old" , product.stock , "stock new U", updatedProduct.stock)
                  console.log("sales old " ,  salesN, "sales new U",salesN)
                  
              })
              .catch(error => {
                  console.error("Error updating product:", error);
              });

                  } catch (err) {
                      setPurchaseError("Error purchasing product: " + err.message);
                  }


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

    const handleRemoveFromWishlist = async (productId) => {
      try {
          await removeProductFromWishlist(touristId, productId); // Assuming this removes the product in your backend
          setWishlistProducts((prevProducts) =>
              prevProducts.filter((product) => product._id !== productId)
          );
          console.log(`Product ${productId} removed from wishlist.`);
      } catch (error) {
          console.error("Failed to remove product from wishlist:", error);
      }
  };
  
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
                handleRemoveFromWishlist={handleRemoveFromWishlist}
                purchaseError={purchaseError}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default ViewWishList;