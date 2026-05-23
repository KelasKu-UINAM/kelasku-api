const express = require('express');
const whatsappController = require('../controllers/whatsapp.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/classes/:classId/whatsapp-config', whatsappController.getWhatsappConfig);
router.put('/classes/:classId/whatsapp-config', whatsappController.upsertWhatsappConfig);
router.post('/classes/:classId/send-payment-reminder', whatsappController.sendPaymentReminder);

module.exports = router;
