const { query } = require('../config/db');
const { createError, ensureMember, ensureRole } = require('./class.service');
const { getSubjectById } = require('./subject.service');

const scheduleOrderSql = `
  CASE LOWER(s.day)
    WHEN 'senin' THEN 1
    WHEN 'selasa' THEN 2
    WHEN 'rabu' THEN 3
    WHEN 'kamis' THEN 4
    WHEN 'jumat' THEN 5
    WHEN 'sabtu' THEN 6
    WHEN 'minggu' THEN 7
    ELSE 8
  END,
  s.start_time ASC
`;

const getScheduleById = async (scheduleId) => {
  const result = await query(
    `SELECT s.*, sub.class_id
     FROM schedules s
     JOIN subjects sub ON sub.id = s.subject_id
     WHERE s.id = $1`,
    [scheduleId]
  );
  return result.rows[0] || null;
};

const getClassSchedules = async (classId, userId) => {
  await ensureMember(classId, userId);

  const result = await query(
    `SELECT s.*, sub.name AS subject_name, sub.lecturer, sub.code AS subject_code
     FROM schedules s
     JOIN subjects sub ON sub.id = s.subject_id
     WHERE sub.class_id = $1
     ORDER BY ${scheduleOrderSql}`,
    [classId]
  );

  return result.rows;
};

const createSchedule = async (subjectId, payload, userId) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) {
    throw createError('Subject not found', 404);
  }

  await ensureRole(subject.class_id, userId, ['admin_komting']);

  const result = await query(
    `INSERT INTO schedules (subject_id, day, start_time, end_time, room, reminder_minutes_before)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      subjectId,
      payload.day,
      payload.start_time,
      payload.end_time,
      payload.room || null,
      payload.reminder_minutes_before || 15
    ]
  );

  return result.rows[0];
};

const updateSchedule = async (scheduleId, payload, userId) => {
  const schedule = await getScheduleById(scheduleId);
  if (!schedule) {
    throw createError('Schedule not found', 404);
  }

  await ensureRole(schedule.class_id, userId, ['admin_komting']);

  const result = await query(
    `UPDATE schedules
     SET day = $1, start_time = $2, end_time = $3, room = $4, reminder_minutes_before = $5
     WHERE id = $6
     RETURNING *`,
    [
      payload.day,
      payload.start_time,
      payload.end_time,
      payload.room || null,
      payload.reminder_minutes_before || 15,
      scheduleId
    ]
  );

  return result.rows[0];
};

const deleteSchedule = async (scheduleId, userId) => {
  const schedule = await getScheduleById(scheduleId);
  if (!schedule) {
    throw createError('Schedule not found', 404);
  }

  await ensureRole(schedule.class_id, userId, ['admin_komting']);
  await query('DELETE FROM schedules WHERE id = $1', [scheduleId]);

  return { id: Number(scheduleId) };
};

module.exports = {
  getClassSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
