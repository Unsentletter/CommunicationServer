import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import MongoDB from 'mongodb';
import Location from '../models/location';

const router = express.Router();
router.use(cors());
router.use(bodyParser.json());

router.post('/create', async (req, res) => {
  const { db } = req.app.locals;

  const location = {
    name: req.body.name,
    address: req.body.address,
  };

  const createLocationObject = await Location.create(db, location);

  if (!createLocationObject) {
    res.json({ success: false, error: 'Location was not created' });
  } else {
    res.json({
      success: true,
      data: { location: createLocationObject.data },
      error: null,
    });
  }
});

router.post('/close', async (req, res) => {
  const { db } = req.app.locals;

  const closeObject = {
    locationId: req.body.todoId,
    doneBy: req.body.doneBy,
  };

  const createCloseObject = await Location.closeLocation(db, closeObject);

  if (!createCloseObject) {
    res.json({ success: false, error: 'Location was not closed' });
  } else {
    res.json({
      success: true,
      data: { locationData: createCloseObject },
      error: null,
    });
  }
});

export default router;
