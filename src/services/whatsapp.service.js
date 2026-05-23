const { query } = require('../config/db');
const { createError, ensureRole } = require('./class.service');

const defaultTemplate = 'Assalamu alaikum {name}, mohon membayar iuran minggu ke-{payment_week} sebesar Rp{amount}. Terima kasih.';

const getWhatsappConfig = async (classId, userId) => {
  await ensureRole(classId, userId, ['admin_komting', 'bendahara']);

  const result = await query('SELECT * FROM whatsapp_configs WHERE class_id = $1', [classId]);

  return result.rows[0] || {
    class_id: Number(classId),
    admin_phone: null,
    treasurer_phone: null,
    notification_template: defaultTemplate
  };
};

const upsertWhatsappConfig = async (classId, payload, userId) => {
  await ensureRole(classId, userId, ['admin_komting', 'bendahara']);

  const result = await query(
    `INSERT INTO whatsapp_configs (class_id, admin_phone, treasurer_phone, notification_template)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (class_id)
     DO UPDATE SET
       admin_phone = EXCLUDED.admin_phone,
       treasurer_phone = EXCLUDED.treasurer_phone,
       notification_template = EXCLUDED.notification_template
     RETURNING *`,
    [
      classId,
      payload.admin_phone || null,
      payload.treasurer_phone || null,
      payload.notification_template || defaultTemplate
    ]
  );

  return result.rows[0];
};

const findPaymentForReminder = async (classId, payload) => {
  if (payload.payment_id) {
    const paymentResult = await query(
      `SELECT p.*, u.name, u.phone
       FROM payments p
       JOIN users u ON u.id = p.user_id
       WHERE p.id = $1 AND p.class_id = $2`,
      [payload.payment_id, classId]
    );
    return paymentResult.rows[0] || null;
  }

  if (payload.user_id) {
    const paymentResult = await query(
      `SELECT p.*, u.name, u.phone
       FROM payments p
       JOIN users u ON u.id = p.user_id
       WHERE p.class_id = $1 AND p.user_id = $2
       ORDER BY
         CASE WHEN p.status = 'unpaid' THEN 0 ELSE 1 END,
         p.payment_week DESC
       LIMIT 1`,
      [classId, payload.user_id]
    );
    return paymentResult.rows[0] || null;
  }

  throw createError('user_id or payment_id is required', 422);
};

const buildMessage = (template, payment) => {
  return template
    .replaceAll('{name}', payment.name || '')
    .replaceAll('{payment_week}', String(payment.payment_week))
    .replaceAll('{amount}', String(payment.amount))
    .replaceAll('{status}', payment.status || '');
};

const sendPaymentReminder = async (classId, payload, userId) => {
  await ensureRole(classId, userId, ['admin_komting', 'bendahara']);

  const config = await getWhatsappConfig(classId, userId);
  const payment = await findPaymentForReminder(classId, payload);

  if (!payment) {
    throw createError('Payment data not found for reminder', 404);
  }

  const phone = (payment.phone || '').replace(/\D/g, '');
  if (!phone) {
    throw createError('User phone number is not available', 422);
  }

  const template = config.notification_template || defaultTemplate;
  const message = buildMessage(template, payment);
  const whatsapp_link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return {
    whatsapp_link,
    message
  };
};

module.exports = {
  getWhatsappConfig,
  upsertWhatsappConfig,
  sendPaymentReminder
};
