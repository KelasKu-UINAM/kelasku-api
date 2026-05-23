const { pool, query } = require('../config/db');
const generateClassCode = require('../utils/generateClassCode');

const createError = (message, statusCode = 400, errors = []) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
};

const getMembership = async (classId, userId) => {
  const result = await query(
    `SELECT id, class_id, user_id, role_in_class, joined_at
     FROM class_members
     WHERE class_id = $1 AND user_id = $2`,
    [classId, userId]
  );

  return result.rows[0] || null;
};

const ensureMember = async (classId, userId) => {
  const membership = await getMembership(classId, userId);
  if (!membership) {
    throw createError('You are not a member of this class', 403);
  }
  return membership;
};

const ensureRole = async (classId, userId, allowedRoles) => {
  const membership = await ensureMember(classId, userId);
  if (!allowedRoles.includes(membership.role_in_class)) {
    throw createError('You do not have permission to access this resource', 403);
  }
  return membership;
};

const generateUniqueClassCode = async () => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const classCode = generateClassCode();
    const result = await query('SELECT id FROM classes WHERE class_code = $1', [classCode]);
    if (result.rowCount === 0) return classCode;
  }

  throw createError('Failed to generate unique class code', 500);
};

const getUserClasses = async (userId) => {
  const result = await query(
    `SELECT c.*, cm.role_in_class
     FROM classes c
     JOIN class_members cm ON cm.class_id = c.id
     WHERE cm.user_id = $1
     ORDER BY c.created_at DESC`,
    [userId]
  );

  return result.rows;
};

const createClass = async (payload, userId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const classCode = await generateUniqueClassCode();

    const classResult = await client.query(
      `INSERT INTO classes (name, faculty, department, semester, academic_year, class_code, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        payload.name,
        payload.faculty || null,
        payload.department || null,
        payload.semester || null,
        payload.academic_year || null,
        classCode,
        userId
      ]
    );

    await client.query(
      `INSERT INTO class_members (class_id, user_id, role_in_class)
       VALUES ($1, $2, $3)`,
      [classResult.rows[0].id, userId, 'admin_komting']
    );

    await client.query('COMMIT');
    return classResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getClassById = async (classId, userId) => {
  await ensureMember(classId, userId);

  const result = await query('SELECT * FROM classes WHERE id = $1', [classId]);
  if (result.rowCount === 0) {
    throw createError('Class not found', 404);
  }

  return result.rows[0];
};

const updateClass = async (classId, payload, userId) => {
  await ensureRole(classId, userId, ['admin_komting']);

  const result = await query(
    `UPDATE classes
     SET name = $1, faculty = $2, department = $3, semester = $4, academic_year = $5
     WHERE id = $6
     RETURNING *`,
    [
      payload.name,
      payload.faculty || null,
      payload.department || null,
      payload.semester || null,
      payload.academic_year || null,
      classId
    ]
  );

  if (result.rowCount === 0) {
    throw createError('Class not found', 404);
  }

  return result.rows[0];
};

const deleteClass = async (classId, userId) => {
  await ensureRole(classId, userId, ['admin_komting']);

  const result = await query('DELETE FROM classes WHERE id = $1 RETURNING id', [classId]);
  if (result.rowCount === 0) {
    throw createError('Class not found', 404);
  }

  return { id: Number(classId) };
};

const joinClass = async (classCode, userId) => {
  const classResult = await query('SELECT * FROM classes WHERE class_code = $1', [classCode]);
  if (classResult.rowCount === 0) {
    throw createError('Class not found', 404);
  }

  const selectedClass = classResult.rows[0];
  const memberResult = await query(
    `INSERT INTO class_members (class_id, user_id, role_in_class)
     VALUES ($1, $2, $3)
     ON CONFLICT (class_id, user_id) DO NOTHING
     RETURNING *`,
    [selectedClass.id, userId, 'mahasiswa']
  );

  if (memberResult.rowCount === 0) {
    throw createError('You are already a member of this class', 409);
  }

  return {
    class: selectedClass,
    membership: memberResult.rows[0]
  };
};

const getMembers = async (classId, userId) => {
  await ensureRole(classId, userId, ['admin_komting']);

  const result = await query(
    `SELECT cm.id, cm.class_id, cm.user_id, cm.role_in_class, cm.joined_at,
            u.name, u.email, u.phone
     FROM class_members cm
     JOIN users u ON u.id = cm.user_id
     WHERE cm.class_id = $1
     ORDER BY cm.joined_at ASC`,
    [classId]
  );

  return result.rows;
};

const addMember = async (classId, payload, userId) => {
  await ensureRole(classId, userId, ['admin_komting']);

  const userResult = await query('SELECT id FROM users WHERE id = $1', [payload.user_id]);
  if (userResult.rowCount === 0) {
    throw createError('User not found', 404);
  }

  const result = await query(
    `INSERT INTO class_members (class_id, user_id, role_in_class)
     VALUES ($1, $2, $3)
     ON CONFLICT (class_id, user_id) DO UPDATE SET role_in_class = EXCLUDED.role_in_class
     RETURNING *`,
    [classId, payload.user_id, payload.role_in_class]
  );

  return result.rows[0];
};

const removeMember = async (classId, memberUserId, userId) => {
  await ensureRole(classId, userId, ['admin_komting']);

  const result = await query(
    `DELETE FROM class_members
     WHERE class_id = $1 AND user_id = $2
     RETURNING id, class_id, user_id`,
    [classId, memberUserId]
  );

  if (result.rowCount === 0) {
    throw createError('Class member not found', 404);
  }

  return result.rows[0];
};

module.exports = {
  createError,
  getMembership,
  ensureMember,
  ensureRole,
  getUserClasses,
  createClass,
  getClassById,
  updateClass,
  deleteClass,
  joinClass,
  getMembers,
  addMember,
  removeMember
};
