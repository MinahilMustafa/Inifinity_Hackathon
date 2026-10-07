import express from 'express';
import { processTranscriptAndCreate } from '../controllers/transcriptController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Only ADMIN is allowed to process transcripts
router.post('/process', authenticateToken, authorizeRoles('ADMIN'), processTranscriptAndCreate);

export default router;
