import MongoDB, { ObjectId } from 'mongodb';
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

  static async closeLocation(db: MongoDB.Db, data: ILocationCloseData) {
    let closeLocation: ILocationCloseData = data;
    closeLocation.closed = new Date();

    const createCloseObject = await db.collection('location').updateOne(
      { _id: new ObjectId(closeLocation.locationId) },
      {
        $set: {
          status: 'done',
          doneBy: closeLocation.doneBy,
          closed: closeLocation.closed,
        },
      }
    );

    if (!createCloseObject) {
      throw new Error('Error occurred while closing location.');
    }

    return closeLocation;
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

interface ILocationCloseData {
  locationId: MongoDB.ObjectID;
  doneBy: string;
  closed?: Date;
}
