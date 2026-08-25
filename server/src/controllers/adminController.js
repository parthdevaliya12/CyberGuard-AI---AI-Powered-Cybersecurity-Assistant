const User = require('../models/User');
const Incident = require('../models/Incident');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalIncidents,
      openIncidents,
      resolvedIncidents,
      highRiskIncidents,
      incidentsByCategory,
      incidentsBySeverity,
      recentIncidents,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Incident.countDocuments(),
      Incident.countDocuments({ status: 'Open' }),
      Incident.countDocuments({ status: 'Resolved' }),
      Incident.countDocuments({ severity: { $in: ['High', 'Critical'] } }),
      Incident.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Incident.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } },
      ]),
      Incident.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalIncidents,
        openIncidents,
        resolvedIncidents,
        highRiskIncidents,
        incidentsByCategory,
        incidentsBySeverity,
      },
      recentIncidents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await User.countDocuments();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all incidents (admin)
// @route   GET /api/admin/incidents
exports.getAllIncidents = async (req, res, next) => {
  try {
    const { status, category, severity, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Incident.countDocuments(query);
    const incidents = await Incident.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      incidents,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident (admin) — status, severity
// @route   PUT /api/admin/incidents/:id
exports.updateIncident = async (req, res, next) => {
  try {
    const { status, severity } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return next(new ErrorResponse('Incident not found', 404));
    }

    const oldStatus = incident.status;
    if (status) incident.status = status;
    if (severity) incident.severity = severity;
    await incident.save();

    // Notify user of status change
    if (status && status !== oldStatus) {
      const notificationType = status === 'Resolved' ? 'incident_resolved' : 'status_change';
      await Notification.create({
        user: incident.user,
        type: notificationType,
        title: status === 'Resolved' ? 'Incident Resolved' : 'Incident Status Updated',
        message: `Incident "${incident.title}" status changed to ${status}.`,
        relatedIncident: incident._id,
      });
    }

    res.json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete incident (admin)
// @route   DELETE /api/admin/incidents/:id
exports.deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return next(new ErrorResponse('Incident not found', 404));
    }

    await Incident.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Incident deleted' });
  } catch (error) {
    next(error);
  }
};
