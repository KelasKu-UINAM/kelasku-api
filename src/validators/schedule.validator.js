const { body } = require('express-validator');

const scheduleValidator = [
  body('day').notEmpty().withMessage('Day is required'),
  body('start_time').notEmpty().withMessage('Start time is required'),
  body('end_time').notEmpty().withMessage('End time is required'),
  body('room').optional({ nullable: true, checkFalsy: true }).isString(),
  body('reminder_minutes_before').optional({ nullable: true, checkFalsy: true }).isInt().withMessage('Reminder must be a number')
];

module.exports = {
  scheduleValidator
};
