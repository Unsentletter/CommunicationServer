import MongoDB from 'mongodb';
// import fetch from 'node-fetch';

class Location {
  data: ILocationData;
  db: MongoDB.Db;

  constructor(db: MongoDB.Db, LocationData: ILocationData) {
    this.data = LocationData;
    this.db = db;
  }

  static async create(db: MongoDB.Db, LocationData: ILocationData) {
    // Write to database
    const createUserResult = await db
      .collection('location')
      .insertOne(LocationData);
    if (!createUserResult) {
      throw new Error('Error occurred while inserting user.');
    }
    return new Location(db, LocationData);
  }
}

export default Location;

interface ILocationData {
  id: string;
  name: string;
  address: string;
}
