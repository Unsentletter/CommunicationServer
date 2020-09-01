import MongoDB from 'mongodb';

class Todo {
  data: ITodoData;
  db: MongoDB.Db;

  constructor(db: MongoDB.Db, TodoData: ITodoData) {
    this.data = TodoData;
    this.db = db;
  }

  static async create(db: MongoDB.Db, data: ITodoCreateData) {
    let newTodoData: ITodoData = data;

    newTodoData.created = new Date();

    const createTodoObject = await db.collection('todo').insertOne(newTodoData);

    if (!createTodoObject) {
      throw new Error('Error occurred while inserting todo.');
    }

    newTodoData.id = String(createTodoObject.insertedId);
    delete newTodoData._id;
    const todoData = newTodoData;
    return new Todo(db, todoData);
  }

  static async getByLocation(db: MongoDB.Db, location: string) {
    const getTodoObject = await db
      .collection('todo')
      .aggregate([
        {
          $match: {
            locationId: location,
          },
        },
      ])
      .toArray();

    if (!getTodoObject) {
      throw new Error('Error occurred while finding todos.');
    }

    return getTodoObject;
  }
}

export default Todo;

interface ITodoData {
  id?: string;
  _id?: string;
  locationId: MongoDB.ObjectID;
  name: string;
  created?: Date;
  status: string;
}

interface ITodoCreateData {
  locationId: MongoDB.ObjectID;
  name: string;
  status: Status;
}

type Status = 'todo' | 'doing' | 'done' | 'on-hold';
