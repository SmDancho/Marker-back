const { body } = require('express-validator');

const addPostValidation = [
  body('title').notEmpty().withMessage('title required'),
  body('text').notEmpty().withMessage('text required'),
  body('topic').notEmpty().withMessage('topic required'),
  body('group').notEmpty().withMessage('group required'),
  body('authorRaiting').notEmpty().withMessage('authorRaiting required'),
];

module.exports = { addPostValidation };
