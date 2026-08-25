const { body } = require('express-validator');

exports.createIncidentValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Phishing',
      'Suspicious URL',
      'Malware',
      'Account Security',
      'Social Engineering',
      'Data Privacy',
      'Other',
    ])
    .withMessage('Invalid category'),
  body('severity')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid severity'),
];

exports.updateIncidentValidator = [
  body('status')
    .optional()
    .isIn(['Open', 'Under Review', 'Resolved', 'Closed'])
    .withMessage('Invalid status'),
  body('severity')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid severity'),
];
