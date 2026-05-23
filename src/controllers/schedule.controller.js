const scheduleService = require('../services/schedule.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getClassSchedules = asyncHandler(async (req, res) => {
  const schedules = await scheduleService.getClassSchedules(req.params.classId, req.user.id);
  return successResponse(res, 'Schedules retrieved', schedules);
});

const createSchedule = asyncHandler(async (req, res) => {
  const schedule = await scheduleService.createSchedule(req.params.subjectId, req.body, req.user.id);
  return successResponse(res, 'Schedule created', schedule, 201);
});

const updateSchedule = asyncHandler(async (req, res) => {
  const schedule = await scheduleService.updateSchedule(req.params.id, req.body, req.user.id);
  return successResponse(res, 'Schedule updated', schedule);
});

const deleteSchedule = asyncHandler(async (req, res) => {
  const data = await scheduleService.deleteSchedule(req.params.id, req.user.id);
  return successResponse(res, 'Schedule deleted', data);
});

module.exports = {
  getClassSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
