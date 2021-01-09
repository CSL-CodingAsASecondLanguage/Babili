const { Router } = require('express');
require('dotenv').config();

const router = Router();
const { Client } = require('pg');

const connectionString = process.env.CONNECTION_STRING;
const db = new Client({
  connectionString,
});

router.get('/matchinggame', async (req, res) => {
  await db.connect();
  const { rows } = await db.query('SELECT * FROM matchinggame');
  res.send(rows);
  await db.end();
});

module.exports = router;
