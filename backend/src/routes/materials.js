import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/db.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const uploadDir = join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const getUserId = (req) => {
  return req.headers['x-user-id'] || req.query.userId || '1';
};

/**
 * GET /api/materials
 * Get all materials (optionally filtered by subject/topic)
 */
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { subjectId, topicId } = req.query;

    let query = `
      SELECT * FROM materials
      WHERE user_id = ?
    `;
    const params = [userId];

    if (subjectId && subjectId !== 'all') {
      query += ' AND subject_id = ?';
      params.push(subjectId);
    }

    if (topicId) {
      query += ' AND topic_id = ?';
      params.push(topicId);
    }

    query += ' ORDER BY created_at DESC';

    const materials = await db.all(query, params);

    res.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

/**
 * POST /api/materials/upload
 * Upload a file
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = getUserId(req);
    const { subjectId, topicId } = req.body;

    const fileSize = (req.file.size / 1024 / 1024).toFixed(2) + ' MB';
    const id = uuidv4();

    await db.run(`
      INSERT INTO materials (id, user_id, subject_id, topic_id, name, type, file_path, size)
      VALUES (?, ?, ?, ?, ?, 'file', ?, ?)
    `, [id, userId, subjectId || null, topicId || null, req.file.originalname, req.file.path, fileSize]);

    const material = await db.get('SELECT * FROM materials WHERE id = ?', [id]);

    res.status(201).json(material);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

/**
 * DELETE /api/materials/:id
 * Delete material
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const material = await db.get('SELECT * FROM materials WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Delete file from filesystem
    if (material.file_path && fs.existsSync(material.file_path)) {
      fs.unlinkSync(material.file_path);
    }

    await db.run('DELETE FROM materials WHERE id = ? AND user_id = ?', [id, userId]);

    res.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

export default router;

