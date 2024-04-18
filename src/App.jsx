
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState('');
  const [viewDetails, setViewDetails] = useState(false);
  const [mutualFollowers, setMutualFollowers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.github.com/users');
      setUserData(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      setUserData([response.data]);
      setError('');
    } catch (error) {
      console.error('Error searching user:', error);
      setError('User not found');
    }
  };

  const handleClick = async (user) => {
    try {
      const response = await axios.get(`https://api.github.com/users/${user.login}`);
      setUserData([response.data]);
      setError('');
      setViewDetails(true);
      // Fetch mutual followers
      const mutualFollowersResponse = await axios.get(`https://api.github.com/users/${user.login}/followers`);
      // Filter mutual followers by the searched username
      const filteredMutualFollowers = mutualFollowersResponse.data.filter(follower => follower.login.includes(username));
      setMutualFollowers(filteredMutualFollowers);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details');
    }
  };

  const handleBack = () => {
    setViewDetails(false);
    fetchData();
  };

  const handleDelete = async (username) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${username}`);
      setUserData([]);
      setError('');
      setViewDetails(false); // Hide user details after deletion
      fetchData(); // Fetch updated data after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const handleUpdate = async (username, updateData) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${username}`, updateData);
      setError('');
      fetchData(); // Fetch updated data after update
    } catch (error) {
      console.error('Error updating user details:', error);
      setError('Failed to update user details');
    }
  };

  return (
    <div className="container">
      <h1>GitHub User Search</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Search by username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="user-grid">
        {userData.map(user => (
          <div className="user-box" key={user.id} onClick={() => handleClick(user)}>
            <img className="avatar" src={user.avatar_url} alt="User Avatar" />
            <div>
              <h3>{user.login}</h3>
              <p>{user.id}</p>
            </div>
          </div>
        ))}
      </div>
      {viewDetails && userData.length > 0 && (
        <div className="user-details">
          <button onClick={handleBack}>Back</button>
          <div className="info-container">
            <h2>{userData[0].name}</h2>
            <p>Username: {userData[0].login}</p>
            <p>Bio: {userData[0].bio}</p>
            <p>Location: {userData[0].location}</p>
            <p>Followers: {userData[0].followers}</p>
            <p>Following: {userData[0].following}</p>
            <p>Public Repositories: {userData[0].public_repos}</p>
            <p>Created At: {new Date(userData[0].created_at).toLocaleDateString()}</p>
            <h3>Mutual Followers:</h3>
            <ul>
              {mutualFollowers.map(follower => (
                <li key={follower.id}>{follower.login}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => handleDelete(userData[0].login)}>Delete</button>
          {/* Update form */}
          <div className="update-form">
            <input
              type="text"
              placeholder="Location"
              value={userData[0].location}
              onChange={(e) => setUserData([{ ...userData[0], location: e.target.value }])}
            />
            <input
              type="text"
              placeholder="Bio"
              value={userData[0].bio}
              onChange={(e) => setUserData([{ ...userData[0], bio: e.target.value }])}
            />
            <input
              type="text"
              placeholder="Blog"
              value={userData[0].blog}
              onChange={(e) => setUserData([{ ...userData[0], blog: e.target.value }])}
            />
            <button onClick={() => handleUpdate(userData[0].login, userData[0])}>Update</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
