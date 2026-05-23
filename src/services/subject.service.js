const { query } = require('../config/db');
const { createError, ensureMember, ensureRole } = require('./class.service');

const getSubjectById = async (subjectId) => {
  const result = await query('SELECT * FROM subjects WHERE id = $1', [subjectId]);
  return result.rows[0] || null;
};

const getClassSubjects = async (classId, userId) => {
  await ensureMember(classId, userId);

  const result = await query(
    `SELECT *
     FROM subjects
     WHERE class_id = $1
     ORDER BY name ASC`,
    [classId]
  );

  return result.rows;
};

const createSubject = async (classId, payload, userId) => {
  await ensureRole(classId, userId, ['admin_komting']);

  const result = await query(
    `INSERT INTO subjects (class_id, name, lecturer, code)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [classId, payload.name, payload.lecturer || null, payload.code || null]
  );

  return result.rows[0];
};

const updateSubject = async (subjectId, payload, userId) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) {
    throw createError('Subject not found', 404);
  }

  await ensureRole(subject.class_id, userId, ['admin_komting']);

  const result = await query(
    `UPDATE subjects
     SET name = $1, lecturer = $2, code = $3
     WHERE id = $4
     RETURNING *`,
    [payload.name, payload.lecturer || null, payload.code || null, subjectId]
  );

  return result.rows[0];
};

const deleteSubject = async (subjectId, userId) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) {
    throw createError('Subject not found', 404);
  }

  await ensureRole(subject.class_id, userId, ['admin_komting']);

  await query('DELETE FROM subjects WHERE id = $1', [subjectId]);
  return { id: Number(subjectId) };
};

module.exports = {
  getSubjectById,
  getClassSubjects,
  createSubject,
  updateSubject,
  deleteSubject
};
