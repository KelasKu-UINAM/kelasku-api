const { body } = require('express-validator');

const forumValidator = [
  body('type').isIn(['class', 'subject']).withMessage('Forum type must be class or subject'),
  body('name').notEmpty().withMessage('Forum name is required'),
  body('subject_id')
    .if(body('type').equals('subject'))
    .notEmpty()
    .withMessage('Subject id is required for subject forum')
    .isInt()
    .withMessage('Subject id must be a number')
];

const messageValidator = [
  body('message').notEmpty().withMessage('Message is required')
];

module.exports = {
  forumValidator,
  messageValidator
};
