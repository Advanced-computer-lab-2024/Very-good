import React, { useEffect, useState } from 'react';
import {
    deletAdvertiser, 
    deleteTourGuide, 
    deleteSeller,
    fetchAdvertisers,
    fetchSellers,
    fetchTourGuides,
    fetchTourists
} from '../RequestSendingMethods';
import { deleteTourist } from '../Services/TouristService';
import { deleteActivity, fetchActivities } from '../Services/activityServices';
import { deleteItinerary, fetchItineraries } from '../Services/itineraryServices';
import { deleteProductsBySeller, fetchProductsNoID ,fetchProducts} from '../Services/productServices'; // Assuming this service is for fetching products

const Deletion = () => {
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all entities (Advertisers, Tourists, Tour Guides, Sellers) with delete flag set to true
    const fetchEntitiesToDelete = async () => {
        try {
            setLoading(true);

            const advertisersResponse = await fetchAdvertisers();
            const advertisersToDelete = advertisersResponse.data.filter(ad => ad.delete === true);

            const touristsResponse = await fetchTourists();
            const touristsToDelete = touristsResponse.data.filter(tourist => tourist.delete === true);

            const tourGuidesResponse = await fetchTourGuides();
            const tourGuidesToDelete = tourGuidesResponse.data.filter(guide => guide.delete === true);

            const sellersResponse = await fetchSellers();
            const sellersToDelete = sellersResponse.data.filter(seller => seller.delete === true);

            const allEntities = [
                ...advertisersToDelete.map(ad => ({ ...ad, role: 'Advertiser' })),
                ...touristsToDelete.map(tourist => ({ ...tourist, role: 'Tourist' })),
                ...tourGuidesToDelete.map(guide => ({ ...guide, role: 'Tour Guide' })),
                ...sellersToDelete.map(seller => ({ ...seller, role: 'Seller' })),
            ];

            setEntities(allEntities);
        } catch (err) {
            console.error("Error fetching entities:", err);
            setError("Failed to fetch entities.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntitiesToDelete();
    }, []);

    // Helper function to determine if an entity has bookings and count them
    const getBookingCount = async (entity) => {
        let itineraryCount = 0;
        let activityCount = 0;
        let productCount = 0;
    
        const touristList = await fetchTourists(); // Fetch list of tourists once
    
        if (entity.role === 'Tourist') {
            itineraryCount = entity.bookedItineraries?.length || 0;
            activityCount = entity.bookedActivities?.length || 0;
    
        } else if (entity.role === 'Advertiser') {
            // Fetch activities by Advertiser ID
            const activities = await fetchActivities(entity._id);
    
            // Count the total bookings for activities associated with this Advertiser
            activityCount = touristList.data.reduce((count, tourist) => {
                return count + (tourist.bookedActivities?.filter(activityID => 
                    activities.some(activity => activity._id === activityID)
                ).length || 0);
            }, 0);
    
        } else if (entity.role === 'Tour Guide') {
            // Fetch itineraries by Tour Guide ID
            const itineraries = await fetchItineraries(entity._id);
    
            // Count the total bookings for itineraries associated with this Tour Guide
            itineraryCount = touristList.data.reduce((count, tourist) => {
                return count + (tourist.bookedItineraries?.filter(itineraryID => 
                    itineraries.some(itinerary => itinerary._id === itineraryID)
                ).length || 0);
            }, 0);
    
        } else if (entity.role === 'Seller') {
            // Fetch all products
            const products = await fetchProductsNoID();
    
            // Filter products by sellerId and count them
            const sellerProducts = products.data.filter(product => product.sellerId === entity._id);
            productCount = sellerProducts.length;
        }
    
        return { itineraryCount, activityCount, productCount };
    };
    
    

    // Store the counts for each entity
    const [counts, setCounts] = useState({});

    // Fetch counts for each entity and update state
    const fetchCounts = async () => {
        let updatedCounts = {};

        for (let entity of entities) {
            const { itineraryCount, activityCount, productCount } = await getBookingCount(entity);
            updatedCounts[entity._id] = { itineraryCount, activityCount, productCount };
        }

        setCounts(updatedCounts);
    };

    // Call fetchCounts after entities have been fetched
    useEffect(() => {
        if (entities.length > 0) {
            fetchCounts();
        }
    }, [entities]);

    // Handle delete action (both frontend and backend)
    const handleDelete = async (entity) => {
        try {
            const { itineraryCount, activityCount, productCount } = counts[entity._id] || {};
    
            // Check if there are bookings or products to prevent deletion
            if (entity.role === 'Tourist' && (itineraryCount > 0 || activityCount > 0)) {
                alert(`Cannot delete Tourist with ${itineraryCount} itineraries and ${activityCount} activities.`);
                return;
            } else if (entity.role === 'Advertiser' && activityCount > 0) {
                alert(`Cannot delete Advertiser with ${activityCount} active activities.`);
                return;
            } else if (entity.role === 'Tour Guide' && itineraryCount > 0) {
                alert(`Cannot delete Tour Guide with ${itineraryCount} active itineraries.`);
                return;
            }
    
            // Delete from backend based on role
            if (entity.role === 'Advertiser') {
                const activities = await fetchActivities(entity._id); // Fetch activities related to the Advertiser
                await Promise.all(activities.map(activity => deleteActivity(activity._id))); // Delete all activities
                await deletAdvertiser(entity._id); // Delete the Advertiser
            } else if (entity.role === 'Tour Guide') {
                const itineraries = await fetchItineraries(entity._id); // Fetch itineraries related to the Tour Guide
                await Promise.all(itineraries.map(itinerary => deleteItinerary(itinerary._id))); // Delete all itineraries
                await deleteTourGuide(entity._id); // Delete the Tour Guide
            } else if (entity.role === 'Tourist') {
                await deleteTourist(entity._id); // Delete the Tourist directly
            } else if (entity.role === 'Seller') {
                console.log('Fetching products for deletion...');
                
                // Fetch and filter products
                const productResponse = await fetchProductsNoID();
                const filteredProducts = productResponse.data.filter(product => {
                    const productSellerId = String(product.sellerId);
                    const entitySellerId = String(entity._id);
                    return productSellerId === entitySellerId;
                });
            
                console.log(`Products to delete for Seller ${entity._id}:, filteredProducts`);
            
                // Delete each product related to the seller
                await Promise.all(
                    filteredProducts.map(async (product) => {
                        console.log(`Deleting product with ID: ${product?._id}`);
                        await deleteProductsBySeller(entity._id);
                    })
                );
            
                console.log(`Deleting seller with ID: ${entity._id}`);
                await deleteSeller(entity._id); // Delete the Seller
            }
            
            
            // Remove entity from frontend list after successful deletion
            setEntities((prevEntities) => prevEntities.filter((e) => e._id !== entity._id));
            alert(`${entity.role} deleted successfully.`);
        } catch (err) {
            console.error(`Error deleting ${entity.role}:`, err);
            setError(`Failed to delete ${entity.role}.`);
            alert(`An error occurred while trying to delete the ${entity.role}. Please try again.`);
        }
    };
    


    // Handle ignore action (frontend only)
    const handleIgnore = (entityId) => {
        setEntities(prevEntities => prevEntities.filter(entity => entity._id !== entityId));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Entities Marked for Deletion</h2>
            {entities.length === 0 ? (
                <p>No entities marked for deletion.</p>
            ) : (
                entities.map(entity => {
                    const { itineraryCount, activityCount, productCount } = counts[entity._id] || {};

                    return (
                        <div key={entity._id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                            <p>Role: {entity.role}</p>
                            <p>Email: {entity.email}</p>
                            <p>Name: {entity.name}</p>
                            <p>ID:{entity._id} </p>

                            {/* Show counts based on role */}
                            {entity.role === 'Tourist' && (
                                <p>Bookings: {itineraryCount + activityCount || 0}</p>
                            )}
                            {entity.role === 'Advertiser' && (
                                <p>Booked Activities Count: {activityCount || 0}</p>
                            )}
                            {entity.role === 'Tour Guide' && (
                                <p>Booked Itinerary Count: {itineraryCount || 0}</p>
                            )}
                            {entity.role === 'Seller' && (
                                <p>Product Count: {productCount || 0}</p>
                            )}

                            <button onClick={() => handleDelete(entity)} style={{ marginRight: '10px' }}>
                                Delete
                            </button>
                            <button onClick={() => handleIgnore(entity._id)}>Ignore</button>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Deletion;