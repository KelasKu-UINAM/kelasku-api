const announcementService = require('../services/announcement.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getClassAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await announcementService.getClassAnnouncements(req.params.classId, req.user.id);
  return successResponse(res, 'Announcements retrieved', announcements);
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await announcementService.createAnnouncement(req.params.classId, req.body, req.user.id);
  return successResponse(res, 'Announcement created', announcement, 201);
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await announcementService.updateAnnouncement(req.params.id, req.body, req.user.id);
  return successResponse(res, 'Announcement updated', announcement);
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const data = await announcementService.deleteAnnouncement(req.params.id, req.user.id);
  return successResponse(res, 'Announcement deleted', data);
});

module.exports = {
  getClassAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
