const paymentService = require('../services/payment.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getClassPayments = asyncHandler(async (req, res) => {
  const payments = await paymentService.getClassPayments(req.params.classId, req.user.id);
  return successResponse(res, 'Payments retrieved', payments);
});

const createPayments = asyncHandler(async (req, res) => {
  const data = await paymentService.createPayments(req.params.classId, req.body, req.user.id);
  return successResponse(res, 'Payments created', data, 201);
});

const markPaymentPaid = asyncHandler(async (req, res) => {
  const payment = await paymentService.markPaymentPaid(req.params.id, req.user.id);
  return successResponse(res, 'Payment marked as paid', payment);
});

const getPaymentSummary = asyncHandler(async (req, res) => {
  const summary = await paymentService.getPaymentSummary(req.params.classId, req.user.id);
  return successResponse(res, 'Payment summary retrieved', summary);
});

const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await paymentService.getMyPayments(req.params.classId, req.user.id);
  return successResponse(res, 'My payments retrieved', payments);
});

module.exports = {
  getClassPayments,
  createPayments,
  markPaymentPaid,
  getPaymentSummary,
  getMyPayments
};
