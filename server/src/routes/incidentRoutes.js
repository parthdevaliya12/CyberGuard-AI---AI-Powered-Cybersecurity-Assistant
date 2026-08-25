const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createIncidentValidator,
  updateIncidentValidator,
} = require('../validators/incidentValidator');
const {
  createIncident,
  getMyIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  getMyStats,
} = require('../controllers/incidentController');

router.use(auth);

router.get('/stats/me', getMyStats);
router.post('/', createIncidentValidator, validate, createIncident);
router.get('/', getMyIncidents);
router.get('/:id', getIncidentById);
router.put('/:id', updateIncidentValidator, validate, updateIncident);
router.delete('/:id', deleteIncident);

module.exports = router;
