const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getChecklist,
  updateChecklist,
  getSecurityScore,
} = require('../controllers/securityController');

router.use(auth);

router.get('/checklist', getChecklist);
router.put('/checklist', updateChecklist);
router.get('/score', getSecurityScore);

module.exports = router;
