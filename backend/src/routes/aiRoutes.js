import express from 'express';
import { testAI, createFromTranscript } from '../controllers/aiController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Step 5: Test endpoint
router.post('/test', testAI);

// Step 6: Create projects and tasks from transcript (Admin only)
router.post('/create-from-transcript', authenticateToken, authorizeRoles('ADMIN'), createFromTranscript);

export default router;
