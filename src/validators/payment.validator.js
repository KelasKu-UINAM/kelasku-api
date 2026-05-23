const { body } = require('express-validator');

const paymentValidator = [
  body('amount').isNumeric().withMessage('Amount is required and must be numeric'),
  body('payment_week').isInt().withMessage('Payment week is required and must be numeric'),
  body('note').optional({ nullable: true, checkFalsy: true }).isString()
];

module.exports = {
  paymentValidator
};
