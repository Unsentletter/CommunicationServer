import express from 'express';
import MongoDB from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

import location from './routes/location';
import todo from './routes/todo';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());

const { MongoClient } = MongoDB;

const client = new MongoClient(process.env.DB, {
  useNewUrlParser: true,
});

app.get('/', (req, res) => {
  res.send('Hello world! Nodemon blah');
});

app.use('/api/location', location);
app.use('/api/todo', todo);

client
  .connect()
  .then((client) => {
    const db = client.db('PoolTodo');
    app.locals.db = db;
    app.listen(port, () => console.info(`REST API running on port ${port}`));
  })
  .catch((error) => console.error(error));
