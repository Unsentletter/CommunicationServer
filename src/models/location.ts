import MongoDB from 'mongodb';
// import fetch from 'node-fetch';

class Location {
  data: ILocationData;
  db: MongoDB.Db;

  constructor(db: MongoDB.Db, LocationData: ILocationData) {
    this.data = LocationData;
    this.db = db;
  }

  static async create(db: MongoDB.Db, data: ILocationCreateData) {
    let newLocationData: ILocationData = data;
    // Create timestamp
    newLocationData.created = new Date();

    const createLocationResult = await db
      .collection('location')
      .insertOne(newLocationData);
    if (!createLocationResult) {
      throw new Error('Error occurred while inserting location.');
    }
    newLocationData.id = String(createLocationResult.insertedId);
    delete newLocationData._id;
    const locationData = newLocationData;
    return new Location(db, locationData);
  }
}

export default Location;

interface ILocationData {
  id?: string;
  _id?: string;
  name: string;
  address: string;
  created?: Date;
}

interface ILocationCreateData {
  name: string;
  address: string;
}
