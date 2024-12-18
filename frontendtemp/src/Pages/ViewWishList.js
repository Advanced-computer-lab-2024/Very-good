import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {fetchWishlistProducts, removeProductFromWishlist, addProductToCart} from "../Services/TouristService";
import {updateProduct} from '../Services/productServices';
import { purchaseProduct } from '../RequestSendingMethods';  // Assuming the function for purchase is imported
import {makePayment} from '../Services/payementServices'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Navbar from "../Components/Navbar";
import styles from '../styles/TouristPage.module.css'; // Import CSS Module

const ViewWishList = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchaseError, setPurchaseError] = useState(null); // Error state for purchases

    const location = useLocation();
    const touristId = location?.state?.touristId;  // Ensure touristId is available
    const email = location?.state?.email;
    console.log("touristId : ", touristId);

    const [showReviews, setShowReviews] = useState({});

    const toggleReviews = (productId) => {
        setShowReviews(prevState => ({
            ...prevState,
            [productId]: !prevState[productId]
        }));
    };

    const ProductCard = ({ product, handleRemoveFromWishlist, handleAddToCart }) => {
      return (
        <div className="itinerary-card">
          <h3 style={styles.title}>{product.name}</h3>
          <p><strong>Description:</strong> {product.description || "No description available"}</p>
          <p><strong>Price:</strong> {product.price} EGP</p>
          <p><strong>Rating:</strong> {product.rating}</p>
          <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
    
          <div style={styles.buttonContainer}>
            {/* Remove from Wishlist Button */}
            <button
              className="remove-button"
              onClick={() => handleRemoveFromWishlist(product._id)}
              title="Remove from Wishlist"
              style={styles.removeButton}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
    
            {/* Add to Cart Button */}
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(product._id)}
              title="Add to Cart"
              style={styles.addButton}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
            </button>

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
    
          {/* Show error if wallet balance is insufficient */}
          {purchaseError && <p style={styles.errorText}>{purchaseError}</p>}
        </div>
      );
    };
  
    // const styles = {
    //   card: {
    //     border: "1px solid #ddd",
    //     borderRadius: "8px",
    //     padding: "16px",
    //     margin: "16px 0",
    //     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    //     backgroundColor: "#fff",
    //   },
    //   title: {
    //     fontSize: "1.5em",
    //     marginBottom: "8px",
    //   },
    //   buttonContainer: {
    //     display: "flex",
    //     alignItems: "center",
    //     marginTop: "8px",
    //   },
    //   removeButton: {
    //     background: "transparent",
    //     border: "none",
    //     cursor: "pointer",
    //     color: "red",
    //     fontSize: "18px",
    //     marginRight: "10px",
    //   },
    //   addButton: {
    //     background: "transparent",
    //     border: "none",
    //     cursor: "pointer",
    //     color: "green",
    //     fontSize: "18px",
    //   },
    //   purchaseButton: {
    //     marginTop: "16px",
    //     padding: "8px 16px",
    //     backgroundColor: "#007bff",
    //     color: "#fff",
    //     border: "none",
    //     borderRadius: "4px",
    //     cursor: "pointer",
    //     fontSize: "16px",
    //   },
    //   errorText: {
    //     color: "red",
    //     marginTop: "8px",
    //   },
    // };

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

  const handleAddToCart = async (productId) => {
    try {
        await addProductToCart(touristId, productId); // Assuming this removes the product in your backend
        alert(`Product added to cart.`);
    } catch (error) {
        console.error("Failed to add product to cart:", error);
    }
};
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="wishlist-page">
        <Navbar/>
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
                handleAddToCart={handleAddToCart}
                purchaseError={purchaseError}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default ViewWishList;