import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    dueDate:    Date,
    // Track which user created the task (enables per-user data scoping)
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Index for fast per-user queries
taskSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.model('Task', taskSchema);