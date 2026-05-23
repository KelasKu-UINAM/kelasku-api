const express = require('express');
const announcementController = require('../controllers/announcement.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { announcementValidator } = require('../validators/announcement.validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/classes/:classId/announcements', announcementController.getClassAnnouncements);
router.post('/classes/:classId/announcements', announcementValidator, validate, announcementController.createAnnouncement);
router.put('/announcements/:id', announcementValidator, validate, announcementController.updateAnnouncement);
router.delete('/announcements/:id', announcementController.deleteAnnouncement);

module.exports = router;
