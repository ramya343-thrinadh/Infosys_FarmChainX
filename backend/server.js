const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'farm-chain-x-secret-key-2026';
const MONGODB_URI = process.env.MONGODB_URI || '';
const useMongo = Boolean(MONGODB_URI);

// Middleware
app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'distributor', 'consumer'], default: 'farmer' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const users = [];

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 6;
const validateName = (name) => name && name.trim().length > 0;

const buildUserResponse = (user) => ({
  id: user._id ? user._id.toString() : user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const seedDemoUsers = async () => {
  if (!useMongo) return;

  const count = await User.countDocuments();
  if (count > 0) {
    console.log('Demo users already seeded.');
    return;
  }

  const demoUsers = [
    {
      name: 'Test Farmer',
      email: 'farmer@demo.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'farmer',
    },
    {
      name: 'Test Distributor',
      email: 'distributor@demo.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'distributor',
    },
    {
      name: 'Test Consumer',
      email: 'consumer@demo.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'consumer',
    },
  ];

  await User.insertMany(demoUsers.map((user) => ({ ...user, createdAt: new Date() })));
  console.log('Demo users seeded to MongoDB.');
};

const connectDatabase = async () => {
  if (!useMongo) {
    console.warn('MONGODB_URI is not set. Using in-memory storage only.');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    await seedDemoUsers();
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

app.get('/', (req, res) => {
  res.json({ message: 'FarmChainX Backend API' });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = useMongo
      ? await User.findOne({ email: normalizedEmail }).lean()
      : users.find((u) => u.email === normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id ? user._id.toString() : user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: buildUserResponse(user) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  console.log('POST /api/auth/register payload:', req.body);
  try {
    const { name, email, password, role } = req.body;

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

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = useMongo
      ? await User.findOne({ email: normalizedEmail })
      : users.find((u) => u.email === normalizedEmail);

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role || 'farmer';

    if (useMongo) {
      const createdUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: userRole,
      });

      const token = jwt.sign(
        { id: createdUser._id.toString(), email: createdUser.email, role: createdUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({ token, user: buildUserResponse(createdUser) });
    }

    const newUser = {
      id: users.length + 1,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: userRole,
      createdAt: new Date(),
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: buildUserResponse(newUser) });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.get('/api/products', (req, res) => {
  res.json([
    { id: 'FCX-A1B2', name: 'Organic Wheat', qty: '500 kg', date: '2026-02-15', location: 'Punjab Farm', status: 'In Transit', quality: 92 },
    { id: 'FCX-C3D4', name: 'Basmati Rice', qty: '300 kg', date: '2026-02-12', location: 'Haryana Farm', status: 'Delivered', quality: 88 },
    { id: 'FCX-E5F6', name: 'Fresh Tomatoes', qty: '200 kg', date: '2026-02-10', location: 'Maharashtra', status: 'At Warehouse', quality: 76 },
    { id: 'FCX-G7H8', name: 'Green Lentils', qty: '150 kg', date: '2026-02-08', location: 'MP Farm', status: 'Harvested', quality: 95 },
  ]);
});

if (!useMongo) {
  users.push({
    id: 1,
    name: 'Test Farmer',
    email: 'farmer@demo.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'farmer',
    createdAt: new Date(),
  });

  users.push({
    id: 2,
    name: 'Test Distributor',
    email: 'distributor@demo.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'distributor',
    createdAt: new Date(),
  });

  users.push({
    id: 3,
    name: 'Test Consumer',
    email: 'consumer@demo.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'consumer',
    createdAt: new Date(),
  });
}

connectDatabase().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Demo accounts:`);
    console.log(`  Farmer: farmer@demo.com / password123`);
    console.log(`  Distributor: distributor@demo.com / password123`);
    console.log(`  Consumer: consumer@demo.com / password123`);
  });
});
