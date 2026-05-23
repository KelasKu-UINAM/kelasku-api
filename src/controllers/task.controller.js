const taskService = require('../services/task.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getClassTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getClassTasks(req.params.classId, req.user.id);
  return successResponse(res, 'Tasks retrieved', tasks);
});

const getSubjectTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getSubjectTasks(req.params.subjectId, req.user.id);
  return successResponse(res, 'Subject tasks retrieved', tasks);
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.params.subjectId, req.body, req.user.id);
  return successResponse(res, 'Task created', task, 201);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user.id);
  return successResponse(res, 'Task updated', task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const data = await taskService.deleteTask(req.params.id, req.user.id);
  return successResponse(res, 'Task deleted', data);
});

module.exports = {
  getClassTasks,
  getSubjectTasks,
  createTask,
  updateTask,
  deleteTask
};
