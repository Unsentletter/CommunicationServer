import jwt from 'jsonwebtoken';
import mongo from 'mongodb';

const auth = async (req: any, res: any, next: any) => {
  const { db } = req.app.locals;
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded: any = jwt.verify(token, 'secretvalue');
    const user = await db
      .collection('user')
      .findOne({ _id: new mongo.ObjectID(decoded._id) });
    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ Error: 'Please authenticate' });
  }
};

export default auth;
