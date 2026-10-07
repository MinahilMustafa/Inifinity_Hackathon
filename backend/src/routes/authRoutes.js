import express from 'express';
import { login, signup, getProfile, getTeamDirectory } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/profile', authenticateToken, getProfile);
router.get('/team', authenticateToken, getTeamDirectory);

export default router;
