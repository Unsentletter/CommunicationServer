import MongoDB from 'mongodb';

class Comment {
  data: ICommentData;
  db: MongoDB.Db;

  constructor(db: MongoDB.Db, CommentData: ICommentData) {
    this.data = CommentData;
    this.db = db;
  }

  static async comment(db: MongoDB.Db, data: ICreateComment) {
    let newTodoComment: ICommentData = data;

    newTodoComment.created = new Date();

    const createCommentObject = await db
      .collection('comment')
      .insertOne(newTodoComment);

    if (!createCommentObject) {
      throw new Error('Error occurred while inserting comment.');
    }

    newTodoComment.id = String(createCommentObject.insertedId);
    delete newTodoComment._id;
    const todoComment = newTodoComment;
    return new Comment(db, todoComment);
  }
}

export default Comment;

interface ICommentData {
  id?: string;
  _id?: string;
  todoId: MongoDB.ObjectID;
  comment: string;
  created?: Date;
}

interface ICreateComment {
  todoId: MongoDB.ObjectID;
  comment: string;
}
