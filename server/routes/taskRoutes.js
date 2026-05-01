import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Task from '../models/Task.js';

const router = express.Router();

// POST /api/tasks  — create a task
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks  — list tasks belonging to the authenticated user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    // Filter by the logged-in user so users only see their own tasks
    const tasks = await Task.find({ createdBy: req.user._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id  — update a task
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id }, // ownership check
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id  — delete a task
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;