const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { generateToken, hashPassword, comparePassword, authenticateToken } = require('./src/middleware/auth');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/musicplayer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    playlist: [{
        id: String,
        title: String,
        artistName: String,
        albumName: String,
        genre: String,
        songUrl: String,
        previewImg: String
    }]
});

const User = mongoose.model('User', userSchema);

// Enable CORS for all routes
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return user data with token
        res.json({
            token,
            userId: user._id,
            username: user.username,
            email: user.email,
            playlist: user.playlist
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User registration endpoint
app.post('/api/users', async (req, res) => {
    try {
        const { username, email, password, playlist } = req.body;
        
        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password: await hashPassword(password), // Password is now securely hashed
            playlist: playlist || []
        });

        // Save user to MongoDB
        const savedUser = await newUser.save();
        
        // Generate JWT token
        const token = generateToken(savedUser);

        // Return user data with token
        res.status(200).json({
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            token,
            playlist: savedUser.playlist
        });
    } catch (error) {
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(409).json({ message: 'User already exists' });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user profile endpoint
app.get('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            username: user.username,
            email: user.email,
            playlist: user.playlist
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user profile endpoint
app.put('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update allowed fields
        if (req.body.username) {
            user.username = req.body.username;
        }

        await user.save();

        res.json({
            username: user.username,
            email: user.email,
            playlist: user.playlist
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});