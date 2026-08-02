// Initial Sample Chat Messages, Channels & Direct Messages

export const INITIAL_CHAT_CHANNELS = [
  { id: 'general', name: 'general-discussion', description: 'Project-wide updates & general team chat' },
  { id: 'dev-tech', name: 'dev-tech-stack', description: 'Architecture, APIs & Environment configuration' },
  { id: 'qa-bugs', name: 'qa-testing-bugs', description: 'Bug reports, QA test sign-offs & edge cases' }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    projectId: 'proj-kichu-kori',
    channel: 'general',
    senderName: 'Sarah Jenkins',
    senderRole: 'Full Stack Dev',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    text: 'Hey team! I completed the Registration & Password Reset API integration. Moving User Login to QA phase now.',
    timestamp: '10:15 AM'
  },
  {
    id: 'msg-2',
    projectId: 'proj-kichu-kori',
    channel: 'general',
    senderName: 'Alex Rivera',
    senderRole: 'Lead Backend Eng',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    text: 'Awesome work Sarah! I have updated the `.env.backend` credentials in the Vault for Redis and JWT tokens.',
    timestamp: '10:18 AM'
  }
];

export const INITIAL_DIRECT_MESSAGES = [
  {
    id: 'dm-1',
    senderId: 'dev-1', // Sarah Jenkins
    recipientId: 'admin-1', // Admin
    senderName: 'Sarah Jenkins',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    text: 'Hi Admin! Could you please review the bKash payment gateway callback requirements?',
    timestamp: '09:30 AM'
  },
  {
    id: 'dm-2',
    senderId: 'admin-1',
    recipientId: 'dev-1',
    senderName: 'Admin / Project Manager',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    text: 'Sure Sarah, I just added the API credentials into the Vault & Config section!',
    timestamp: '09:35 AM'
  }
];
