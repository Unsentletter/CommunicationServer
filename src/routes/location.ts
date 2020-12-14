import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Location from '../models/location';
import auth from '../middleware/auth';

const router = express.Router();
router.use(cors());
router.use(bodyParser.json());

router.post('/create', auth, async (req, res) => {
  const { db } = req.app.locals;

  const location = {
    name: req.body.name,
    address: req.body.address,
    direction: req.body.direction,
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

router.post('/close', auth, async (req, res) => {
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

router.get('/get', auth, async (req, res) => {
  const { db } = req.app.locals;

  const locationList = await db
    .collection('location')
    .aggregate([
      {
        $match: {
          isClosed: false,
        },
      },
    ])
    .toArray();

  if (!locationList) {
    res.json({ success: false, error: 'Locations were not found' });
  } else {
    res.json({
      success: true,
      data: { locationList },
      error: null,
    });
  }
});

export default router;
