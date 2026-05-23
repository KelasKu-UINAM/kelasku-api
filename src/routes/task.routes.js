const express = require('express');
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { taskValidator } = require('../validators/task.validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/classes/:classId/tasks', taskController.getClassTasks);
router.get('/subjects/:subjectId/tasks', taskController.getSubjectTasks);
router.post('/subjects/:subjectId/tasks', taskValidator, validate, taskController.createTask);
router.put('/tasks/:id', taskValidator, validate, taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
