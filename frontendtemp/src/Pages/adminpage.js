import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const [categories, setCategories] = useState([]); 
  const [formData, setFormData] = useState({ name: '' });
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // Track the category being edited

  // Fetch categories on page load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/categories');
      setCategories(response.data.data || []); // Ensure it's set correctly
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create a new category
  const handleCreate = async () => {
    console.log('Creating category with data:', formData); // Log the form data
    try {
      const response = await axios.post('http://localhost:4000/api/categories', formData);
      console.log('Category created:', response.data); // Log the response data
      setCategories([...categories, response.data.category]); // Update state with the new category
      setFormData({ name: '' }); // Reset form
      setSelectedOperation(null); // Return to main menu
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // Update a category
  const handleUpdate = async () => {
    if (!selectedCategory) {
      console.error('No category selected for update');
      return;
    }

    console.log('Updating category:', selectedCategory, 'with data:', formData);
    try {
      const response = await axios.patch(`http://localhost:4000/api/categories/${selectedCategory}`, formData);
      console.log('Category updated:', response.data);
      
      // Optionally, you can refetch categories to update the state
      fetchCategories();
      setFormData({ name: '' }); // Reset form after update
      setSelectedCategory(null); // Clear the selected category
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
  };
  

  // Delete a category
  const handleDelete = async (categoryId) => {
    console.log('Deleting category with ID:', categoryId); // Log the category ID
    try {
        const response = await axios.delete(`http://localhost:4000/api/categories/${categoryId}`); // Use ID in the URL
        console.log('Delete response:', response.data); // Log the response data
        // Update state to remove the deleted category
        setCategories(categories.filter((cat) => cat._id !== categoryId));
    } catch (error) {
        console.error('Error deleting category:', error);
    }
};



  return (
    <div>
      <h1>Admin - Manage Categories</h1>

      {/* Operation Selection */}
      {!selectedOperation && (
        <div>
          <button onClick={() => setSelectedOperation('create')}>Create Category</button>
          <button onClick={() => setSelectedOperation('read')}>View Categories</button>
          <button onClick={() => setSelectedOperation('delete')}>Delete Category</button>
          <button onClick={() => setSelectedOperation('update')}>Update Category</button>
        </div>
      )}

      {/* Create Category */}
      {selectedOperation === 'create' && (
        <div>
          <h2>Create a New Category</h2>
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <button onClick={handleCreate}>Create</button>
          <button onClick={() => setSelectedOperation(null)}>Back</button>
        </div>
      )}

      {/* Update Category */}
      {selectedOperation === 'update' && (
        <div>
          <h2>Update a Category</h2>
          <select
            onChange={(e) => {
              const categoryName = e.target.value;
              setSelectedCategory(categoryName);
              const category = categories.find(cat => cat.name === categoryName);
              if (category) {
                setFormData({ name: category.name });
              }
            }}
            value={selectedCategory || ''}
          >
            <option value="" disabled>Select a category to update</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            placeholder="New Category Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setSelectedOperation(null)}>Back</button>
        </div>
      )}

      {/* Read Categories */}
      {selectedOperation === 'read' && (
        <div>
          <h2>Existing Categories</h2>
          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                {category.name}
                {/* <button onClick={() => {
                  setSelectedOperation('update');
                  setSelectedCategory(category.name);
                  setFormData({ name: category.name }); */}
                {/* }}>Update</button> */}
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedOperation(null)}>Back</button>
        </div>
      )}

      {/* Delete Category */}
      {selectedOperation === 'delete' && (
    <div>
        <h2>Delete a Category</h2>
        <ul>
            {categories.map((category) => (
                <li key={category._id}>
                    {category.name}
                    {/* Pass the category ID instead of the name */}
                    <button onClick={() => handleDelete(category._id)}>Delete</button> 
                </li>
            ))}
        </ul>
        <button onClick={() => setSelectedOperation(null)}>Back</button>
    </div>
)}

    </div>
  );
}

export default AdminPage;
