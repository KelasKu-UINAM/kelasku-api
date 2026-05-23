const express = require('express');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { paymentValidator } = require('../validators/payment.validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/classes/:classId/payments', paymentController.getClassPayments);
router.post('/classes/:classId/payments', paymentValidator, validate, paymentController.createPayments);
router.put('/payments/:id/pay', paymentController.markPaymentPaid);
router.get('/classes/:classId/payments/summary', paymentController.getPaymentSummary);
router.get('/classes/:classId/payments/me', paymentController.getMyPayments);

module.exports = router;
