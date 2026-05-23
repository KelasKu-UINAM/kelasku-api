const classService = require('../services/class.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getClasses = asyncHandler(async (req, res) => {
  const classes = await classService.getUserClasses(req.user.id);
  return successResponse(res, 'Classes retrieved', classes);
});

const createClass = asyncHandler(async (req, res) => {
  const createdClass = await classService.createClass(req.body, req.user.id);
  return successResponse(res, 'Class created', createdClass, 201);
});

const getClassById = asyncHandler(async (req, res) => {
  const selectedClass = await classService.getClassById(req.params.id, req.user.id);
  return successResponse(res, 'Class retrieved', selectedClass);
});

const updateClass = asyncHandler(async (req, res) => {
  const updatedClass = await classService.updateClass(req.params.id, req.body, req.user.id);
  return successResponse(res, 'Class updated', updatedClass);
});

const deleteClass = asyncHandler(async (req, res) => {
  const data = await classService.deleteClass(req.params.id, req.user.id);
  return successResponse(res, 'Class deleted', data);
});

const joinClass = asyncHandler(async (req, res) => {
  const data = await classService.joinClass(req.body.class_code, req.user.id);
  return successResponse(res, 'Joined class successfully', data, 201);
});

const getMembers = asyncHandler(async (req, res) => {
  const members = await classService.getMembers(req.params.classId, req.user.id);
  return successResponse(res, 'Class members retrieved', members);
});

const addMember = asyncHandler(async (req, res) => {
  const member = await classService.addMember(req.params.classId, req.body, req.user.id);
  return successResponse(res, 'Class member saved', member, 201);
});

const removeMember = asyncHandler(async (req, res) => {
  const data = await classService.removeMember(req.params.classId, req.params.userId, req.user.id);
  return successResponse(res, 'Class member removed', data);
});

module.exports = {
  getClasses,
  createClass,
  getClassById,
  updateClass,
  deleteClass,
  joinClass,
  getMembers,
  addMember,
  removeMember
};
