/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');
const { Client } = require('pg');
const { sequelize } = require('./db/index');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const connectionString = process.env.CONNECTION_STRING;

const db = new Client({
  connectionString,
});

// db.connect().then(() => { console.warn('connected');}).catch((err) => console.warn(err));

async function connect() {
  try {
    await db.connect();
    console.warn('connected');
    const { rows } = await db.query('SELECT * FROM Users');
    console.table(rows);
    await db.end();
  } catch (error) {
    console.warn('Unable to connect to the database:');
    console.warn(error.message);
    process.exit(1);
  }
}

// async function assertDatabaseConnectionOk() {
//   try {
//     await sequelize.authenticate();
//     console.warn('Database connection OK!');
//   } catch (error) {
//     console.warn('Unable to connect to the database:');
//     console.warn(error.message);
//     process.exit(1);
//   }
// }

async function init() {
  // await assertDatabaseConnectionOk();
  await connect();

  console.warn(`Starting Sequelize + Express on port ${PORT}...`);

  app.listen(PORT, () => {
    console.warn(`Express server started on port ${PORT}.`);
  });
}

init();
