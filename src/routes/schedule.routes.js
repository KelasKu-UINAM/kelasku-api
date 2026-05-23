const express = require('express');
const scheduleController = require('../controllers/schedule.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { scheduleValidator } = require('../validators/schedule.validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/classes/:classId/schedules', scheduleController.getClassSchedules);
router.post('/subjects/:subjectId/schedules', scheduleValidator, validate, scheduleController.createSchedule);
router.put('/schedules/:id', scheduleValidator, validate, scheduleController.updateSchedule);
router.delete('/schedules/:id', scheduleController.deleteSchedule);

module.exports = router;
