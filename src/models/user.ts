import MongoDB, { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

class User {
  data: IUserData;
  db: MongoDB.Db;

  constructor(db: MongoDB.Db, UserData: IUserData) {
    this.data = UserData;
    this.db = db;
  }

  static async signup(db: MongoDB.Db, data: IUserData) {
    let newUserData: IUserData = data;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    newUserData.created = new Date();
    newUserData.password = hashedPassword;

    const createUserObject = await db.collection('user').insertOne(newUserData);

    if (!createUserObject) {
      throw new Error('Error occurred while creating user.');
    }

    const userData = newUserData;
    return new User(db, userData);
  }
}

export default User;

interface IUserData {
  name: string;
  email: string;
  password: string;
  created?: Date;
}
