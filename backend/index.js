const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// GET user details from GitHub API
app.get('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// PUT update user information
app.put('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  const { location, bio, blog } = req.body;
  
  try {
    // Perform update operation
    console.log(`Updating details for user ${username}: Location - ${location}, Bio - ${bio}, Blog - ${blog}`);
    
    // Send response
    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Failed to update user details' });
  }
});

// DELETE user from database
app.delete('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    // Perform delete operation
    console.log(`Deleting user ${username} from the database`);
    
    // Send response
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// POST add new user to the database
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  
  try {
    // Perform add user operation
    console.log(`Adding new user: ${username}`);
    
    // Send response
    res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding new user:', error);
    res.status(500).json({ error: 'Failed to add new user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
