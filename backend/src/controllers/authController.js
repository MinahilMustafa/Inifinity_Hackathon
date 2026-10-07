import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'supersecret_novaworks_jwt_token_2026',
      { expiresIn: '8h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        skills: typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
}

export async function signup(req, res) {
  try {
    const { id, name, email, password, role, specialization, skills } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    const userId = id || `USER_${Date.now()}`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const skillsJson = JSON.stringify(skills || []);

    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, specialization, skills)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, email, passwordHash, role, specialization || '', skillsJson]
    );

    return res.status(201).json({
      message: 'User created successfully',
      user: { id: userId, name, email, role, specialization }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function getProfile(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, specialization, skills FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = rows[0];
    user.skills = typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills;
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}

export async function getTeamDirectory(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, specialization, skills FROM users ORDER BY role, name');
    const formatted = rows.map(u => ({
      ...u,
      skills: typeof u.skills === 'string' ? JSON.parse(u.skills) : u.skills
    }));
    return res.json({ team: formatted });
  } catch (err) {
    console.error('Directory error:', err);
    return res.status(500).json({ error: 'Failed to fetch team directory' });
  }
}
