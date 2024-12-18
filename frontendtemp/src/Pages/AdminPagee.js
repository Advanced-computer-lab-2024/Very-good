import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import '../styles/global.css'; // Ensure to have your CSS file
import { fetchAllTags, updateTag, deleteTag, addAdmin, addTourismGoverner,fetchAllItineraries } from '../RequestSendingMethods'; // Import the addAdmin and addTourismGoverner methods
import AdminDelete from './AdminDelete'; // Import the new AdminDelete component
import AdminCategory from './AdminCategory';
import Search from './Search'
import FilterProductByPrice from './FilterProductByPrice'
import AdminCreateTag from './AdminCreateTag'
import AdminDocumentManagementPage from './AdminDocumentManagementPage'
import ComplaintsList from './ComplaintsList'
import Deletion from '../Components/DeleteAdmin';
import ShowAllproducts from '../Components/ShowAllproducts'
import RevenuePage from '../Services/AdminSprint3Services'
import ProductSort from "../Components/SortProductRate.js";
import './admin.css'; 
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import styles from '../styles/SellerPage.module.css'; 
import NumberofUsers from './NumberofUsers.js';
const AdminPage = ({email}) => {
    
    const location = useLocation();

    const login = location.state?.login || false;
    if(login){
    const userData = JSON.parse(localStorage.getItem('userData'));
    email = userData?.email;
    }

    const [adminActivities, setAdminActivities] = useState([
        { id: 1, title: 'Add Admins' },
        { id: 2, title: 'View Tags' },
        { id: 3, title: 'Add Tourism Governor' }, // New activity for adding tourism governor
        { id: 4, title: 'Delete User' }, // New activity for deleting admin
        {id :5 ,title : 'FilterProductsByPrice' },
        {id :6,title :'Create_Tag'},
        { id: 7, title: 'View Itineraries' },
        { id: 8,title : 'View Documents'},
        { id:9,title :'View Complaints'},
        {id:10,title:'View All products 3la ndafa'},
        {id:11,title:'View Sales Report Page'}

    ]);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tags, setTags] = useState([]); // State to hold the tags
    const [editingTag, setEditingTag] = useState(null); // State for the tag currently being edited
    const [formData, setFormData] = useState({ name: '' }); // State for form data
    const [isAddingAdmin, setIsAddingAdmin] = useState(false); // State to manage visibility of the add admin form
    const [isAddingGovernor, setIsAddingGovernor] = useState(false); // State to manage visibility of the add tourism governor form
    const [adminData, setAdminData] = useState({ name: '', password: '', email: '' }); // State for admin form data including email
    const [adminId, setAdminId] = useState(''); // State for admin ID
    const [governorData, setGovernorData] = useState({ username: '', email: '', password: '', mobile: '', nationality: '', dob: '' }); // State for governor form data
    const [showAdminDelete, setShowAdminDelete] = useState(false); // State to manage visibility of AdminDelete page
    const [showSearchPage,setShowSearchPage]=useState(false);
    const [showProductFilterPage,setShowProductFilterPage]=useState(false);
    const [showCreateTagPage,setshowCreateTagPage]=useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [showDocumentManagmentPage,setshowDocumentPage]=useState(false);
    const [ShowViewComplaintsPage,setShowViewComplaintsPage]=useState(false);
    const [showAllproductsMahmoud,SetshowAllproductsMahmoud]=useState(false);
    const [showSalesReport,SetShowSalesReport]=useState(false);
    const [showNumberOfUsers,setShowNumberOfUsers]=useState(false);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await axios.post('http://localhost:4000/api/admins/getAdminByEmail', {
                    adminEmail: email,
                });
    
                const data = response.data;
                setAdminData(data);
                setAdminId(data._id); // Set the admin ID
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };
    
        fetchAdminData();
    }, [email]);

    const handleBackFromSalesReportPage =()=>{
        SetShowSalesReport(false);
    }
    const handleSalesReportPage=()=>{
        SetShowSalesReport(true);
    }
    const handleNumberOfUsers=()=>{
        setShowNumberOfUsers(true);
    }
    const handleShowAllProductsMahmoud =()=>{
        SetshowAllproductsMahmoud(true);
    }
   const handleViewDocmunets=()=>{
    setshowDocumentPage(true);
   }
   const handleViewComplaints = () => {
    setShowViewComplaintsPage(true);
};    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [oldEmail, setOldEmail] = useState(email);
    const [isChangingPassword, setIsChangingPassword] = useState(false); // State for showing password change form
    const [newPassword, setNewPassword] = useState(''); // State for the new password
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirming the new password
    const navigate = useNavigate();
    
    const handleChangePassword = () => {
        setIsChangingPassword(!isChangingPassword); // Toggle the password change form
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!'); // Ensure passwords match
            return;
        }

        try {
            // Here you would call a function to update the password, e.g., updatePassword(oldEmail, newPassword)
            // For demonstration purposes, we'll log the new password
            console.log('Changing password for:', oldEmail, 'to:', newPassword);

            // Reset form after submission
            setNewPassword('');
            setConfirmPassword('');
            setIsChangingPassword(false);
            alert('Password changed successfully!'); // Notify the user of success
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Failed to change password.'); // Notify the user of failure
        }
    };
    
    // Action listeners
    const handleCreateTag=()=>{
        setshowCreateTagPage(true);
    }
    if(showCreateTagPage){
       return <AdminCreateTag/>
    }
    const handleAddAdmins = () => {
        setIsAddingAdmin(true); // Show the add admin form
    };
    const handleFilterProductByPrice =() =>{
        setShowProductFilterPage(true);
    }
    if(showProductFilterPage){
        return <FilterProductByPrice />
    }

    const handleViewTags = async () => {
        const fetchedTags = await fetchAllTags();
        if (fetchedTags) {
            console.log('Retrieved tags:', fetchedTags);
    
            // Filter tags to keep only those with category 'preference'
            const filteredTags = fetchedTags.filter(tag => tag.category === 'preference');
    
            // Update the state with the filtered tags
            setTags(filteredTags);
        } else {
            console.error('Failed to retrieve tags.');
        }
    };
    

    const handleAddGovernor = () => {
        setIsAddingGovernor(true); // Show the add tourism governor form
    };

    const handleEditTag = (tag) => {
        // Set the editing tag and populate form data
        setEditingTag(tag._id);
        setFormData({ name: tag.name }); // Populate form data with tag name
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Update form data state
    };

    const handleAdminFormChange = (e) => {
        const { name, value } = e.target;
        setAdminData({ ...adminData, [name]: value }); // Update admin form data state
    };

    const handleGovernorFormChange = (e) => {
        const { name, value } = e.target;
        setGovernorData({ ...governorData, [name]: value }); // Update governor form data state
    };

    const handleAdminFormSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const result = await addAdmin(adminData); // Call the addAdmin method
            console.log('Admin Data Submitted:', result); // Log the result of the request
            
            // Optionally, handle successful admin creation here
            alert(result.message || 'Admin created successfully!');

            // Reset form and close it after submission
            setAdminData({ name: '', password: '', email: '' }); // Reset email field
            setIsAddingAdmin(false); // Hide the form
        } catch (error) {
            console.error('Failed to add admin:', error.response ? error.response.data : error.message);
            alert('Error creating admin: ' + (error.response.data.message || 'An error occurred.')); // Notify the user
        }
    };

    const handleGovernorFormSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const result = await addTourismGoverner(governorData); // Call the addTourismGoverner method
            console.log('Tourism Governor Data Submitted:', result); // Log the result of the request
            
            // Optionally, handle successful governor creation here
            alert(result.message || 'Tourism Governor created successfully!');

            // Reset form and close it after submission
            setGovernorData({ username: '', email: '', password: '', mobile: '', nationality: '', dob: '' }); // Reset governor data fields
            setIsAddingGovernor(false); // Hide the form
        } catch (error) {
            console.error('Failed to add tourism governor:', error.response ? error.response.data : error.message);
            alert('Error creating tourism governor: ' + (error.response.data.message || 'An error occurred.')); // Notify the user
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const result = await updateTag(editingTag, formData);
        if (result) {
            setTags(tags.map(tag => (tag._id === editingTag ? { ...tag, name: formData.name } : tag))); // Update the tag in the state
            setEditingTag(null); // Clear editing state
            setFormData({ name: '' }); // Clear form data
        } else {
            console.error('Failed to update tag.'); // Handle failure case
        }
    };

    const handleDeleteTag = async (tagId) => {
        const confirmed = window.confirm('Are you sure you want to delete this tag?');
        if (confirmed) {
            const result = await deleteTag(tagId);
            if (result) {
                setTags(tags.filter(tag => tag._id !== tagId)); // Remove the deleted tag from the state
            } else {
                console.error('Failed to delete tag.');
            }
        }
    };
    
    const handleNewButtonClick = () => {
        // Action listener for the new button
        // Add your functionality here
        // e.g., console.log('New Button Clicked');
        setShowSearchPage(true);
    };

    const handleViewItineraries = async () => {
        const fetchedItineraries = await fetchAllItineraries();
        if (fetchedItineraries) {
            setItineraries(fetchedItineraries); // Update state
            console.log('Retrieved itineraries:', fetchedItineraries);
        } else {
            console.error('Failed to retrieve itineraries.');
        }
    };
    const handleFlagItinerary = async (id, isFlagged) => {
        console.log("itineraryId : ", id);
        try {
            const response = await fetch(`http://localhost:4000/api/itineraries/${id}/flag`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log("response : ", response);
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to toggle flag status:', response.status, errorText);
                throw new Error('Failed to toggle flag status');
            }
    
            const data = await response.json();
            console.log(`Itinerary ${id} ${isFlagged ? 'unflagged' : 'flagged'}:`, data);
    
            // Update state to reflect the new flag status
            setItineraries(prevItineraries =>
                prevItineraries.map(itinerary =>
                    itinerary._id === id ? { ...itinerary, flagged: !itinerary.flagged } : itinerary // Toggle the flag status in the state
                )
            );
        } catch (error) {
            console.error('Error toggling flag status for itinerary:', error);
        }
    };
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
      };
    
      const handleUpdateProfile = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
          if (editedData.email !== oldEmail) {
            setOldEmail(editedData.email);
          }
          setAdminData(editedData);
        //   updateTouristByEmailT(oldEmail, editedData);
        }
      };

    
    // render the document managment page 
    if(showDocumentManagmentPage){
        return <AdminDocumentManagementPage/>
    }
    if(ShowViewComplaintsPage){
        return<ComplaintsList/>
    }
    if(showAllproductsMahmoud){
        return <ShowAllproducts/>
    }
    if(showSalesReport){
        return <RevenuePage/>
    }
    if(showNumberOfUsers){
        return <NumberofUsers/>
    }
    
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

    return (
        <div className='admin'> 
        <button
        className={styles['toggle-btn']} // Use the CSS Module for button
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>
      <header className={styles.header}> 
            <h1 >Welcome to the Admin Page!</h1>
         </header> 
           
        {/* ... existing JSX */}
        <button className="btn" onClick={handleChangePassword}>
                {isChangingPassword ? 'Cancel' : 'Change Password'}
            </button>

            {isChangingPassword && (
                <div className="change-password-form">
                    <h3>Change Password</h3>
                    <form onSubmit={handlePasswordChange}>
                        <label>
                            New Password:
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Confirm Password:
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Change Password</button>
                    </form>
                </div>
            )}
      
    
       <AdminCategory adminId={adminId} />
     
        {showSearchPage ? ( // Conditional rendering for Search page
          <div className={styles['category-buttons']}>
            <Search /> 
             <button onClick={() => window.location.reload()}>Back </button>
        </div>
        ) : showAdminDelete ? ( // Conditional rendering for AdminDelete page
            <AdminDelete onBack={() => setShowAdminDelete(false)} /> // Pass back function to return to AdminPage
        ) : (
           
            <>
           
                    
                    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`} style={{ margin: '0 auto', width: isSidebarOpen ? '250px' : '0' }}>
                    <div className={styles['category-buttons3']}>
                        <h3>Quick Links</h3>
                      
                       <button className={styles.button2} onClick={handleAddAdmins}>Add Admins</button>
                       < button className={styles.button2} onClick ={handleFilterProductByPrice}>Filter Products</button>
                       <button className={styles.button2}onClick={handleCreateTag}>Create Tag</button>
                       <button className={styles.button2} onClick={handleViewTags}>View Tags</button>
                       <button className={styles.button2} onClick={handleAddGovernor}>Add Tourism Governor</button>
                       <button className={styles.button2} onClick={() => setShowAdminDelete(true)}>Delete User</button>
                       <button className={styles.button2} onClick={handleNewButtonClick}>Show/Search Products</button>
                       <button className={styles.button2} onClick={handleViewItineraries}>View Itineraries</button>
                       <button className={styles.button2} onClick={handleViewDocmunets}>View Documents</button>
                       <button className={styles.button2} onClick={handleViewComplaints}>View Complaints</button>
                       <button className={styles.button2}onClick={handleShowAllProductsMahmoud}>Upload Product Pictures</button>
                       <button className={styles.button2} onClick={handleSalesReportPage}>View Sales Report</button>
                       <button className={styles.button2} onClick={handleNumberOfUsers}>View Number Of Users</button>

                    </div>
                    </div>

                    
                    <div className="tags-container">
                        {tags.length > 0 ? (
                            tags.map(tag => (
                                <div key={tag._id} className="tag-card">
                                    <h4 className="tag-title">{tag.name}</h4>
                                    <div className="tag-actions">
                                        <button className="edit-button" onClick={() => handleEditTag(tag)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDeleteTag(tag._id)}>Delete</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p></p>
                        )}
                    </div>
                    <div className="itineraries-container">
    {itineraries.length > 0 ? (
        itineraries.map(itinerary => (
            <div key={itinerary._id} className="itinerary-card">
                <h4 className="itinerary-title">
                    {itinerary.title}
                    {itinerary.flagged && <span style={{ color: 'red', marginLeft: '5px' }}>Flagged</span>}
                </h4>
                <button 
    className="flag-button" 
    onClick={() => handleFlagItinerary(itinerary._id, itinerary.flagged)}>
    {itinerary.flagged ? 'Already Flagged' : 'Flag Itinerary'}
</button>

            </div>
        ))
    ) : (
        <p></p>
    )}
</div>

                  
    

                    {/* Editing Form */}
                    {editingTag && (
                        <div className="edit-form">
                            <h3>Edit Tag</h3>
                            <form onSubmit={handleFormSubmit}>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </label>
                                <button type="submit">Update Tag</button>
                                <button type="button" onClick={() => setEditingTag(null)}>Cancel</button>
                            </form>
                        </div>
                    )}

                    {/* Add Admin Form */}
                    {isAddingAdmin && (
                        <div className={styles['container-buttons']}>
                            <h3>Add Admin</h3>
                            <form onSubmit={handleAdminFormSubmit} className={styles['category-buttons']}  style={{margin : '0 auto'}}>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        value={adminData.username}
                                        onChange={handleAdminFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        name="email"
                                        value={adminData.email}
                                        onChange={handleAdminFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        name="password"
                                        value={adminData.password}
                                        onChange={handleAdminFormChange}
                                        required
                                    />
                                </label>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setIsAddingAdmin(false)}>Cancel</button>
                            </form>
                        </div>
                    )}

                    {/* Add Tourism Governor Form */}
                    {isAddingGovernor && (
                        <div className="add-governor-">
                            <h3>Add Tourism Governor</h3>
                            <form onSubmit={handleGovernorFormSubmit} className={styles['category-buttons']} style={{margin :'0 auto'}}>
                                <label>
                                    Username:
                                    <input
                                        type="text"
                                        name="username"
                                        value={governorData.username}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        name="email"
                                        value={governorData.email}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        name="password"
                                        value={governorData.password}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Mobile:
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={governorData.mobile}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Nationality:
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={governorData.nationality}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Date of Birth:
                                    <input
                                        type="date"
                                        name="dob"
                                        value={governorData.dob}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setIsAddingGovernor(false)}>Cancel</button>
                            </form>
                        </div>
                    )}
                </>
            )}
                   <ProductSort/>
            <div className={styles['category-buttons']}> 
                <Deletion/>
            </div>
            <button className={styles.button}  onClick={() => navigate("/")}>
           Back to login Page
          </button>
        </div>
    );
};

export default AdminPage;
