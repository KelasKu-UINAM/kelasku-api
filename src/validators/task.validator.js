const { body } = require('express-validator');

const taskValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('deadline').isISO8601().withMessage('Valid deadline date is required'),
  body('description').optional({ nullable: true, checkFalsy: true }).isString(),
  body('attachment_url').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Attachment URL must be valid')
];

module.exports = {
  taskValidator
};
