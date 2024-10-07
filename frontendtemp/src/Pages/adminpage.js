import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductSort from  '../Components/SortProductRate.js'
function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [productFormData, setProductFormData] = useState({ name: '', price: '', details: '' });
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    setProductFormData({ ...productFormData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/categories', formData);
      setCategories([...categories, response.data.category]);
      setFormData({ name: '' });
      setSelectedOperation(null);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCategory) return;
    try {
      await axios.patch(`http://localhost:4000/api/categories/${selectedCategory}`, formData);
      fetchCategories();
      setFormData({ name: '' });
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (categoryName) => {
    try {
      await axios.delete(`http://localhost:4000/api/categories/${categoryName}`);
      setCategories(categories.filter((cat) => cat.name !== categoryName));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const newProduct = await axios.post('http://localhost:4000/api/products', productFormData);
      setProducts([...products, newProduct.data]);
      setProductFormData({ name: '', price: '', details: '' });
      setSelectedOperation(null);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    try {
      const updatedProduct = await axios.patch(`http://localhost:4000/api/products/${selectedProduct}`, productFormData);
      setProducts(products.map((product) => (product._id === updatedProduct.data._id ? updatedProduct.data : product)));
      setProductFormData({ name: '', price: '', details: '' });
      setSelectedProduct(null);
      setSelectedOperation(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  return (
    <div>
      <h1>Admin - Manage Categories and Products</h1>

      {/* Operation Selection */}
      {!selectedOperation && (
        <div>
          <button onClick={() => setSelectedOperation('create')}>Create Category</button>
          <button onClick={() => setSelectedOperation('read')}>View Categories</button>
          <button onClick={() => setSelectedOperation('delete')}>Delete Category</button>
          <button onClick={() => setSelectedOperation('update')}>Update Category</button>
          <button onClick={() => setSelectedOperation('createProduct')}>Create Product</button>
          <button onClick={() => setSelectedOperation('updateProduct')}>Update Product</button>
        </div>
      )}

      {/* Category Management */}
      {/* ... (existing category management UI) ... */}

      {selectedOperation === 'createProduct' && (
        <div>
          <h2>Create a New Product</h2>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productFormData.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Product Price"
            value={productFormData.price}
            onChange={handleInputChange}
          />
          <textarea
            name="details"
            placeholder="Product Details"
            value={productFormData.details}
            onChange={handleInputChange}
          />
          <button onClick={handleCreateProduct}>Create</button>
          <button onClick={() => setSelectedOperation(null)}>Back</button>
        </div>
      )}
      
      <ProductSort/>

      {/* Update Product */}
      {selectedOperation === 'updateProduct' && (
        <div>
          <h2>Update a Product</h2>
          <select
            onChange={(e) => {
              const productId = e.target.value;
              setSelectedProduct(productId);
              const product = products.find(prod => prod._id === productId);
              if (product) {
                setProductFormData({ name: product.name, price: product.price, details: product.details });
              }
            }}
            value={selectedProduct || ''}
          >
            <option value="" disabled>Select a product to update</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>{product.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            placeholder="New Product Name"
            value={productFormData.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="New Product Price"
            value={productFormData.price}
            onChange={handleInputChange}
          />
          <textarea
            name="details"
            placeholder="New Product Details"
            value={productFormData.details}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdateProduct}>Update</button>
          <button onClick={() => setSelectedOperation(null)}>Back</button>
        </div>
        
  )}
  </div>
);
}

export default AdminPage;
