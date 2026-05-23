const express = require('express');
const classController = require('../controllers/class.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createClassValidator,
  updateClassValidator,
  joinClassValidator,
  addMemberValidator
} = require('../validators/class.validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', classController.getClasses);
router.post('/', createClassValidator, validate, classController.createClass);
router.post('/join', joinClassValidator, validate, classController.joinClass);
router.get('/:id', classController.getClassById);
router.put('/:id', updateClassValidator, validate, classController.updateClass);
router.delete('/:id', classController.deleteClass);
router.get('/:classId/members', classController.getMembers);
router.post('/:classId/members', addMemberValidator, validate, classController.addMember);
router.delete('/:classId/members/:userId', classController.removeMember);

module.exports = router;
