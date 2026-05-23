const { query } = require('../config/db');
const { ensureMember } = require('./class.service');

const getTodayName = () => {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', timeZone: 'Asia/Makassar' }).format(new Date());
};

const getDashboard = async (classId, userId) => {
  await ensureMember(classId, userId);

  const today = getTodayName();

  const todaySchedules = await query(
    `SELECT s.*, sub.name AS subject_name, sub.lecturer, sub.code AS subject_code
     FROM schedules s
     JOIN subjects sub ON sub.id = s.subject_id
     WHERE sub.class_id = $1 AND LOWER(s.day) = LOWER($2)
     ORDER BY s.start_time ASC`,
    [classId, today]
  );

  const announcements = await query(
    `SELECT a.*, u.name AS creator_name, sub.name AS subject_name
     FROM announcements a
     LEFT JOIN users u ON u.id = a.created_by
     LEFT JOIN subjects sub ON sub.id = a.subject_id
     WHERE a.class_id = $1
     ORDER BY a.created_at DESC
     LIMIT 5`,
    [classId]
  );

  const tasks = await query(
    `SELECT t.*, sub.name AS subject_name, sub.lecturer
     FROM tasks t
     JOIN subjects sub ON sub.id = t.subject_id
     WHERE sub.class_id = $1 AND t.deadline >= NOW()
     ORDER BY t.deadline ASC
     LIMIT 5`,
    [classId]
  );

  const summary = await query(
    `SELECT
       (SELECT COUNT(*)::INT FROM class_members WHERE class_id = $1) AS total_members,
       COUNT(*) FILTER (WHERE status = 'paid')::INT AS total_paid,
       COUNT(*) FILTER (WHERE status = 'unpaid')::INT AS total_unpaid,
       COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)::NUMERIC AS total_amount_paid,
       COALESCE(SUM(amount) FILTER (WHERE status = 'unpaid'), 0)::NUMERIC AS total_amount_unpaid
     FROM payments
     WHERE class_id = $1`,
    [classId]
  );

  return {
    today_schedules: todaySchedules.rows,
    latest_announcements: announcements.rows,
    upcoming_tasks: tasks.rows,
    payment_summary: summary.rows[0]
  };
};

module.exports = {
  getDashboard
};
