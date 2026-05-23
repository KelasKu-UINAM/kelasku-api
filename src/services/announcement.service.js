const { query } = require('../config/db');
const { createError, ensureMember, ensureRole, getMembership } = require('./class.service');

const getAnnouncementById = async (announcementId) => {
  const result = await query('SELECT * FROM announcements WHERE id = $1', [announcementId]);
  return result.rows[0] || null;
};

const assertSubjectInClass = async (subjectId, classId) => {
  if (!subjectId) return;

  const result = await query('SELECT id FROM subjects WHERE id = $1 AND class_id = $2', [subjectId, classId]);
  if (result.rowCount === 0) {
    throw createError('Subject does not belong to this class', 422);
  }
};

const getClassAnnouncements = async (classId, userId) => {
  await ensureMember(classId, userId);

  const result = await query(
    `SELECT a.*, u.name AS creator_name, s.name AS subject_name
     FROM announcements a
     LEFT JOIN users u ON u.id = a.created_by
     LEFT JOIN subjects s ON s.id = a.subject_id
     WHERE a.class_id = $1
     ORDER BY a.created_at DESC`,
    [classId]
  );

  return result.rows;
};

const createAnnouncement = async (classId, payload, userId) => {
  await ensureRole(classId, userId, ['admin_komting', 'bendahara']);
  await assertSubjectInClass(payload.subject_id, classId);

  const result = await query(
    `INSERT INTO announcements (class_id, subject_id, title, content, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [classId, payload.subject_id || null, payload.title, payload.content, userId]
  );

  return result.rows[0];
};

const ensureCanModifyAnnouncement = async (announcement, userId) => {
  const membership = await getMembership(announcement.class_id, userId);
  if (!membership) {
    throw createError('You are not a member of this class', 403);
  }

  if (membership.role_in_class !== 'admin_komting' && announcement.created_by !== userId) {
    throw createError('You do not have permission to modify this announcement', 403);
  }
};

const updateAnnouncement = async (announcementId, payload, userId) => {
  const announcement = await getAnnouncementById(announcementId);
  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  await ensureCanModifyAnnouncement(announcement, userId);
  await assertSubjectInClass(payload.subject_id, announcement.class_id);

  const result = await query(
    `UPDATE announcements
     SET subject_id = $1, title = $2, content = $3
     WHERE id = $4
     RETURNING *`,
    [payload.subject_id || null, payload.title, payload.content, announcementId]
  );

  return result.rows[0];
};

const deleteAnnouncement = async (announcementId, userId) => {
  const announcement = await getAnnouncementById(announcementId);
  if (!announcement) {
    throw createError('Announcement not found', 404);
  }

  await ensureCanModifyAnnouncement(announcement, userId);
  await query('DELETE FROM announcements WHERE id = $1', [announcementId]);

  return { id: Number(announcementId) };
};

module.exports = {
  getClassAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
