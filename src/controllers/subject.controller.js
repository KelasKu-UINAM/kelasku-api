const subjectService = require('../services/subject.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getClassSubjects = asyncHandler(async (req, res) => {
  const subjects = await subjectService.getClassSubjects(req.params.classId, req.user.id);
  return successResponse(res, 'Subjects retrieved', subjects);
});

const createSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.createSubject(req.params.classId, req.body, req.user.id);
  return successResponse(res, 'Subject created', subject, 201);
});

const updateSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.updateSubject(req.params.id, req.body, req.user.id);
  return successResponse(res, 'Subject updated', subject);
});

const deleteSubject = asyncHandler(async (req, res) => {
  const data = await subjectService.deleteSubject(req.params.id, req.user.id);
  return successResponse(res, 'Subject deleted', data);
});

module.exports = {
  getClassSubjects,
  createSubject,
  updateSubject,
  deleteSubject
};
