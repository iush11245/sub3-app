import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from "./components/Navbar";
import MoviesList from "./components/GenrebasedMovies";
import HomePage from "./components/Home";
import "./App.css";

const App = () => {
  const [searchBy, setSearchBy] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [SearchHistory, setSearchHistory] = useState([]);
  const [ratingHistory, setRatingHistory] = useState([]); 

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // const handleSearch = () => {
  //   alert(`Searching by ${searchBy}: ${searchInput}`);
  //   // Add your search logic here
  // };

  const togglePopup = () => {
    if (isPopupVisible) {
      setIsClosing(true);
      setTimeout(() => {
        setIsPopupVisible(false);
        setIsClosing(false);
      }, 300); // Match this with the closing animation duration
    } else {
      setIsPopupVisible(true);
    }
  };

  const userId = 1; // Mock user ID, replace with real user authentication logic.

  // Fetch user data on component mount
  useEffect(() => {
    // Fetch search history
    axios
      .get(`http://localhost:7019/api/SearchHistory/${userId}`)
      .then((response) => setSearchHistory(response.data))
      .catch((error) => console.error("Error fetching search history:", error));

    // Fetch rating history
    axios
      .get(`http://localhost:7019/api/RatingHistory/${userId}`)
      .then((response) => setRatingHistory(response.data))
      .catch((error) => console.error("Error fetching rating history:", error));
  }, [userId]);

  // Handle search input
  const handleSearch = () => {
    axios
      .post("http://localhost:7019/api/SearchHistory", {
        userId,
        searchQuery: searchInput,
      })
      .then(() => {
        // Refresh search history after saving
        axios
          .get(`http://localhost:7019/api/SearchHistory/${userId}`)
          .then((response) => setSearchHistory(response.data));
      })
      .catch((error) => console.error("Error saving search query:", error));
  };

  return (
    <Router>

<div className="app">
      <header className="top-bar">
        {/* Left Menu */}
        <nav className="menu">
        <div className="menu-item">
  <label htmlFor="genre-select">Genre</label>
  <select id="genre-select" className="genre-dropdown">
    <option value="action">Action</option>
    <option value="comedy">Comedy</option>
    <option value="drama">Drama</option>
    <option value="horror">Horror</option>
    <option value="sci-fi">Sci-Fi</option>
    <option value="romance">Romance</option>
    {/* Add more genres as needed */}
  </select>
</div>
          <div className="menu-item">Recent Released</div>
          <div className="menu-item">Top Rated</div>
          <div className="menu-item">Recommended</div>
        </nav>

        {/* User Profile Section (Center) */}
        <div className="user-profile-center" onClick={togglePopup}>
          <img src="/path-to-your-user-icon.png" alt="User Icon" className="profile-icon" />
          <div className="user-profile-label">User Profile</div>
        </div>

        {/* Search Section */}
        <div className="search">
          <select
            className="search-dropdown"
            value={searchBy}
            onChange={handleSearchByChange}
          >
            <option value="Actor">Actor</option>
            <option value="Movies">Movies</option>
            <option value="Released Year">Released Year</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchBy}...`}
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
      </header>

      {/* Popup Modal */}
      {isPopupVisible && (
        <div className={`popup-overlay ${isClosing ? "fadeOut" : ""}`} onClick={togglePopup}>
          <div className={`popup-content ${isClosing ? "slideOut" : "slideIn"}`} onClick={(e) => e.stopPropagation()}>
            <h2>User Profile Details</h2>
            <div className="profile-section">
              <h3>User Details</h3>
              <p>Username: JohnDoe</p>
              <p>Email: johndoe@example.com</p>
              <p>Member since: January 2023</p>
            </div>
            <div className="profile-section">
              <h3>User Ratings</h3>
              <p>Recent Ratings: 5/5 for "Movie A", 4/5 for "Movie B"</p>
              <p>Top Rated Movie: "Movie C" with 5/5</p>
            </div>
            <div className="profile-section">
              <h3>Search History</h3>
              <ul>
                <li>Movie A</li>
                <li>Actor X</li>
                <li>2023 Releases</li>
              </ul>
            </div>
            <div className="profile-section">
              <h3>Update Password</h3>
              <input type="password" placeholder="New Password" />
              <input type="password" placeholder="Confirm Password" />
              <button>Update Password</button>
            </div>
            <button onClick={togglePopup} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
    <NavigationBar /> {/* Navigation bar is rendered here */}
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies/:genreName" element={<MoviesList />} />
      {/* Uncomment and add other routes as needed */}
      {/* <Route path="/bookmarks" element={<Bookmarks />} /> */}
      {/* <Route path="/recommended" element={<Recommended />} /> */}
      {/* <Route path="/profile" element={<UserProfile />} /> */}
    </Routes>

    
  </Router>

  );
};

export default App;
