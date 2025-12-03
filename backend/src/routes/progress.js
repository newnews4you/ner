import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/db.js';

const router = express.Router();

const getUserId = (req) => {
  return req.headers['x-user-id'] || req.query.userId || '1';
};

/**
 * GET /api/progress
 * Get user progress
 */
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { subjectId } = req.query;

    let query = `
      SELECT 
        p.*,
        s.name as subject_name
      FROM progress p
      JOIN subjects s ON p.subject_id = s.id
      WHERE p.user_id = ?
    `;
    const params = [userId];

    if (subjectId) {
      query += ' AND p.subject_id = ?';
      params.push(subjectId);
    }

    const progress = await db.all(query, params);

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

/**
 * PUT /api/progress/:subjectId
 * Update progress for subject
 */
router.put('/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = getUserId(req);
    const { progressPercentage, timeSpent, topicId } = req.body;

    // Check if progress exists
    let progress = await db.get(`
      SELECT * FROM progress
      WHERE user_id = ? AND subject_id = ?
    `, [userId, subjectId]);

    if (progress) {
      // Update existing
      await db.run(`
        UPDATE progress
        SET progress_percentage = ?,
            time_spent = COALESCE(time_spent, 0) + ?,
            last_studied = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND subject_id = ?
      `, [progressPercentage || progress.progress_percentage, timeSpent || 0, userId, subjectId]);
    } else {
      // Create new
      const id = uuidv4();
      await db.run(`
        INSERT INTO progress (id, user_id, subject_id, topic_id, progress_percentage, time_spent, last_studied)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [id, userId, subjectId, topicId || null, progressPercentage || 0, timeSpent || 0]);
    }

    progress = await db.get(`
      SELECT * FROM progress
      WHERE user_id = ? AND subject_id = ?
    `, [userId, subjectId]);

    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

/**
 * POST /api/progress/session
 * Record study session
 */
router.post('/session', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { subjectId, duration } = req.body;

    if (!duration) {
      return res.status(400).json({ error: 'Duration is required' });
    }

    const id = uuidv4();
    await db.run(`
      INSERT INTO study_sessions (id, user_id, subject_id, duration)
      VALUES (?, ?, ?, ?)
    `, [id, userId, subjectId || null, duration]);

    res.json({ success: true, sessionId: id });
  } catch (error) {
    console.error('Error recording session:', error);
    res.status(500).json({ error: 'Failed to record session' });
  }
});

export default router;

