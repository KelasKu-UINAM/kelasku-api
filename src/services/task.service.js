const { query } = require('../config/db');
const { createError, ensureMember, ensureRole } = require('./class.service');
const { getSubjectById } = require('./subject.service');

const getTaskById = async (taskId) => {
  const result = await query(
    `SELECT t.*, s.class_id
     FROM tasks t
     JOIN subjects s ON s.id = t.subject_id
     WHERE t.id = $1`,
    [taskId]
  );
  return result.rows[0] || null;
};

const getClassTasks = async (classId, userId) => {
  await ensureMember(classId, userId);

  const result = await query(
    `SELECT t.*, s.name AS subject_name, s.lecturer, s.code AS subject_code
     FROM tasks t
     JOIN subjects s ON s.id = t.subject_id
     WHERE s.class_id = $1
     ORDER BY t.deadline ASC`,
    [classId]
  );

  return result.rows;
};

const getSubjectTasks = async (subjectId, userId) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) {
    throw createError('Subject not found', 404);
  }

  await ensureMember(subject.class_id, userId);

  const result = await query(
    `SELECT *
     FROM tasks
     WHERE subject_id = $1
     ORDER BY deadline ASC`,
    [subjectId]
  );

  return result.rows;
};

const createTask = async (subjectId, payload, userId) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) {
    throw createError('Subject not found', 404);
  }

  await ensureRole(subject.class_id, userId, ['admin_komting']);

  const result = await query(
    `INSERT INTO tasks (subject_id, title, description, deadline, attachment_url, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      subjectId,
      payload.title,
      payload.description || null,
      payload.deadline,
      payload.attachment_url || null,
      userId
    ]
  );

  return result.rows[0];
};

const updateTask = async (taskId, payload, userId) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw createError('Task not found', 404);
  }

  await ensureRole(task.class_id, userId, ['admin_komting']);

  const result = await query(
    `UPDATE tasks
     SET title = $1, description = $2, deadline = $3, attachment_url = $4
     WHERE id = $5
     RETURNING *`,
    [payload.title, payload.description || null, payload.deadline, payload.attachment_url || null, taskId]
  );

  return result.rows[0];
};

const deleteTask = async (taskId, userId) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw createError('Task not found', 404);
  }

  await ensureRole(task.class_id, userId, ['admin_komting']);
  await query('DELETE FROM tasks WHERE id = $1', [taskId]);

  return { id: Number(taskId) };
};

module.exports = {
  getClassTasks,
  getSubjectTasks,
  createTask,
  updateTask,
  deleteTask
};
