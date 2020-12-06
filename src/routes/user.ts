import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import User from '../models/user';
import auth from '../middleware/auth';

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
        data: createUser,
        error: null,
      });
    }
  } catch (err) {
    if (err.code === 11000) {
      res.send('Email already in use');
    } else {
      console.log('SIGN UP ERROR', err);
      res.send('Something went wrong');
    }
  }
});

router.post('/signin', async (req, res) => {
  const { db } = req.app.locals;
  try {
    const signInUser = await User.signin(db, {
      email: req.body.email,
      password: req.body.password,
    });
    if (!signInUser) {
      res.json({ success: false, error: 'User was not logged in' });
    } else {
      res.json({ success: true, data: signInUser, error: null });
    }
  } catch (err) {
    console.log('SIGN IN ERROR', err);
    res.status(400).send();
  }
});

router.post('/logout', auth, async (req, res) => {
  // Not sure I need this
});

export default router;
