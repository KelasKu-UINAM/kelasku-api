const { body } = require('express-validator');

const subjectValidator = [
  body('name').notEmpty().withMessage('Subject name is required'),
  body('lecturer').optional({ nullable: true, checkFalsy: true }).isString(),
  body('code').optional({ nullable: true, checkFalsy: true }).isString()
];

module.exports = {
  subjectValidator
};
