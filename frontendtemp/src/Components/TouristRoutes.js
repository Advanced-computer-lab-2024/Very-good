import { Routes, Route } from 'react-router-dom';
import TouristPage from './TouristPage';
import FilterActivitiesPage from './FilterActivitiesPage';
import FilterItenaryPage from './FilterItenaryPage';
import FilterHistoricalPage from './FilterHistoricalPage';
import FilterProductByPrice from './FilterProductByPrice';
import CommentPageForTourist from './CommentPageForTourist';
import TouristComplaint from './TouristComplaint';
import TouristLayout from './TouristLayout'; // The layout component

const TouristRoutes = () => {
    return (
        <Routes>
            <Route element={<TouristLayout />}> {/* Wrap all pages with the layout */}
                <Route path="/tourist" element={<TouristPage />} />
                <Route path="/tourist/filterActivities" element={<FilterActivitiesPage />} />
                <Route path="/tourist/filterItinerary" element={<FilterItenaryPage />} />
                <Route path="/tourist/filterHistorical" element={<FilterHistoricalPage />} />
                <Route path="/tourist/filterProducts" element={<FilterProductByPrice />} />
                <Route path="/tourist/comment" element={<CommentPageForTourist />} />
                <Route path="/tourist/complaint" element={<TouristComplaint />} />
                {/* Add all other routes */}
            </Route>
        </Routes>
    );
};

export default TouristRoutes;
