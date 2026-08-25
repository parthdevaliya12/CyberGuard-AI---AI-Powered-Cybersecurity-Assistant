const Incident = require('../models/Incident');
const Notification = require('../models/Notification');

/**
 * Create a security incident for the authenticated user.
 * @param {Object} params - { title, description, category, severity }
 * @param {string} userId - The authenticated user's ID
 * @returns {Object} - Created incident details
 */
const createIncident = async ({ title, description, category, severity }, userId) => {
  try {
    const incident = await Incident.create({
      title,
      description,
      category,
      severity: severity || 'Medium',
      user: userId,
    });

    // Create notification
    await Notification.create({
      user: userId,
      type: 'incident_created',
      title: 'Incident Created',
      message: `Your incident "${title}" has been created successfully via AI Assistant.`,
      relatedIncident: incident._id,
    });

    return {
      success: true,
      incident: {
        id: incident._id,
        title: incident.title,
        category: incident.category,
        severity: incident.severity,
        status: incident.status,
        createdAt: incident.createdAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to create incident: ${error.message}`,
    };
  }
};

module.exports = createIncident;
