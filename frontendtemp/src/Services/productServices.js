import axios from 'axios';

export const fetchProducts = async (sellerId) => {
    const url = `http://localhost:4000/api//${sellerId}/products`; 
    const response = await axios.get(url);
    return response.data;
};


export const fetchProductsNoID = async () => {
    const url = `http://localhost:4000/api/products/`;
    const response = await axios.get(url);

    return response.data; 
};


export const deleteProduct = async (sellerId) => {
    const url = `http://localhost:4000/api/sellers/${sellerId}/products`;
    await axios.delete(url);
};

export const updateProduct = async (sellerId, productId, updatedData) => {
    const url = `http://localhost:4000/api/products/${sellerId}/products/${productId}`;
    console.log('Updating product at:', url);

    const response = await axios.patch(url, updatedData); // Change to PATCH if that is your backend method
    return response.data;
};

export const updateProductNoID = async (updateProduct) => {
    const url = `http://localhost:4000/api/products`;
    const response = await axios.put(url, updateProduct); // Assuming your backend uses PUT for updates
    return response.data;
};

export const createProduct = async (newProduct) => {
    console.log("will create itinerary now")
    console.log(newProduct)
    const url = `http://localhost:4000/api/products/`;
    const response = await axios.post(url, newProduct);
    console.log("created product")
    return response.data;
};