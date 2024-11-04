const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS middleware

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors()); // You can also configure it if needed

// Set up MySQL connection pool
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Middleware to authenticate the user
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Attach user info to request
    next(); // Proceed to the next middleware or route handler
  });
};

// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare the password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user balance
app.get('/balance', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Get the user ID from the token

  try {
    const [rows] = await db.query('SELECT * FROM dbt_balance WHERE user_id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Balance not found' });
    }

    res.json(rows); // Return the user's balance
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user address
app.get('/address', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Get the user ID from the token

  try {
    const [rows] = await db.query('SELECT * FROM dbt_address WHERE user_id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json(rows); // Return the user's address(es)
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(200).json({ message: error });
  }
});

// Get user address
app.get('/transactions', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Get the user ID from the token
  
    try {
      const [rows] = await db.query('SELECT * FROM transaction_history WHERE userid = ?', [userId]);
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Transactions not found' });
      }
  
      res.json(rows); // Return the user's address(es)
    } catch (error) {
      console.error('Error fetching address:', error);
      res.status(200).json({ message: error });
    }
  });
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
