import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    projectId: { type: String, default: '' },
    channel: { type: String, default: '' },
    channelId: { type: String, default: '' },
    senderId: { type: String, default: '' },
    senderName: { type: String, default: 'User' },
    senderRole: { type: String, default: '' },
    senderAvatar: { type: String, default: '' },
    recipientId: { type: String, default: '' },
    text: { type: String, required: true },
    timestamp: { type: String, required: true },
    attachments: [{ type: String }],
    isDirect: { type: Boolean, default: false }
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
