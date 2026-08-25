const Incident = require('../models/Incident');

/**
 * Get incidents for the authenticated user.
 * @param {Object} params - { status }
 * @param {string} userId - The authenticated user's ID
 * @returns {Object} - User's incidents
 */
const getIncidents = async ({ status }, userId) => {
  try {
    const query = { user: userId };
    if (status) query.status = status;

    const incidents = await Incident.find(query)
      .sort({ createdAt: -1 })
      .limit(10);

    if (incidents.length === 0) {
      return {
        found: false,
        message: status
          ? `No incidents found with status "${status}".`
          : 'You have no incidents yet.',
      };
    }

    return {
      found: true,
      count: incidents.length,
      incidents: incidents.map((i) => ({
        id: i._id,
        title: i.title,
        category: i.category,
        severity: i.severity,
        status: i.status,
        createdAt: i.createdAt,
      })),
    };
  } catch (error) {
    return { found: false, error: 'Failed to retrieve incidents' };
  }
};

module.exports = getIncidents;
