const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(express.json());

// Create connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0004',
  database: 'my_database'
});

// Connect to database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database!");
});

// Route: Home
app.get('/', (req, res) => {
  res.send('Welcome to My Backend Server!');
});

// Route: API Example
app.get('/api/user', (req, res) => {
  res.json({ name: "John Doe", email: "john@example.com" });
});

// Route: Contact API (now saves to database)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!email.includes('@')) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) throw err;
    res.json({
      message: `Thank you ${name}, your message has been saved!`,
      data: { id: result.insertId, name, email, message }
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});