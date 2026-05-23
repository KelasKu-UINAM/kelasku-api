const forumService = require('../services/forum.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getClassForums = asyncHandler(async (req, res) => {
  const forums = await forumService.getClassForums(req.params.classId, req.user.id);
  return successResponse(res, 'Forums retrieved', forums);
});

const createForum = asyncHandler(async (req, res) => {
  const forum = await forumService.createForum(req.params.classId, req.body, req.user.id);
  return successResponse(res, 'Forum created', forum, 201);
});

const getForumMessages = asyncHandler(async (req, res) => {
  const messages = await forumService.getForumMessages(req.params.forumId, req.user.id);
  return successResponse(res, 'Messages retrieved', messages);
});

const createMessage = asyncHandler(async (req, res) => {
  const message = await forumService.createMessage(req.params.forumId, req.body, req.user.id);
  return successResponse(res, 'Message sent', message, 201);
});

module.exports = {
  getClassForums,
  createForum,
  getForumMessages,
  createMessage
};
