const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// API to get user search history
app.get("/api/SearchHistory/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT * FROM search_history WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// API to save user search history
app.post("/api/SearchHistory", async (req, res) => {
  try {
    const { userId, searchQuery } = req.body;
    await pool.query(
      "INSERT INTO search_history (user_id, query, created_at) VALUES ($1, $2, NOW())",
      [userId, searchQuery]
    );
    res.send("Search history saved");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// API to get user rating history
app.get("/api/RatingHistory/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT * FROM ratings WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// API to save user ratings
app.post("/api/RatingHistory", async (req, res) => {
  try {
    const { userId, movieId, rating } = req.body;
    await pool.query(
      "INSERT INTO ratings (user_id, movie_id, rating, created_at) VALUES ($1, $2, $3, NOW())",
      [userId, movieId, rating]
    );
    res.send("Rating saved");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
