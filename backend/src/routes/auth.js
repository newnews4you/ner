import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/db.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const id = uuidv4();
    await db.run(`
      INSERT INTO users (id, email, name, password_hash, provider)
      VALUES (?, ?, ?, ?, 'email')
    `, [id, email, name, passwordHash]);

    const user = await db.get('SELECT id, email, name, provider, created_at FROM users WHERE id = ?', [id]);

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user (without password)
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await db.get('SELECT id, email, name, provider, avatar, created_at FROM users WHERE id = ?', [userId]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;

