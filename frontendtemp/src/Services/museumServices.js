import axios from 'axios';

export const fetchMuseums = async () => {
    const url = `http://localhost:4000/api/historicalPlaces/`; 
    const response = await axios.get(url);
    return response.data;
};

export const deleteMuseum = async (museumId) => { 
    const url = `http://localhost:4000/api/historicalPlaces/${museumId}`;
    await axios.delete(url);
};

export const updateMuseum = async (museumId, updatedMuseum) => { // do
    const url = `http://localhost:4000/api/historicalPlaces/${museumId}`;
    const response = await axios.put(url, updatedMuseum); // Assuming your backend uses PUT for updates
    return response.data;
};

export const createMuseum = async (newMuseum) => {
    const url = `http://localhost:4000/api/historicalPlaces/`;
    const response = await axios.post(url, newMuseum);
    return response.data;
};

export const fetchTags = async() => {
    const url = `http://localhost:4000/api/tags/`;
    const response = await axios.get(url);
    return response.data.data;
}