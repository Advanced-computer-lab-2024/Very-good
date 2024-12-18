import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductSort from "../Components/SortProductRate.js";
import {
  createProduct,
  updateProduct,
  fetchProductsNoID,
  updateProductAdmin,
  archiveProduct,
  unarchiveProduct,
} from "../Services/productServices";
// Ensure you import the CSS file
import styles from '../styles/SellerPage.module.css'; 
function AdminCategory({ sellerId, adminId }) {

  console.log("Seller ID:", sellerId);
  console.log("Admin ID:", adminId);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // Track the category being edited
  const [editMode, setEditMode] = useState(false); // Whether we're editing or creating
  const [currentProductId, setCurrentProductId] = useState(null);
  const [currentSellerId, setSellerProductId] = useState(null); // Product being edited
  const [products, setProducts] = useState([]); // List of products for the seller
  const [loading, setLoading2] = useState(true); // Loading state
  const [error2, setError2] = useState(null); // Error state
  const [showProductList, setShowProductList] = useState(false); // State to manage the visibility of the product list
  const [error, setError] = useState(null); // Error state


  const [formData2, setFormData2] = useState({
    name: "",
    sellerId: adminId || "", // Ensure sellerId is initialized correctly
    price: "",
    description: "",
    stock: "",
    rating: "",
    sales: "",
  });

  // Fetch categories on page load
  useEffect(() => {
    fetchCategories();
    getAdminProducts();
  }, [sellerId, adminId]);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/categories");
      setCategories(response.data.data || []); // Ensure it's set correctly
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getAdminProducts = async () => {
    try {
      const productsData = await fetchProductsNoID(); // Fetch products based on sellerId
      console.log("productsData", productsData);
      setProducts(productsData.data); // Set products fetched
    } catch (err) {
      setError2("Failed to fetch products.");
      console.error(err);
    } finally {
      setLoading2(false); // Stop loading
    }
  };

  // Handle form input change for categories
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Create a new category
  const handleCreate = async () => {
    console.log("Creating category with data:", formData); // Log the form data
    try {
      const response = await axios.post(
        "http://localhost:4000/api/categories",
        formData
      );
      console.log("Category created:", response.data); // Log the response data
      setCategories([...categories, response.data.category]); // Update state with the new category
      setFormData({ name: "" }); // Reset form
      setSelectedOperation(null); // Return to main menu
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };
  const handleArchive = async (productId) => {
    try {
      // Trigger archive operation
      await axios.patch(
        `http://localhost:4000/api/products/${productId}/archive`
      );
      // Update product list after successful archive operation
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod._id === productId ? { ...prod, isArchived: true } : prod
        )
      );
      console.log(`Product with ID ${productId} archived successfully.`);
    } catch (error) {
      console.error(
        "Error archiving product:",
        error.response?.data || error.message
      );
    }
  };

  const handleUnarchive = async (productId) => {
    try {
      // Trigger unarchive operation
      await axios.patch(
        `http://localhost:4000/api/products/${productId}/unarchive`
      );
      // Update product list after successful unarchive operation
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod._id === productId ? { ...prod, isArchived: false } : prod
        )
      );
      console.log(`Product with ID ${productId} unarchived successfully.`);
    } catch (error) {
      console.error(
        "Error unarchiving product:",
        error.response?.data || error.message
      );
    }
  };

  // Update a category
  const handleUpdate = async () => {
    if (!selectedCategory) {
      console.error("No category selected for update");
      return;
    }

    console.log("Updating category:", selectedCategory, "with data:", formData);
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/categories/${selectedCategory}`,
        formData
      );
      console.log("Category updated:", response.data);

      // Optionally, you can refetch categories to update the state
      fetchCategories();
      setFormData({ name: "" }); // Reset form after update
      setSelectedCategory(null); // Clear the selected category
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  // Delete a category
  const handleDelete = async (categoryId) => {
    console.log("Deleting category with ID:", categoryId); // Log the category ID
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/categories/${categoryId}`
      ); // Use ID in the URL
      console.log("Delete response:", response.data); // Log the response data
      // Update state to remove the deleted category
      setCategories(categories.filter((cat) => cat._id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Handle form input change for products
  const handleInputChangeP = (e) => {
    const { name, value } = e.target;
    setFormData2((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to create or update a product
  // Product Form Submission Handler
  const resetForm2 = () => {
    setFormData2({
      name: "",
      sellerId: adminId || "", // Reset to the correct sellerId
      price: "",
      description: "",
      stock: "",
      rating: "",
      sales: "",
    });
    setEditMode(false);
    setCurrentProductId(null);
    setSellerProductId(null); // Reset seller product ID
  };

  // Use resetForm2 in your submit handler
  const handleSubmitP = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData2.name ||
      !formData2.price ||
      !formData2.stock 
    ) {
      setError2("All fields are required.");
      return;
    }

    // Ensure price and stock are valid numbers
    if (isNaN(formData2.price) || isNaN(formData2.stock)) {
      setError2("Price and stock must be valid numbers.");
      return;
    }

    try {
      if (editMode && currentProductId) {
        console.log("Current Product ID:", currentProductId); // Log current product ID
        const product = products.find((prod) => prod._id === currentProductId);
          if (product && product.sellerId) {
            formData2.sellerId = product.sellerId;
            await updateProduct(formData2.sellerId, currentProductId, {
              ...formData2,
            });
          } else {
            formData2.sellerId = adminId;
            await updateProductAdmin(formData2.sellerId, currentProductId, {
              ...formData2,
            });
          }
        setProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod._id === currentProductId ? { ...prod, ...formData2 } : prod
          )
        );
        alert("Product updated successfully.");
      } else {
        formData2.sellerId = adminId; // Ensure sellerId is set to adminId
        console.log("formData2:", formData2); // Log the form data
        const response = await axios.post('http://localhost:4000/api/admins/createProduct', formData2);
        const newProduct = response.data.product;
        setProducts((prevProducts) => {
          if (!Array.isArray(prevProducts)) {
            return [newProduct];
          }
          return [...prevProducts, newProduct];
        });
        alert("Product created successfully.");
      }
      resetForm2();
    } catch (err) {
      console.error(
        "Error updating product:",
        err.response ? err.response.data : err.message
      );
      setError2("Failed to save product. Please check your input.");
    }
  };

  // Edit product function
  const handleEditP = (product) => {
    setFormData2({
      name: product.name,
      sellerId: product.sellerId || sellerId, // Ensure the sellerId is included
      price: product.price,
      description: product.description,
      stock: product.stock,
      rating: product.rating,
      sales: product.sales,
    });
    setEditMode(true);
    setCurrentProductId(product._id); // Set the current product ID
    setSellerProductId(formData2.sellerId); // Store the seller ID for reference
    setSelectedOperation("create-product"); // Switch to the product form
  };

  return (
    <div className={styles['category-buttons']}>
      
      <h1 className={styles.h1}>Manage Categories</h1>

      {/* Operation Selection */}
      {!selectedOperation && (
        <div>
          <button className={styles.button} onClick={() => setSelectedOperation("create")}>
            Create Category
          </button>
          <button  className={styles.button} onClick={() => setSelectedOperation("read")}>
            View Categories
          </button>
          <button  className={styles.button} onClick={() => setSelectedOperation("delete")}>
            Delete Category
          </button>
          <button className={styles.button} onClick={() => setSelectedOperation("update")}>
            Update Category
          </button>
         
        </div>
      )}

      {/* Create Category */}
      {selectedOperation === "create" && (
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
      {selectedOperation === "update" && (
        <div>
          <h2>Update a Category</h2>
          <select
            onChange={(e) => {
              const categoryName = e.target.value;
              setSelectedCategory(categoryName);
              const category = categories.find(
                (cat) => cat.name === categoryName
              );
              if (category) {
                setFormData({ name: category.name });
              }
            }}
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="New Category Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <button onClick={handleUpdate}>Update</button>
            </div>
          )}
          <button onClick={() => setSelectedOperation(null)}>Back</button>
        </div>
      )}

      {/* Delete Category */}
      {selectedOperation === "delete" && (
        <div>
          <h2>Delete a Category</h2>
          <select
            onChange={(e) => {
              const categoryId = e.target.value;
              if (categoryId) handleDelete(categoryId); // Call delete function
            }}
          >
            <option value="">Select a Category to Delete</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <button onClick={() => setSelectedOperation(null)}>Back</button>
        </div>
      )}

      {/* View Categories */}
      {selectedOperation === "read" && (
        <div>
          <h2>Categories List</h2>
          {categories.length > 0 ? (
            <ul>
              {categories.map((category) => (
                <li key={category._id}>{category.name}</li>
              ))}
            </ul>
          ) : (
            <p>No categories available.</p>
          )}
          <button onClick={() => setSelectedOperation(null)}>Back</button>
        </div>
      )}

     

      <h1>Manage Products</h1>
      {!selectedOperation && (
        <div >
        
          <button  className={styles.button} onClick={() => setSelectedOperation("create-product")}>
            Create product
          </button>
          <button className={styles.button} onClick={() => setSelectedOperation("show-products")}>
            show products
          </button>
          {/* <button className={styles.button} onClick={() => setSelectedOperation("show-products-rate")}>
            show products sorted by rating
          </button> */}
          <div style={{marginTop : "-10px" , marginLeft : '20px'} }>  
         
          </div>
          {/* <ProductSort/> */}
        </div>
        
      )}
      
      {selectedOperation === "show-products-rate" && (
   <div>
   
   {/* <ProductSort /> */}
 </div>
)}
 {selectedOperation === "create-product" && (
          <div>

      <h2>{editMode ? "Edit Product" : "Create New Product"}</h2>

      {/* Product Form */}

      {/* Product Form */}
      <form className={styles['category-buttons']} onSubmit={handleSubmitP} style={{margin : '0 auto'}}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData2.name}
          onChange={handleInputChangeP}
          required
        />
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData2.price}
          onChange={handleInputChangeP}
          required
          min="0" // Validation for positive numbers
          step="0.01" // Allows decimal values (e.g., 0.00, 0.01, etc.)
        />
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData2.description}
          onChange={handleInputChangeP}
        />
        <label>Stock</label>
        <input
          type="number"
          name="stock"
          value={formData2.stock}
          onChange={handleInputChangeP}
          required
          min="0" // Validation for positive numbers
        />

        <button type="submit">
          {editMode ? "Update Product" : "Create Product"}
        </button>
        {editMode && (
          <button type="button" onClick={resetForm2}>
            Cancel Edit
          </button>
        )}
      </form>
          <button onClick={() => setSelectedOperation(null)}>Back</button>
        </div>)}

      
        {selectedOperation === "show-products" && (
  <div>
    {loading ? (
      <p>Loading products...</p>
    ) : error2 ? (
      <p>{error2}</p>
    ) : (
      <div>
        <h2>Products List</h2>
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-container">
                <h3>{product.name}</h3>
                <p className="price">Price: {product.price}</p>
                <p>Description: {product.description}</p>
                <p>Stock: {product.stock}</p>
                <p>Rating: {product.rating}</p>
                <p>Sales: {product.sales}</p>
                {product.isArchived ? (
                  <button className="unarchive-button" onClick={() => handleUnarchive(product._id)}>
                    Unarchive
                  </button>
                ) : (
                  <button className="archive-button" onClick={() => handleArchive(product._id)}>
                    Archive
                  </button>
                )}
                <button className="edit-product-button" onClick={() => handleEditP(product)}>
                  Edit
                </button>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
    )}
    <button onClick={() => setSelectedOperation(null)}>Back</button>
  </div>
)}
    </div>
    
  );
}
export default AdminCategory;