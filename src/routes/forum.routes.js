const express = require('express');
const forumController = require('../controllers/forum.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { forumValidator, messageValidator } = require('../validators/forum.validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/classes/:classId/forums', forumController.getClassForums);
router.post('/classes/:classId/forums', forumValidator, validate, forumController.createForum);
router.get('/forums/:forumId/messages', forumController.getForumMessages);
router.post('/forums/:forumId/messages', messageValidator, validate, forumController.createMessage);

module.exports = router;
