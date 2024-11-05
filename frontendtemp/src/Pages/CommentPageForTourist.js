import React, { useState, useEffect } from 'react';
import { fetchPastbookedbytouristItineraries, fetchPastbookedbytouristItinerariesItneraryComment } from '../RequestSendingMethods';
import '../styles/global.css';
const CommentPageForTourist = ({ onBackClick, email }) => {
  const [commentType, setCommentType] = useState(null);
  const [tourGuides, setTourGuides] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (commentType === 'tourGuide') {
      loadTourGuides();
    }
    if (commentType === 'itinerary') {
      loadItinerariesWithTourGuideName();
    }
  }, [commentType]);

  const loadTourGuides = async () => {
    try {
      console.log('Email passed to fetch function:', email);
      const response = await fetchPastbookedbytouristItineraries(email);
      if (response && Array.isArray(response.data)) {
        console.log('Tour guides data:', response.data); // Log data for debugging
        setTourGuides(response.data);
      }
    } catch (error) {
      console.error('Error fetching tour guides:', error);
    }
  };

  const loadItinerariesWithTourGuideName = async () => {
    try {
      console.log('Email passed to fetch function:', email);
      const response = await fetchPastbookedbytouristItinerariesItneraryComment(email);
      if (response && Array.isArray(response.data)) {
        console.log('Itineraries data:', response.data); // Log data for debugging
        setItineraries(response.data);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  const handleTourGuideSelection = () => setCommentType('tourGuide');
  const handleActivitySelection = () => setCommentType('Activity');
  const handleItinerarySelection = () => setCommentType('itinerary');

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setCommentType('writeComment');
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleDoneClick = () => {
    console.log(`Comment for ${selectedItem.title || selectedItem.email}:`, comment);
    setComment('');
    setSelectedItem(null);
    setCommentType(null);
  };


  return (
    <div className="container">
      {!commentType ? (
        <div>
          <p>What would you like to comment on?</p>
          <button onClick={handleTourGuideSelection} className="button">
            Tour Guide
          </button>
          <button onClick={handleActivitySelection} className="button">
            Activity Attended
          </button>
          <button onClick={handleItinerarySelection} className="button">
            Itinerary
          </button>
        </div>
      ) : commentType === 'tourGuide' && !selectedItem ? (
        <div>
          <h3>Select a Tour Guide to Comment On</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
  {tourGuides.map((email, index) => ( // Change 'guide' to 'email'
    <tr key={index}>
      <td>{email}</td> {/* Now email directly renders the string */}
      <td>
        <button onClick={() => handleItemClick(email)}>Select</button> {/* Pass the email as the selected item */}
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      ) : commentType === 'itinerary' && !selectedItem ? (
        <div>
          <h3>Select an Itinerary to Comment On</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Itinerary Title</th>
                <th>Tour Guide Name</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {itineraries.map((itinerary, index) => (
                <tr key={index}>
                  <td>{itinerary.itineraryTitle}</td>
                  <td>{itinerary.tourGuideName}</td>
                  <td>
                    <button onClick={() => handleItemClick(itinerary)}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h3>Leave a Comment for {selectedItem.title ? selectedItem.title : selectedItem.email}</h3>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write your comment here..."
            className="comment-textarea"
          />
          <button onClick={handleDoneClick} className="done-button">Done</button>
        </div>
      )}

      <button onClick={onBackClick} className="back-button">
        Back
      </button>
    </div>
  );
};

export default CommentPageForTourist;
