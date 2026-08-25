const Incident = require('../models/Incident');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create incident
// @route   POST /api/incidents
exports.createIncident = async (req, res, next) => {
  try {
    const { title, description, category, severity } = req.body;

    const incident = await Incident.create({
      title,
      description,
      category,
      severity: severity || 'Medium',
      user: req.user._id,
    });

    // Create notification
    await Notification.create({
      user: req.user._id,
      type: 'incident_created',
      title: 'Incident Created',
      message: `Your incident "${title}" has been created successfully.`,
      relatedIncident: incident._id,
    });

    res.status(201).json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my incidents
// @route   GET /api/incidents
exports.getMyIncidents = async (req, res, next) => {
  try {
    const { status, category, severity, search, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

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
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      incidents,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single incident
// @route   GET /api/incidents/:id
exports.getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id).populate('user', 'name email');

    if (!incident) {
      return next(new ErrorResponse('Incident not found', 404));
    }

    // Check ownership (unless admin)
    if (incident.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to view this incident', 403));
    }

    res.json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident
// @route   PUT /api/incidents/:id
exports.updateIncident = async (req, res, next) => {
  try {
    let incident = await Incident.findById(req.params.id);

    if (!incident) {
      return next(new ErrorResponse('Incident not found', 404));
    }

    // Users can only update their own incidents
    if (incident.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this incident', 403));
    }

    // Regular users can only cancel (close) their own incidents
    if (req.user.role !== 'admin') {
      const allowedUpdates = {};
      if (req.body.status === 'Closed') {
        allowedUpdates.status = 'Closed';
      }
      if (req.body.title) allowedUpdates.title = req.body.title;
      if (req.body.description) allowedUpdates.description = req.body.description;
      req.body = allowedUpdates;
    }

    const oldStatus = incident.status;

    incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Notify if status changed
    if (req.body.status && req.body.status !== oldStatus) {
      const notificationType = req.body.status === 'Resolved' ? 'incident_resolved' : 'status_change';
      await Notification.create({
        user: incident.user,
        type: notificationType,
        title: req.body.status === 'Resolved' ? 'Incident Resolved' : 'Incident Status Updated',
        message: `Incident "${incident.title}" status changed to ${req.body.status}.`,
        relatedIncident: incident._id,
      });
    }

    res.json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete incident
// @route   DELETE /api/incidents/:id
exports.deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return next(new ErrorResponse('Incident not found', 404));
    }

    // Only admin or owner can delete
    if (incident.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this incident', 403));
    }

    await Incident.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Incident deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get incident stats for current user
// @route   GET /api/incidents/stats/me
exports.getMyStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, open, resolved, highRisk] = await Promise.all([
      Incident.countDocuments({ user: userId }),
      Incident.countDocuments({ user: userId, status: 'Open' }),
      Incident.countDocuments({ user: userId, status: 'Resolved' }),
      Incident.countDocuments({ user: userId, severity: { $in: ['High', 'Critical'] } }),
    ]);

    const recentIncidents = await Incident.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: { total, open, resolved, highRisk },
      recentIncidents,
    });
  } catch (error) {
    next(error);
  }
};
