import React, { useEffect, useState } from 'react';
import { fetchProductsNoID } from '../Services/productServices';
import styles from '../styles/TouristPage.module.css'; // Import CSS Module


const ProductSort = () => {
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMappings, setShowMappings] = useState(false);  // Toggle for activities

    useEffect(() => {
        const getProducts = async () => {
            try {   
                const Products = await fetchProductsNoID();
                //console.log("raw fetch products:", Products);
    
                if (Products && Products.data) {
                    // Filter out archived products
                    const unarchivedProducts = Products.data.filter(product => !product.isArchived);
                    
                    // Sort the unarchived products by rating
                    const sortedProducts = unarchivedProducts.sort((a, b) => b.rating - a.rating);
                    
                    setProducts(sortedProducts);  // Update state with sorted unarchived products
                    //console.log('sorted list of unarchived products by rating:', sortedProducts);
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
    
        getProducts();  // Fetch first set of products (sorted by rating)
    }, []);
    

    // Toggle function
    const toggleMappings = () => setShowMappings(prevState => !prevState);

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
        <div className={styles["category-buttons"]}>
             {/* <h2>Sorted by Rating </h2> */}
            
            {/* Toggle Button: Show/Hide Products */}
            <button onClick={toggleMappings}>
                {showMappings ? "Hide Products Sorted by Rating" : "Show Products Sorted by Rating"}
            </button>

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
