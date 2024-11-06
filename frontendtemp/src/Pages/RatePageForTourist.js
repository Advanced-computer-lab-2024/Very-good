import React, { useState, useEffect } from 'react';
import { fetchPastbookedbytouristItineraries, fetchPastbookedbytouristItinerariesItneraryComment, fetchPurchasedProducts, rateTourGuide, rateItinerary, rateProduct } from '../RequestSendingMethods';
import '../styles/global.css';

const RatePageForTourist = ({ onBackClick, email }) => {
    const [tourGuides, setTourGuides] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [ratetype, setratetype] = useState(null);
    const [rate, setrate] = useState(0);

    useEffect(() => {
        if (ratetype === 'tourGuide') {
            loadTourGuides();
        } else if (ratetype === 'itinerary') {
            loaditinerariesWithTourGuideName();
        } else if (ratetype === 'product') {
            loadPurchasedProducts();
        }
    }, [ratetype]);

    const loadTourGuides = async () => {
        try {
            const response = await fetchPastbookedbytouristItineraries(email);
            if (response && Array.isArray(response.data)) {
                setTourGuides(response.data);
            }
        } catch (error) {
            console.error('Error fetching tour guides:', error);
        }
    };

    const loaditinerariesWithTourGuideName = async () => {
        try {
            const response = await fetchPastbookedbytouristItinerariesItneraryComment(email);
            if (response && Array.isArray(response.data)) {
                setItineraries(response.data);
            }
        } catch (error) {
            console.error('Error fetching itineraries:', error);
        }
    };

    const loadPurchasedProducts = async () => {
        try {
            const response = await fetchPurchasedProducts(email);  // Fetch purchased products
            if (response && Array.isArray(response.data)) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching purchased products:', error);
        }
    };

    const handleTourGuideSelection = () => setratetype('tourGuide');
    const handleProductSelection = () => setratetype('product');
    const handleItinerarySelection = () => setratetype('itinerary');

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setratetype('rateItem');
    };

    const handleStarClick = (star) => setrate(star);

    const handleDoneClick = async () => {
        try {
            if (ratetype === 'tourGuide' && selectedItem.email) {
                await rateTourGuide(selectedItem.email, rate);
                console.log(`Tour guide ${selectedItem.email} rated with ${rate} stars.`);
            } else if (ratetype === 'itinerary' && selectedItem.itineraryId) {
                await rateItinerary(selectedItem.itineraryId, rate);
                console.log(`Itinerary ${selectedItem.itineraryTitle} rated with ${rate} stars.`);
            } else if (ratetype === 'product' && selectedItem.productId) {
                await rateProduct(selectedItem.productId, rate); // Rating product
                console.log(`Product ${selectedItem.productTitle} rated with ${rate} stars.`);
            }

            setrate(0);
            setSelectedItem(null);
            setratetype(null);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    return (
        <div className="container">
            {!ratetype ? (
                <div>
                    <p>What would you like to rate?</p>
                    <button onClick={handleTourGuideSelection} className="button">
                        Tour Guide
                    </button>
                    <button onClick={handleProductSelection} className="button">
                        Product
                    </button>
                    <button onClick={handleItinerarySelection} className="button">
                        Itinerary
                    </button>
                </div>
            ) : ratetype === 'tourGuide' && !selectedItem ? (
                <div>
                    <h3>Select a Tour Guide to Rate</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tourGuides.map((email, index) => (
                                <tr key={index}>
                                    <td>{email}</td>
                                    <td>
                                        <button onClick={() => handleItemClick(email)}>Select</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : ratetype === 'itinerary' && !selectedItem ? (
                <div>
                    <h3>Select an Itinerary to Rate</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Itinerary Title</th>
                                <th>Tour Guide Name</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itineraries.map((itinerary, index) => (
                                <tr key={index}>
                                    <td>{itinerary.itineraryTitle}</td>
                                    <td>{itinerary.tourGuideName}</td>
                                    <td>
                                        <button onClick={() => handleItemClick(itinerary)}>Select</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : ratetype === 'product' && !selectedItem ? (
                <div>
                    <h3>Select a Product to Rate</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product Title</th>
                                <th>Price</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.title}</td>
                                    <td>${product.price}</td>
                                    <td>
                                        <button onClick={() => handleItemClick(product)}>Select</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <h3>Rate {selectedItem.title ? selectedItem.title : selectedItem.email}</h3>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rate ? 'filled' : ''}`}
                                onClick={() => handleStarClick(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <button onClick={handleDoneClick} className="done-button">Done</button>
                </div>
            )}
            <button onClick={onBackClick} className="back-button">Back</button>
        </div>
    );
};

export default RatePageForTourist;
