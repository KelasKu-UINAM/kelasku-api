const { body } = require('express-validator');

const createClassValidator = [
  body('name').notEmpty().withMessage('Class name is required'),
  body('faculty').optional({ nullable: true, checkFalsy: true }).isString(),
  body('department').optional({ nullable: true, checkFalsy: true }).isString(),
  body('semester').optional({ nullable: true, checkFalsy: true }).isInt().withMessage('Semester must be a number'),
  body('academic_year').optional({ nullable: true, checkFalsy: true }).isString()
];

const updateClassValidator = createClassValidator;

const joinClassValidator = [
  body('class_code').notEmpty().withMessage('Class code is required')
];

const addMemberValidator = [
  body('user_id').isInt().withMessage('User id is required'),
  body('role_in_class').isIn(['admin_komting', 'bendahara', 'mahasiswa']).withMessage('Invalid class role')
];

module.exports = {
  createClassValidator,
  updateClassValidator,
  joinClassValidator,
  addMemberValidator
};
