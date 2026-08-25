const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  getDashboardStats,
  getAllUsers,
  getAllIncidents,
  updateIncident,
  deleteIncident,
} = require('../controllers/adminController');

router.use(auth, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/incidents', getAllIncidents);
router.put('/incidents/:id', updateIncident);
router.delete('/incidents/:id', deleteIncident);

module.exports = router;
