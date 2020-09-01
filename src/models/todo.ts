import MongoDB, { ObjectId } from 'mongodb';

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

  static async closeTodo(db: MongoDB.Db, data: ITodoCloseData) {
    let closeTodo: ITodoCloseData = data;
    closeTodo.closed = new Date();

    const createCloseObject = await db.collection('todo').updateOne(
      { _id: new ObjectId(closeTodo.todoId) },
      {
        $set: {
          status: 'done',
          doneBy: closeTodo.doneBy,
          closed: closeTodo.closed,
        },
      }
    );

    if (!createCloseObject) {
      throw new Error('Error occurred while closing todo.');
    }

    return closeTodo;
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

interface ITodoCloseData {
  todoId: MongoDB.ObjectID;
  doneBy: string;
  closed?: Date;
}

type Status = 'todo' | 'doing' | 'done' | 'on-hold';
