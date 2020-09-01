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

export default router;
