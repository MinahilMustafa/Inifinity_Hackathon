import pool from '../config/db.js';

export async function getProjects(req, res) {
  try {
    const { role, id } = req.user;
    let query = '';
    let params = [];

    if (role === 'ADMIN') {
      query = `
        SELECT p.id, p.name, p.client_name, p.description, p.manager_id, DATE_FORMAT(p.deadline, '%Y-%m-%d') as deadline,
        u.name as manager_name, u.email as manager_email,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as task_count,
        (SELECT COALESCE(SUM(t.estimated_hours), 0) FROM tasks t WHERE t.project_id = p.id) as total_hours
        FROM projects p
        LEFT JOIN users u ON p.manager_id = u.id
        ORDER BY p.deadline ASC
      `;
    } else if (role === 'MANAGER') {
      query = `
        SELECT p.id, p.name, p.client_name, p.description, p.manager_id, DATE_FORMAT(p.deadline, '%Y-%m-%d') as deadline,
        u.name as manager_name, u.email as manager_email,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as task_count,
        (SELECT COALESCE(SUM(t.estimated_hours), 0) FROM tasks t WHERE t.project_id = p.id) as total_hours
        FROM projects p
        LEFT JOIN users u ON p.manager_id = u.id
        WHERE p.manager_id = ?
        ORDER BY p.deadline ASC
      `;
      params = [id];
    } else if (role === 'AGENT') {
      query = `
        SELECT DISTINCT p.*, u.name as manager_name, u.email as manager_email,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.assignee_id = ?) as my_task_count
        FROM projects p
        INNER JOIN tasks t ON p.id = t.project_id
        LEFT JOIN users u ON p.manager_id = u.id
        WHERE t.assignee_id = ?
        ORDER BY p.deadline ASC
      `;
      params = [id, id];
    }

    const [projects] = await pool.query(query, params);
    return res.json({ projects });
  } catch (error) {
    console.error('getProjects error:', error);
    return res.status(500).json({ error: 'Failed to retrieve projects' });
  }
}

export async function getProjectById(req, res) {
  try {
    const { projectId } = req.params;
    const { role, id } = req.user;

    const [projRows] = await pool.query(
      `SELECT p.*, u.name as manager_name, u.email as manager_email
       FROM projects p
       LEFT JOIN users u ON p.manager_id = u.id
       WHERE p.id = ?`,
      [projectId]
    );

    if (projRows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projRows[0];

    // RBAC validation
    if (role === 'MANAGER' && project.manager_id !== id) {
      return res.status(403).json({ error: 'Access denied: You do not manage this project' });
    }

    let taskQuery = '';
    let taskParams = [];

    if (role === 'ADMIN' || (role === 'MANAGER' && project.manager_id === id)) {
      taskQuery = `
        SELECT t.id, t.project_id, t.title, t.description, t.assignee_id, DATE_FORMAT(t.deadline, '%Y-%m-%d') as deadline, t.estimated_hours,
        u.name as assignee_name, u.specialization as assignee_specialization
        FROM tasks t
        LEFT JOIN users u ON t.assignee_id = u.id
        WHERE t.project_id = ?
        ORDER BY t.deadline ASC
      `;
      taskParams = [projectId];
    } else if (role === 'AGENT') {
      taskQuery = `
        SELECT t.id, t.project_id, t.title, t.description, t.assignee_id, DATE_FORMAT(t.deadline, '%Y-%m-%d') as deadline, t.estimated_hours,
        u.name as assignee_name, u.specialization as assignee_specialization
        FROM tasks t
        LEFT JOIN users u ON t.assignee_id = u.id
        WHERE t.project_id = ? AND t.assignee_id = ?
        ORDER BY t.deadline ASC
      `;
      taskParams = [projectId, id];
    }

    const [tasks] = await pool.query(taskQuery, taskParams);

    // If agent has no tasks in this project, they shouldn't view it
    if (role === 'AGENT' && tasks.length === 0) {
      return res.status(403).json({ error: 'Access denied: You have no assignments in this project' });
    }

    return res.json({ project: { ...project, tasks } });
  } catch (error) {
    console.error('getProjectById error:', error);
    return res.status(500).json({ error: 'Failed to retrieve project details' });
  }
}

export async function getMyTasks(req, res) {
  try {
    const { id } = req.user;
    const [tasks] = await pool.query(
      `SELECT t.id, t.project_id, t.title, t.description, t.assignee_id, DATE_FORMAT(t.deadline, '%Y-%m-%d') as deadline, t.estimated_hours,
              p.name as project_name, p.client_name, u.name as manager_name
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u ON p.manager_id = u.id
       WHERE t.assignee_id = ?
       ORDER BY t.deadline ASC`,
      [id]
    );
    return res.json({ tasks });
  } catch (error) {
    console.error('getMyTasks error:', error);
    return res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
}
