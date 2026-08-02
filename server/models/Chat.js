import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: String, required: true },
    channelId: { type: String, default: '' },
    recipientId: { type: String, default: '' },
    attachments: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
