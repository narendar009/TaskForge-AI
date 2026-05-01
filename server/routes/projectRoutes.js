import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Project from '../models/Project.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const project = await Project.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.json(project);
});

router.get('/', authMiddleware, async (req, res) => {
  const projects = await Project.find().populate('members');
  res.json(projects);
});

export default router;