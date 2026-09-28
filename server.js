const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'my_database'
});

let dbConnected = false;
db.connect((err) => {
  if (err) {
    console.log("Database not connected:", err.message);
    return;
  }
  dbConnected = true;
  console.log("Connected to MySQL Database!");
});

app.get('/', (req, res) => {
  res.send('Welcome to My Backend Server!');
});

app.get('/api/user', (req, res) => {
  res.json({ name: "John Doe", email: "john@example.com" });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (!dbConnected) {
    return res.json({
      message: `Thank you ${name}, we received your message!`,
      data: { name, email, message }
    });
  }

  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({
      message: `Thank you ${name}, your message has been saved!`,
      data: { id: result.insertId, name, email, message }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});