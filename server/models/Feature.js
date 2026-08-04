import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  estimatedHours: { type: Number, default: 2 },
  assignee: { type: String, default: '' }
});

const commentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  user: { type: String, required: true },
  avatar: { type: String, default: '' },
  text: { type: String, required: true },
  timestamp: { type: String, required: true }
});

const featureSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, default: 'proj-kichu-kori' },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    module: { type: String, required: true },
    priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
    complexity: { type: String, default: 'Medium (8h)' },
    status: { type: String, enum: ['Backlog', 'To Do', 'In Progress', 'In Review', 'Completed', 'Done'], default: 'To Do' },
    developerId: { type: String, default: '' },
    subtasks: [subtaskSchema],
    comments: [commentSchema],
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    dependencies: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model('Feature', featureSchema);
