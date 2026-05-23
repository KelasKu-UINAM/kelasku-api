const express = require('express');
const subjectController = require('../controllers/subject.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { subjectValidator } = require('../validators/subject.validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/classes/:classId/subjects', subjectController.getClassSubjects);
router.post('/classes/:classId/subjects', subjectValidator, validate, subjectController.createSubject);
router.put('/subjects/:id', subjectValidator, validate, subjectController.updateSubject);
router.delete('/subjects/:id', subjectController.deleteSubject);

module.exports = router;
