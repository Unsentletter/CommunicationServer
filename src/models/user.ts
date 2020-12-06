import MongoDB from 'mongodb';
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

  static async signin(db: MongoDB.Db, data: IUserData) {
    const user = await db.collection('user').findOne({ email: data.email });
    console.log('TEST', user);
    if (!user) {
      throw new Error('unable to log in');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new Error('unable to log in');
    }
    console.log('ISMATCH', isMatch);

    return user;
  }
}

export default User;

interface IUserData {
  name?: string;
  email: string;
  password: string;
  created?: Date;
}
