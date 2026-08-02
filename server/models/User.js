import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'developer'], default: 'developer' },
    devRole: { type: String, default: '' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    assignedProjectIds: [{ type: String }],
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
