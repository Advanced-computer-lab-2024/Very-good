// import React, { useState } from 'react';
 

// function FilterPage() {
//     const [activityFilters, setActivityFilters] = useState({
//         budget: '',
//         date: '',
//         category: '',
//         ratings: ''
//     });

//     const [itineraryFilters, setItineraryFilters] = useState({
//         budget: '',
//         startDate: '',
//         preferences: '',
//         language: ''
//     });

//     const [results, setResults] = useState(null);

//     // Function to handle filtering activities
//     const filterActivities = async () => {
//         try {
//             const response = await fetch('http://localhost:4000/api/activities/filter', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(activityFilters)
//             });
//             const data = await response.json();
//             setResults(data);
//         } catch (error) {
//             console.error('Error filtering activities:', error);
//         }
//     };

//     // Function to handle filtering itineraries
//     const filterItineraries = async () => {
//         try {
//             const response = await fetch('http://localhost:4000/api/itineraries/filter', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(itineraryFilters)
//             });
//             const data = await response.json();
//             setResults(data);
//         } catch (error) {
//             console.error('Error filtering itineraries:', error);
//         }
//     };

//     return (
//         <div className="filter-page">
//             <h1>Filter Activities</h1>
//             <form onSubmit={(e) => { e.preventDefault(); filterActivities(); }}>
//                 <label>Budget:</label>
//                 <input
//                     type="text"
//                     value={activityFilters.budget}
//                     onChange={(e) => setActivityFilters({ ...activityFilters, budget: e.target.value })}
//                 />
//                 <label>Date:</label>
//                 <input
//                     type="date"
//                     value={activityFilters.date}
//                     onChange={(e) => setActivityFilters({ ...activityFilters, date: e.target.value })}
//                 />
//                 <label>Category:</label>
//                 <input
//                     type="text"
//                     value={activityFilters.category}
//                     onChange={(e) => setActivityFilters({ ...activityFilters, category: e.target.value })}
//                 />
//                 <label>Ratings:</label>
//                 <input
//                     type="number"
//                     value={activityFilters.ratings}
//                     onChange={(e) => setActivityFilters({ ...activityFilters, ratings: e.target.value })}
//                 />
//                 <button type="submit">Filter Activities</button>
//             </form>

//             <h1>Filter Itineraries</h1>
//             <form onSubmit={(e) => { e.preventDefault(); filterItineraries(); }}>
//                 <label>Budget:</label>
//                 <input
//                     type="text"
//                     value={itineraryFilters.budget}
//                     onChange={(e) => setItineraryFilters({ ...itineraryFilters, budget: e.target.value })}
//                 />
//                 <label>Start Date:</label>
//                 <input
//                     type="date"
//                     value={itineraryFilters.startDate}
//                     onChange={(e) => setItineraryFilters({ ...itineraryFilters, startDate: e.target.value })}
//                 />
//                 <label>Preferences:</label>
//                 <input
//                     type="text"
//                     value={itineraryFilters.preferences}
//                     onChange={(e) => setItineraryFilters({ ...itineraryFilters, preferences: e.target.value })}
//                 />
//                 <label>Language:</label>
//                 <input
//                     type="text"
//                     value={itineraryFilters.language}
//                     onChange={(e) => setItineraryFilters({ ...itineraryFilters, language: e.target.value })}
//                 />
//                 <button type="submit">Filter Itineraries</button>
//             </form>

//             {/* Display Results */}
//             {results && (
//                 <div className="results">
//                     <h2>Results</h2>
//                     <pre>{JSON.stringify(results, null, 2)}</pre>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default FilterPage;


import React, { useState } from 'react';
import '../styles/global.css';
import { fetchFilteredProducts } from './frontendtemp/src/RequestSendingMethods'; // This should be the function that fetches the products

const ProductFilteringPage = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleFilter = async () => {
    try {
      const filters = {
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
      };
      
      const response = await fetchFilteredProducts(filters); // Assuming this is your API call method
      if (response) {
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  return (
    <div className="product-filtering-page">
      <h1>Filter Products</h1>

      <div className="filter-form">
        <label>Minimum Price:</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <label>Maximum Price:</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button className="btn" onClick={handleFilter}>
          Apply Filters
        </button>
      </div>

      <div className="filtered-results">
        <h2>Filtered Products</h2>
        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          <ul>
            {filteredProducts.map((product) => (
              <li key={product._id}>
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductFilteringPage;
