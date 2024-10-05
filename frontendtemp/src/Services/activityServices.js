import axios from 'axios';

export const fetchActivities = async (advertiserId) => {
    const url = `http://localhost:4000/api/advertisers/${advertiserId}/activities`; 
    const response = await axios.get(url);
    return response.data;
};


export const fetchActivitiesDate = async () => {
    const url = `http://localhost:4000/api/activities/`;

    
    const currentDate = new Date();

    // Prepare parameters
    const params = { date: currentDate }; // Automatically set the current date

    // Make the API call with current date as filter
    const response = await axios.get(url, { params });

    return response.data; // Return the data
};


export const deleteActivity = async (activityId) => {
    const url = `http://localhost:4000/api/advertisers/${activityId}/activities`;
    await axios.delete(url);
};

export const updateActivity = async (activityId, updatedActivity) => {
    const url = `http://localhost:4000/api/advertisers/${activityId}/activities`;
    const response = await axios.put(url, updatedActivity); // Assuming your backend uses PUT for updates
    return response.data;
};

export const createActivity = async (newActivity) => {
    const url = `http://localhost:4000/api/activities/`;
    const response = await axios.post(url, newActivity);
    return response.data;
};

export const fetchCategories = async() => {
    const url = `http://localhost:4000/api/categories/`;
    const response = await axios.get(url);
    return response.data.data;
}

export const fetchCategoryById = async(categoryId) => {
    const url = `http://localhost:4000/api/categories/${categoryId}`;
    const response = await axios.get(url);
    return response.data;
}