/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const { Router } = require('express');
const Pusher = require('pusher');
const { Client } = require('pg');
const pusherConfig = require('../../../pusher.json');

const pusherClient = new Pusher(pusherConfig);
const router = Router();
const connectionString = process.env.CONNECTION_STRING;
const db = new Client({
  connectionString,
});
// establish DB connections
db.connect()
  .then(() => console.warn('db connected'))
  .catch((e) => console.warn(`unable to connect to db: ${e.message}`));

router.put('/users/:email', (req, res) => {
  const { name } = req.body;
  console.warn(`User is online: ${req.params.email}`);
  const online = async () => {
    await db.query("UPDATE users SET online = 'true' WHERE email = $1", [req.params.email]);
  };
  online();
  pusherClient.trigger('chat_channel', 'join', {
    name,
  });
  res.sendStatus(204);
});

router.delete('/users/:email', (req, res) => {
  console.warn(`User has logged off: ${req.params.email}`);
  const offline = async () => {
    await db.connect();
    await db.query(`UPDATE users SET online = 'false' WHERE email = ${req.params.email}`);
    await db.end();
  };
  offline();
  pusherClient.trigger('chat_channel', 'part', {
    name: req.params.name,
  });
  res.sendStatus(204);
});
router.post('/users/messages', (req, res) => {
  console.warn(`User ${req.params.email} sent message: ${req.body.message}`);
  const { message, receiver } = req.body;
  const insertMessage = async () => {
    const {
      rows,
    } = await db.query(
      'INSERT INTO messages (message_id, message, sender, receiver, created_at) VALUES ($1, $2, $3, $4, $5)',
      [
        message._id,
        message.text,
        JSON.stringify(message.user),
        JSON.stringify(receiver),
        message.createdAt,
      ],
    );
  };
  insertMessage();
  pusherClient.trigger('chat_channel', 'message', { message, receiver });
  res.sendStatus(201);
});
router.get('/users/messages', async (req, res) => {
  const { sender, receiver } = req.query;
  try {
    const findAll = "SELECT message_id AS _id, message AS text, sender AS user FROM messages WHERE sender ->> '_id' = $1 AND receiver ->> '_id' = $2 OR sender ->> '_id' = $2 AND receiver ->> '_id' = $1 ORDER BY created_at DESC";
    const { rows } = await db.query(findAll, [sender, receiver]);
    if (rows) res.status(200).send(rows);
  } catch (err) {
    res.send({
      message: err.message,
    });
  }
});
module.exports = router;
