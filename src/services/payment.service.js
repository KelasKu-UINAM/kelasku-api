const { query } = require('../config/db');
const { createError, ensureMember, ensureRole } = require('./class.service');

const getPaymentById = async (paymentId) => {
  const result = await query(
    `SELECT p.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
     FROM payments p
     JOIN users u ON u.id = p.user_id
     WHERE p.id = $1`,
    [paymentId]
  );
  return result.rows[0] || null;
};

const getClassPayments = async (classId, userId) => {
  const membership = await ensureMember(classId, userId);
  const params = [classId];
  let userFilter = '';

  if (!['admin_komting', 'bendahara'].includes(membership.role_in_class)) {
    params.push(userId);
    userFilter = 'AND p.user_id = $2';
  }

  const result = await query(
    `SELECT p.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
     FROM payments p
     JOIN users u ON u.id = p.user_id
     WHERE p.class_id = $1 ${userFilter}
     ORDER BY p.payment_week ASC, u.name ASC`,
    params
  );

  return result.rows;
};

const createPayments = async (classId, payload, userId) => {
  await ensureRole(classId, userId, ['admin_komting', 'bendahara']);

  const result = await query(
    `INSERT INTO payments (class_id, user_id, amount, payment_week, note)
     SELECT cm.class_id, cm.user_id, $2, $3, $4
     FROM class_members cm
     WHERE cm.class_id = $1
     ON CONFLICT (class_id, user_id, payment_week) DO NOTHING
     RETURNING *`,
    [classId, payload.amount, payload.payment_week, payload.note || null]
  );

  return {
    inserted_count: result.rowCount,
    payments: result.rows
  };
};

const markPaymentPaid = async (paymentId, userId) => {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    throw createError('Payment not found', 404);
  }

  await ensureRole(payment.class_id, userId, ['admin_komting', 'bendahara']);

  const result = await query(
    `UPDATE payments
     SET status = $1, paid_at = NOW()
     WHERE id = $2
     RETURNING *`,
    ['paid', paymentId]
  );

  return result.rows[0];
};

const getPaymentSummary = async (classId, userId) => {
  await ensureRole(classId, userId, ['admin_komting', 'bendahara']);

  const result = await query(
    `SELECT
       (SELECT COUNT(*)::INT FROM class_members WHERE class_id = $1) AS total_members,
       COUNT(*) FILTER (WHERE status = 'paid')::INT AS total_paid,
       COUNT(*) FILTER (WHERE status = 'unpaid')::INT AS total_unpaid,
       COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)::NUMERIC AS total_amount_paid,
       COALESCE(SUM(amount) FILTER (WHERE status = 'unpaid'), 0)::NUMERIC AS total_amount_unpaid
     FROM payments
     WHERE class_id = $1`,
    [classId]
  );

  return result.rows[0];
};

const getMyPayments = async (classId, userId) => {
  await ensureMember(classId, userId);

  const result = await query(
    `SELECT *
     FROM payments
     WHERE class_id = $1 AND user_id = $2
     ORDER BY payment_week ASC`,
    [classId, userId]
  );

  return result.rows;
};

module.exports = {
  getPaymentById,
  getClassPayments,
  createPayments,
  markPaymentPaid,
  getPaymentSummary,
  getMyPayments
};
