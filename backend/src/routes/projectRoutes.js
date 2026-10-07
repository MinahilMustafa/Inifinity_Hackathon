import express from 'express';
import { getProjects, getProjectById, getMyTasks } from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getProjects);
router.get('/my-tasks', authenticateToken, getMyTasks);
router.get('/:projectId', authenticateToken, getProjectById);

export default router;
