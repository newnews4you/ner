import express from 'express';
import db from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Middleware to extract user ID
const getUserId = (req) => {
  return req.headers['x-user-id'] || req.query.userId || '1';
};

/**
 * GET /api/subjects
 * Get all subjects for user
 */
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);

    const subjects = await db.all(`
      SELECT 
        s.*,
        COALESCE(p.progress_percentage, 0) as progress
      FROM subjects s
      LEFT JOIN progress p ON s.id = p.subject_id AND p.user_id = ?
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `, [userId, userId]);

    // Get topics for each subject
    for (const subject of subjects) {
      const topics = await db.all(`
        SELECT * FROM topics
        WHERE subject_id = ?
        ORDER BY order_index ASC
      `, [subject.id]);

      subject.pastTopics = topics.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        duration: t.duration,
        score: t.score
      }));
    }

    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

/**
 * GET /api/subjects/:id
 * Get single subject by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const subject = await db.get(`
      SELECT 
        s.*,
        COALESCE(p.progress_percentage, 0) as progress
      FROM subjects s
      LEFT JOIN progress p ON s.id = p.subject_id AND p.user_id = ?
      WHERE s.id = ? AND s.user_id = ?
    `, [userId, id, userId]);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Get topics
    const topics = await db.all(`
      SELECT * FROM topics
      WHERE subject_id = ?
      ORDER BY order_index ASC
    `, [id]);

    subject.pastTopics = topics.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      duration: t.duration,
      score: t.score
    }));

    res.json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ error: 'Failed to fetch subject' });
  }
});

/**
 * POST /api/subjects
 * Create new subject
 */
router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const {
      name,
      teacher,
      grade,
      gradient,
      iconName,
      currentTopic,
      nextAssessment
    } = req.body;

    if (!name || !teacher || !grade || !gradient || !iconName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    await db.run(`
      INSERT INTO subjects (id, user_id, name, teacher, grade, gradient, icon_name, current_topic, next_assessment)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, userId, name, teacher, grade, gradient, iconName, currentTopic || null, nextAssessment || null]);

    // Initialize progress
    await db.run(`
      INSERT INTO progress (id, user_id, subject_id, progress_percentage)
      VALUES (?, ?, ?, 0)
    `, [uuidv4(), userId, id]);

    const subject = await db.get('SELECT * FROM subjects WHERE id = ?', [id]);
    subject.progress = 0;
    subject.pastTopics = [];

    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

/**
 * PUT /api/subjects/:id
 * Update subject
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const updates = req.body;

    const allowedFields = ['name', 'teacher', 'grade', 'gradient', 'icon_name', 'current_topic', 'next_assessment'];
    const updateFields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      const dbKey = key === 'iconName' ? 'icon_name' : 
                   key === 'currentTopic' ? 'current_topic' :
                   key === 'nextAssessment' ? 'next_assessment' : key;
      
      if (allowedFields.includes(dbKey)) {
        updateFields.push(`${dbKey} = ?`);
        values.push(value);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id, userId);

    await db.run(`
      UPDATE subjects
      SET ${updateFields.join(', ')}
      WHERE id = ? AND user_id = ?
    `, values);

    const subject = await db.get('SELECT * FROM subjects WHERE id = ?', [id]);
    res.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ error: 'Failed to update subject' });
  }
});

/**
 * DELETE /api/subjects/:id
 * Delete subject
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    await db.run('DELETE FROM subjects WHERE id = ? AND user_id = ?', [id, userId]);

    res.json({ success: true, message: 'Subject deleted' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

export default router;

