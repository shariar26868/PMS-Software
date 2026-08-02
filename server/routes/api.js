import express from 'express';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Feature from '../models/Feature.js';
import ChatMessage from '../models/Chat.js';

const router = express.Router();

// --- Health Check ---
router.get('/health', (req, res) => {
  res.json({ status: 'ok', db: 'MongoDB Connected' });
});

// --- USERS API ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    const created = await User.create(newUser);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- PROJECTS API ---
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const created = await Project.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const updated = await Project.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- FEATURES API ---
router.get('/features', async (req, res) => {
  try {
    const { projectId } = req.query;
    const query = projectId ? { projectId } : {};
    const features = await Feature.find(query);
    res.json(features);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/features', async (req, res) => {
  try {
    const created = await Feature.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/features/:id', async (req, res) => {
  try {
    const updated = await Feature.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/features/:id', async (req, res) => {
  try {
    await Feature.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- CHAT API ---
router.get('/chat', async (req, res) => {
  try {
    const messages = await ChatMessage.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const created = await ChatMessage.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
