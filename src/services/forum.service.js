const { query } = require('../config/db');
const { createError, ensureMember, ensureRole } = require('./class.service');

const getForumById = async (forumId) => {
  const result = await query('SELECT * FROM forums WHERE id = $1', [forumId]);
  return result.rows[0] || null;
};

const assertSubjectInClass = async (subjectId, classId) => {
  const result = await query('SELECT id FROM subjects WHERE id = $1 AND class_id = $2', [subjectId, classId]);
  if (result.rowCount === 0) {
    throw createError('Subject does not belong to this class', 422);
  }
};

const getClassForums = async (classId, userId) => {
  await ensureMember(classId, userId);

  const result = await query(
    `SELECT f.*, s.name AS subject_name
     FROM forums f
     LEFT JOIN subjects s ON s.id = f.subject_id
     WHERE f.class_id = $1
     ORDER BY f.created_at ASC`,
    [classId]
  );

  return result.rows;
};

const createForum = async (classId, payload, userId) => {
  await ensureRole(classId, userId, ['admin_komting']);

  const subjectId = payload.type === 'subject' ? payload.subject_id : null;
  if (payload.type === 'subject') {
    await assertSubjectInClass(subjectId, classId);
  }

  const result = await query(
    `INSERT INTO forums (class_id, subject_id, type, name)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [classId, subjectId, payload.type, payload.name]
  );

  return result.rows[0];
};

const getForumMessages = async (forumId, userId) => {
  const forum = await getForumById(forumId);
  if (!forum) {
    throw createError('Forum not found', 404);
  }

  await ensureMember(forum.class_id, userId);

  const result = await query(
    `SELECT m.*, u.name AS sender_name
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.forum_id = $1
     ORDER BY m.created_at ASC`,
    [forumId]
  );

  return result.rows;
};

const createMessage = async (forumId, payload, userId) => {
  const forum = await getForumById(forumId);
  if (!forum) {
    throw createError('Forum not found', 404);
  }

  await ensureMember(forum.class_id, userId);

  const result = await query(
    `INSERT INTO messages (forum_id, sender_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [forumId, userId, payload.message]
  );

  return result.rows[0];
};

module.exports = {
  getClassForums,
  createForum,
  getForumMessages,
  createMessage
};
