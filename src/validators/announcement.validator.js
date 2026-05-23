const { body } = require('express-validator');

const announcementValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('subject_id').optional({ nullable: true, checkFalsy: true }).isInt().withMessage('Subject id must be a number')
];

module.exports = {
  announcementValidator
};
