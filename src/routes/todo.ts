import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import auth from '../middleware/auth';

import Todo from '../models/todo';
import Comment from '../models/Comment';

const router = express.Router();
router.use(cors());
router.use(bodyParser.json());

router.post('/create', auth, async (req, res) => {
  const { db } = req.app.locals;

  const todo = {
    locationId: req.body.locationId,
    name: req.body.name,
    status: 'todo',
  };

  const createTodoObject = await Todo.create(db, todo);

  if (!createTodoObject) {
    res.json({ success: false, error: 'Location was not created' });
  } else {
    res.json({
      success: true,
      data: { todo: createTodoObject.data },
      error: null,
    });
  }
});

router.get('/getByLocation/:id', auth, async (req, res) => {
  const { db } = req.app.locals;

  const getTodoArray = await Todo.getByLocation(db, req.params.id);

  if (!getTodoArray) {
    res.json({ success: false, error: 'Location was not received' });
  } else {
    res.json({
      success: true,
      data: { todos: getTodoArray },
      error: null,
    });
  }
});

router.post('/comment', auth, async (req, res) => {
  const { db } = req.app.locals;

  const todoComment = {
    todoId: req.body.todoId,
    comment: req.body.comment,
  };

  const createCommentObject = await Comment.comment(db, todoComment);
  if (!createCommentObject) {
    res.json({ success: false, error: 'Comment was not created' });
  } else {
    res.json({
      success: true,
      data: { comment: createCommentObject.data },
      error: null,
    });
  }
});

router.post('/close', auth, async (req, res) => {
  const { db } = req.app.locals;

  const closeObject = {
    todoId: req.body.todoId,
    doneBy: req.body.doneBy,
  };

  const createCloseObject = await Todo.closeTodo(db, closeObject);

  if (!createCloseObject) {
    res.json({ success: false, error: 'Todo was not closed' });
  } else {
    res.json({
      success: true,
      data: { todoData: createCloseObject },
      error: null,
    });
  }
});

export default router;
