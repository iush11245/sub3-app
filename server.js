const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Search API Endpoint
app.get('/api/search', async (req, res) => {
  const { query, genre, releaseYear } = req.query;

  if (!query && !genre && !releaseYear) {
    return res.status(400).json({ error: 'At least one search parameter is required.' });
  }

  try {
    // Build the dynamic query
    const conditions = [];
    const values = [];

    if (query) {
      conditions.push((title ILIKE $${conditions.length + 1} OR director ILIKE $${conditions.length + 1}));
      values.push(%${query}%);
    }

    if (genre) {
      conditions.push($${conditions.length + 1} = ANY(genre));
      values.push(genre);
    }

    if (releaseYear) {
      conditions.push(release_year = $${conditions.length + 1});
      values.push(releaseYear);
    }

    const sqlQuery = SELECT * FROM movies WHERE ${conditions.join(' AND ')};
    const results = await pool.query(sqlQuery, values);

    if (results.rows.length > 0) {
      res.status(200).json(results.rows);
    } else {
      res.status(404).json({ message: 'No results found.' });
    }
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});