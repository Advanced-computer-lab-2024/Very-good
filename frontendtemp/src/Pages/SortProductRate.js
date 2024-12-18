import React, { useEffect, useState } from 'react';
import { fetchProductsNoID ,updateProduct} from '../Services/productServices';
import { purchaseProduct } from '../RequestSendingMethods';  // Assuming the function for purchase is imported , this function is the one reponsible for purchasing a product
import {makePayment} from '../Services/payementServices'
import {addProductToWishlist,addProductToCart} from '../Services/TouristService'
import styles from '../styles/TouristPage.module.css'; // Import CSS Module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ProductSort = ({ email, touristId }) => {
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMappings, setShowMappings] = useState(false);  // Toggle for activities
    const [touristWallet, setTouristWallet] = useState(0);  // To store the tourist's wallet balance
    const [purchaseError, setPurchaseError] = useState(""); // To handle errors when purchasing
    //const [hover, setHover] = useState(false);
    console.log('Passing email:', email);  
    // const styles = {
    //     card: {
    //       border: "1px solid #ddd",
    //       borderRadius: "8px",
    //       padding: "16px",
    //       margin: "16px 0",
    //       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    //       backgroundColor: "#fff",
    //     },
    //     title: {
    //       fontSize: "1.5em",
    //       marginBottom: "8px",
    //     },
    //     buttonContainer: {
    //       display: "flex",
    //       alignItems: "center",
    //       marginTop: "8px",
    //     },
    //     removeButton: {
    //       background: "transparent",
    //       border: "none",
    //       cursor: "pointer",
    //       color: "red",
    //       fontSize: "18px",
    //       marginRight: "10px",
    //     },
    //     addButton: {
    //       background: "transparent",
    //       border: "none",
    //       cursor: "pointer",
    //       color: "green",
    //       fontSize: "18px",
    //     },
    //     purchaseButton: {
    //       marginTop: "16px",
    //       padding: "8px 16px",
    //       backgroundColor: "#007bff",
    //       color: "#fff",
    //       border: "none",
    //       borderRadius: "4px",
    //       cursor: "pointer",
    //       fontSize: "16px",
    //     },
    //     errorText: {
    //       color: "red",
    //       marginTop: "8px",
    //     },
    //   };
    useEffect(() => {
        const getProducts = async () => {
            try {
                const Products = await fetchProductsNoID();
                console.log("raw fetch products:", Products);

                if (Products && Products.data) {
                    const sortedProducts = Products.data.sort((a, b) => {
                        const rateA = a.rating;
                        const rateB = b.rating;
                        return rateB - rateA;  // Sort by rating in ascending order
                    });
                    const filteredProducts = sortedProducts.filter(product => {
                        return !product.isArchived;
                    });
                    setProducts(filteredProducts);  // Update state with sorted products
                    console.log('sorted list by rate:', sortedProducts);
                } else {
                    throw new Error("No data found in the response for products sorted by rating.");
                }
            } catch (err) {
                console.error("Error fetching products sorted by rating:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);  // Stop loading for activities
            }
        };

        const intervalId = setInterval(getProducts, 10000);  // Fetch products every 5 seconds

        return () => clearInterval(intervalId);  // Cleanup interval on component unmount
    }, []);

    // Assuming the wallet balance is fetched here (replace with your logic)
    useEffect(() => {
        const fetchWalletBalance = async () => {
            // Replace this with an actual API call to fetch the tourist's wallet balance
            const touristWalletBalance = 1000; // Mock balance for now
            console.log(touristWallet);
            setTouristWallet(touristWalletBalance);
        };

        fetchWalletBalance();
    }, []);

    const handlePurchase = async (product) => {
        if (touristWallet < product.price) {
            setPurchaseError("Insufficient funds in your wallet.");
            return;
        }

        try {
            const response = await purchaseProduct(email, product._id.toString());
            console.log('product id' , product._id )  ;// Assuming touristEmail is available
            if (response && response.message === "Product purchased successfully") {
                setTouristWallet(prevBalance => prevBalance - product.price); // Deduct product price from wallet
                setPurchaseError("");  // Clear any previous errors
                alert('Product purchased successfully');
                // a call to wassfy 
                //console.log("touristId inside productSort :", touristId)
                
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

// Using the function to update the product
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

    const handleAddToWishList = async (productId, touristId) => {
        try {
                console.log("productId : ", productId);
                console.log("touristId : ", touristId);
                const response = await addProductToWishlist(touristId, productId);
                alert(response.message);
            } catch (error) {
                alert(error);
            }
    };
                
    const handleAddToCart = async (productId) => {
        
            // first check there is enough stock
            const response = await fetchProductsNoID() ; // fetching all products 
            const products = response.data; 
            console.log("FetchedProductFromTheAddToCartIco:",products)
            // Filter the products to find the one with the specified productId
            const selectedProduct = products.find((product) => product._id === productId);
            console.log("RESULTOFFILTERIJUSTDID:",selectedProduct);
            if(selectedProduct.stock!=0){
                try {
            await addProductToCart(touristId, productId); // Assuming this removes the product in your backend
            alert(`Product added to cart.`);
        } catch (error) {
            console.error("Failed to add product to cart:", error);
        } } else {
            alert ('Product Out of Stock')
        }
    };
    // Toggle function
    const toggleMappings = () => setShowMappings(prevState => !prevState);

    // const ProductCard = ({ product }) => {
    //     return (
    //         <div className="itinerary-card">
    //             <h3>{product.name}</h3>
    //             <p><strong>Description:</strong> {product.description || "No description available"}</p>
    //             <p><strong>Price:</strong> {product.price} EGP</p>
    //             <p><strong>Rating:</strong> {product.rating}</p>
    //             <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>

    //             {/* Purchase Button */}
    //              {/*HERE ADD THE ICON OF ADD TO CART  */}
    //              <button
    //           className="add-to-cart-button"
    //           onClick={() => handleAddToCart(product._id)}
    //           title="Add to Cart"
    //           style={styles.addButton}
    //         >
    //           <FontAwesomeIcon icon={faShoppingCart} />
    //         </button>
    //             <button onClick={() => handleAddToWishList(product._id, touristId)}>Add to WishList</button>

    //             {/* Show error if wallet balance is insufficient */}
    //             {purchaseError && <p style={{ color: 'red' }}>{purchaseError}</p>}
    //         </div>
    //     );
    // };
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

                <button
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(product._id)}
                    title="Add to Cart"
                    style={styles.addButton}
                >
                    <FontAwesomeIcon icon={faShoppingCart} />
                </button>
                <button onClick={() => handleAddToWishList(product._id, touristId)}>Add to WishList</button>
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
                {purchaseError && <p style={{ color: 'red' }}>{purchaseError}</p>}
            </div>
        );
    };
    
    return (
        <div className="">
            
            {/* Toggle Button: Show/Hide Products */}
            <div >
            <button
      onClick={toggleMappings}
      //onMouseEnter={() => setHover(true)}
      //onMouseLeave={() => setHover(false)}
      className={styles.button}
    //   style={{
    //     width: "125%",
    //     color: "grey", // Change color on hover
    //     borderRadius: "5px",
    //     backgroundColor:"#70e8c472", // Change background color on hover
    //     height: "35px",
    //     marginLeft: "-12.5%",
    //     marginBottom: "-1rem",
    //     marginTop: "-20rem",
    //     borderColor: "#70e8c4",
    //   }}
    >
                {showMappings ? "Hide Products Sorted by Rating" : "Look up Products Sorted by Rating"}
            </button>
            </div>
            {loading && <p>Loading products sorted by rating...</p>}
            {error && <p>Error: {error}</p>}

            {showMappings && (
                <>
                    <h2>Products Sorted by Rating</h2>
                    {products.length === 0 ? (
                        <p>No products available sorted by rating.</p>
                    ) : (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </>
            )}
        </div>
    );
};

export default ProductSort;