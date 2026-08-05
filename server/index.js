import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
import apiRoutes from './routes/api.js';

// Ensure DNS resolution succeeds for mongodb+srv connection on Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // fallback if custom DNS setting fails
}

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
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://smtnayem:smtnayemproject@cluster0.p87lrd6.mongodb.net/assignment_db?appName=Cluster0';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Serve Built Frontend Assets in Production if dist folder exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('/{*path}', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Express Server immediately on Port 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Express Server running on http://127.0.0.1:${PORT}`);
});

// Database Connection & Auto Seed Logic (Async)
async function connectAndSeedDB() {
  try {
    const maskedUri = MONGO_URI.replace(/:([^@]+)@/, ':****@');
    console.log(`Connecting to MongoDB... (${maskedUri})`);
    await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected successfully!`);

    // Safe Auto-Seed Logic (Preserves existing data)
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        await User.insertMany(INITIAL_USERS);
        console.log('🌱 Seeded Initial Users into MongoDB');
      }
    } catch (e) {
      console.log('ℹ️ Users collection check/seed note:', e.message);
    }

    try {
      const projectCount = await Project.countDocuments();
      if (projectCount === 0) {
        await Project.create(INITIAL_PROJECT);
        console.log('🌱 Seeded Initial Projects into MongoDB');
      }
    } catch (e) {
      console.log('ℹ️ Projects collection check/seed note:', e.message);
    }

    try {
      const featureCount = await Feature.countDocuments();
      if (featureCount === 0) {
        await Feature.insertMany(INITIAL_FEATURES);
        console.log('🌱 Seeded Initial Features into MongoDB');
      }
    } catch (e) {
      console.log('ℹ️ Features collection check/seed note:', e.message);
    }

    try {
      const chatCount = await ChatMessage.countDocuments();
      if (chatCount === 0) {
        await ChatMessage.insertMany(INITIAL_CHAT_MESSAGES);
        console.log('🌱 Seeded Initial Chat Messages into MongoDB');
      }
    } catch (e) {
      console.log('ℹ️ Chat collection check/seed note:', e.message);
    }

  } catch (err) {
    console.error('⚠️ MongoDB Connection Error:', err.message);
  }
}

connectAndSeedDB();
