const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'farm-chain-x-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (replace with database in production)
const users = [];

// Validation helper
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 6;
const validateName = (name) => name && name.trim().length > 0;

// Connect to MongoDB (optional, for now we'll use in-memory)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmchainx', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'FarmChainX Backend API' });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  console.log('POST /api/auth/register payload:', req.body);
  try {
    const { name, email, password, role } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    if (!validateName(name)) {
      return res.status(400).json({ error: 'Name must not be empty' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      passwordHash,
      role: role || 'farmer',
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role 
      } 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Products routes
app.get('/api/products', (req, res) => {
  res.json([
    { id: "FCX-A1B2", name: "Organic Wheat", qty: "500 kg", date: "2026-02-15", location: "Punjab Farm", status: "In Transit", quality: 92 },
    { id: "FCX-C3D4", name: "Basmati Rice", qty: "300 kg", date: "2026-02-12", location: "Haryana Farm", status: "Delivered", quality: 88 },
    { id: "FCX-E5F6", name: "Fresh Tomatoes", qty: "200 kg", date: "2026-02-10", location: "Maharashtra", status: "At Warehouse", quality: 76 },
    { id: "FCX-G7H8", name: "Green Lentils", qty: "150 kg", date: "2026-02-08", location: "MP Farm", status: "Harvested", quality: 95 },
  ]);
});

// Test user for development
users.push({
  id: 1,
  name: 'Test Farmer',
  email: 'farmer@demo.com',
  passwordHash: bcrypt.hashSync('password123', 10),
  role: 'farmer',
  createdAt: new Date()
});

users.push({
  id: 2,
  name: 'Test Distributor',
  email: 'distributor@demo.com',
  passwordHash: bcrypt.hashSync('password123', 10),
  role: 'distributor',
  createdAt: new Date()
});

users.push({
  id: 3,
  name: 'Test Consumer',
  email: 'consumer@demo.com',
  passwordHash: bcrypt.hashSync('password123', 10),
  role: 'consumer',
  createdAt: new Date()
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Demo accounts:`);
  console.log(`  Farmer: farmer@demo.com / password123`);
  console.log(`  Distributor: distributor@demo.com / password123`);
  console.log(`  Consumer: consumer@demo.com / password123`);
});