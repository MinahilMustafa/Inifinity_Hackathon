import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { DEMO_USERS } from './demoUsers.js';

dotenv.config();

export async function initializeDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = Number(process.env.DB_PORT) || 3306;
  const dbName = process.env.DB_NAME || 'novaworks_crm';

  console.log(`Connecting to MySQL on ${host}:${port}...`);
  const connection = await mysql.createConnection({ host, user, password, port });

  // 1. Create database if it doesn't exist
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await connection.changeUser({ database: dbName });
  console.log(`Database '${dbName}' ready.`);

  // 2. Create Users Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('ADMIN', 'MANAGER', 'AGENT') NOT NULL,
      specialization VARCHAR(150),
      skills JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Create Projects Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      client_name VARCHAR(150) NOT NULL,
      description TEXT,
      manager_id VARCHAR(50) NOT NULL,
      deadline DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE RESTRICT
    );
  `);

  // 4. Create Tasks Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(50) PRIMARY KEY,
      project_id VARCHAR(50) NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      assignee_id VARCHAR(50) NOT NULL,
      deadline DATE NOT NULL,
      estimated_hours DECIMAL(5,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE RESTRICT
    );
  `);

  console.log('Tables created successfully.');

  // 5. Seed Users
  for (const account of DEMO_USERS) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(account.password, salt);
    const skillsJson = JSON.stringify(account.skills);

    await connection.query(
      `INSERT INTO users (id, name, email, password_hash, role, specialization, skills)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         role = VALUES(role),
         specialization = VALUES(specialization),
         skills = VALUES(skills);`,
      [account.id, account.name, account.email, passwordHash, account.role, account.specialization, skillsJson]
    );
  }

  console.log('Demo accounts seeded successfully without duplicates!');
  await connection.end();
}

if (process.argv[1].endsWith('initDb.js')) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Initialization failed:', err);
      process.exit(1);
    });
}
