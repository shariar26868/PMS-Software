import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

import User from './models/User.js';
import Project from './models/Project.js';
import Feature from './models/Feature.js';
import ChatMessage from './models/Chat.js';

import { INITIAL_USERS } from '../src/services/sampleUsers.js';
import { INITIAL_PROJECT, INITIAL_FEATURES } from '../src/services/sampleData.js';
import { INITIAL_CHAT_MESSAGES } from '../src/services/sampleChat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_management_db';

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Database Connection & Auto Seed Logic
async function startServer() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB Connected successfully to: ${MONGO_URI}`);

    // Seed Users if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(INITIAL_USERS);
      console.log('🌱 Seeded Initial Users into MongoDB');
    }

    // Seed Projects if empty
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.create(INITIAL_PROJECT);
      console.log('🌱 Seeded Initial Projects into MongoDB');
    }

    // Seed Features if empty
    const featureCount = await Feature.countDocuments();
    if (featureCount === 0) {
      await Feature.insertMany(INITIAL_FEATURES);
      console.log('🌱 Seeded Initial Features into MongoDB');
    }

    // Seed Chat Messages if empty
    const chatCount = await ChatMessage.countDocuments();
    if (chatCount === 0) {
      await ChatMessage.insertMany(INITIAL_CHAT_MESSAGES);
      console.log('🌱 Seeded Initial Chat Messages into MongoDB');
    }

  } catch (err) {
    console.error('⚠️ MongoDB Connection Note:', err.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Express Server running on http://127.0.0.1:${PORT}`);
  });
}

startServer();
