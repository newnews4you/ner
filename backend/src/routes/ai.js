import express from 'express';
import { getTutorResponse, getAIRecommendations, generatePracticeQuestions, generateLearningPath } from '../services/aiTutor.js';

const router = express.Router();

// Middleware to extract user ID (in real app, use JWT auth)
const getUserId = (req) => {
  // For now, use query param or header
  // In production, extract from JWT token
  return req.headers['x-user-id'] || req.query.userId || '1';
};

/**
 * POST /api/ai/chat
 * Chat with AI tutor
 * @param {string} message - User message
 * @param {string} mode - 'guide' for main assistant, 'tutor' for subject-specific
 * @param {string} subjectName - Subject name for tutor mode
 * @param {string} topic - Current topic
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, mode, subjectName, subjectId, topic } = req.body;
    const userId = getUserId(req);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await getTutorResponse(userId, message, {
      mode: mode || 'guide', // default to guide mode
      subjectName,
      subjectId,
      topic
    });

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: 'Failed to get AI tutor response',
      message: error.message
    });
  }
});

/**
 * GET /api/ai/recommendations
 * Get AI-powered study recommendations
 */
router.get('/recommendations', async (req, res) => {
  try {
    const { subjectId } = req.query;
    const userId = getUserId(req);

    const recommendations = await getAIRecommendations(userId, subjectId || null);

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      error: 'Failed to get recommendations',
      message: error.message
    });
  }
});

/**
 * POST /api/ai/practice
 * Generate practice questions
 */
router.post('/practice', async (req, res) => {
  try {
    const { subject, topic, difficulty = 'medium', count = 5 } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ error: 'Subject and topic are required' });
    }

    const questions = await generatePracticeQuestions(subject, topic, difficulty, count);

    res.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error('Error generating practice questions:', error);
    res.status(500).json({
      error: 'Failed to generate practice questions',
      message: error.message
    });
  }
});

/**
 * POST /api/ai/learning-path
 * Generate personalized learning path
 */
router.post('/learning-path', async (req, res) => {
  try {
    const { subject, currentLevel = 0 } = req.body;

    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    const steps = await generateLearningPath(subject, currentLevel);

    res.json({
      success: true,
      steps
    });
  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({
      error: 'Failed to generate learning path',
      message: error.message
    });
  }
});

export default router;

