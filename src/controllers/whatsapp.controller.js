const whatsappService = require('../services/whatsapp.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getWhatsappConfig = asyncHandler(async (req, res) => {
  const config = await whatsappService.getWhatsappConfig(req.params.classId, req.user.id);
  return successResponse(res, 'WhatsApp config retrieved', config);
});

const upsertWhatsappConfig = asyncHandler(async (req, res) => {
  const config = await whatsappService.upsertWhatsappConfig(req.params.classId, req.body, req.user.id);
  return successResponse(res, 'WhatsApp config saved', config);
});

const sendPaymentReminder = asyncHandler(async (req, res) => {
  const data = await whatsappService.sendPaymentReminder(req.params.classId, req.body, req.user.id);
  return successResponse(res, 'WhatsApp payment reminder generated', data);
});

module.exports = {
  getWhatsappConfig,
  upsertWhatsappConfig,
  sendPaymentReminder
};
