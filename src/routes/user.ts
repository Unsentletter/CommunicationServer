import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import User from '../models/user';

const router = express.Router();
router.use(cors());
router.use(bodyParser.json());

router.post('/signup', async (req, res) => {
  const { db } = req.app.locals;

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const createUser = await User.signup(db, {
      name: user.name,
      email: user.email,
      password: user.password,
    });
    if (!createUser) {
      res.json({ success: false, error: 'User was not created' });
    } else {
      res.json({
        success: true,
        data: { user: createUser.data },
        error: null,
      });
    }
  } catch (err) {
    if (err.code === 11000) {
      res.send('Email already in use');
    } else {
      res.send('Something went wrong');
    }
  }
});

export default router;
