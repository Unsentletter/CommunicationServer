import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import MongoDB from 'mongodb';

const router = express.Router();
router.use(cors());
router.use(bodyParser.json());

router.post('/create', async (req, res) => {
  const { db } = req.app.locals;
  console.log('DB IS: ', req.body);

  const location = {
    name: req.body.name,
    address: req.body.address,
  };

  const createLocationResult = await db
    .collection('location')
    .insertOne(location);
  // console.log('CREATE RESULT', createLocationResult);
  const newLocationId = createLocationResult.insertedId;

  const response = { success: true, locationId: newLocationId };

  res.json(response);
});

export default router;
