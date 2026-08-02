import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  progress: { type: Number, default: 0 },
  color: { type: String, default: '#6366F1' }
});

const repoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Frontend' },
  url: { type: String, default: '' },
  branch: { type: String, default: 'main' }
});

const envVarSchema = new mongoose.Schema({
  id: { type: String, required: true },
  key: { type: String, required: true },
  value: { type: String, default: '' },
  category: { type: String, default: 'Frontend' },
  isSecret: { type: Boolean, default: false }
});

const linkSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, default: 'globe' }
});

const projectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    overallProgress: { type: Number, default: 0 },
    startDate: { type: String, default: '2026-07-01' },
    targetCompletionDate: { type: String, default: '2026-08-31' },
    modules: [moduleSchema],
    repositories: [repoSchema],
    environmentVars: [envVarSchema],
    quickLinks: [linkSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
