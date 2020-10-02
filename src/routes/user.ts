import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import * as passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;

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
    await User.signup(db, {
      name: user.name,
      email: user.email,
      password: user.password,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.send('Email already in use');
    } else {
      res.send('Something went wrong');
    }
  }
});

export default router;
