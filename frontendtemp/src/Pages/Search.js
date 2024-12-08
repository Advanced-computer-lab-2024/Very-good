import React, { useState } from 'react';
import {searchbyname} from '../Services/productServices';
import {getavailableProducts} from '../Services/productServices';

const Search = () => {
    //console.log("aywa hya deh el page el bt3ml el bali balak");
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productError, setProductError] = useState(null);
    const [products, setProducts] = useState([]);
    const [Availableproducts, setAvailableProducts] = useState([]);
    const [showProducts, setShowProducts] = useState(false); // State to control the visibility of products
    const [availableproductError, setAvailableProductError] = useState(null);
    const [loadingAvailableProducts, setLoadingAvailableProducts] = useState(false);
    const [showAvailableProducts, setShowAvailableProducts] = useState(false); // State to control the visibility of available products
    const [showReviews, setShowReviews] = useState({});

    const toggleReviews = (productId) => {
        setShowReviews(prevState => ({
            ...prevState,
            [productId]: !prevState[productId]
        }));
    };

    const handleSearchProductbyname = async () => {
        setLoadingProducts(true);
        setProductError(null);
        try {
            const productsResults = await searchbyname({name : productSearchTerm} ); // Search for activities
            setProducts(productsResults);
        } catch (err) {
            setProductError('Failed to fetch activities');
        } finally {
            setLoadingProducts(false);
        }
        setShowProducts(!showProducts); // Toggle visibility
    };

    const fetchProducts = async () => {
        setLoadingAvailableProducts(true); // Set loading state correctly
        setAvailableProductError(null); // Reset the error state
        try {
            const products = await getavailableProducts(); // Fetch the available products
            setAvailableProducts(products); // Update the state with the fetched products
        } catch (error) {
            setAvailableProductError(error.message); // Handle errors
        } finally {
            setLoadingAvailableProducts(false); // Reset loading state
        }
    };
    
    // Handle button click to show available products
    const handleShowProducts = () => {
        fetchProducts();
        setShowAvailableProducts(!showAvailableProducts); // Toggle visibility
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
            </div>
        );
    };

    return (
        <div>
            {/* Search box for products */}
        <div>
            <h2>Search products</h2>
            <input
                type="text"
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                placeholder="Search products by name"
            />
            <button onClick={handleSearchProductbyname}>
                {showProducts ? 'Hide Products' : 'Search Products by name'}
            </button>
            {loadingProducts && <p>Loading Products...</p>}
            {productError && <p>{productError}</p>}
            {showProducts && (
                <div>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        !loadingProducts && <p>No products found.</p>
                    )}
                </div>
            )}
        </div>
        <div>
            <h2>Available Products</h2>
            <button onClick={handleShowProducts}>
                {showAvailableProducts ? 'Hide Available Products' : 'Show Available Products'}
            </button>
            {loadingAvailableProducts && <p>Loading available products...</p>}
            {availableproductError && <p>{availableproductError}</p>}
            {showAvailableProducts && (
                <div>
                    {Availableproducts.length > 0 ? ( // Use Availableproducts instead of products
                        Availableproducts.map((product) => ( // Map over the correct state variable
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        !loadingAvailableProducts && <p>No products available.</p>
                    )}
                </div>
            )}
        </div>
    </div>
);
};

export default Search;
