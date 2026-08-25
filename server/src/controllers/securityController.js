const SecurityChecklist = require('../models/SecurityChecklist');
const Incident = require('../models/Incident');
const User = require('../models/User');

// @desc    Get my security checklist
// @route   GET /api/security/checklist
exports.getChecklist = async (req, res, next) => {
  try {
    let checklist = await SecurityChecklist.findOne({ user: req.user._id });

    // Create if doesn't exist
    if (!checklist) {
      checklist = await SecurityChecklist.create({ user: req.user._id });
    }

    res.json({ success: true, checklist });
  } catch (error) {
    next(error);
  }
};

// @desc    Update checklist item
// @route   PUT /api/security/checklist
exports.updateChecklist = async (req, res, next) => {
  try {
    const { key, completed } = req.body;

    const checklist = await SecurityChecklist.findOne({ user: req.user._id });

    if (!checklist) {
      return res.status(404).json({ success: false, message: 'Checklist not found' });
    }

    const item = checklist.items.find((i) => i.key === key);
    if (!item) {
      return res.status(400).json({ success: false, message: 'Invalid checklist item' });
    }

    item.completed = completed;
    await checklist.save();

    res.json({ success: true, checklist });
  } catch (error) {
    next(error);
  }
};

// @desc    Get security score
// @route   GET /api/security/score
exports.getSecurityScore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const checklist = await SecurityChecklist.findOne({ user: req.user._id });

    let score = 0;
    const breakdown = [];

    // Profile completed (+10)
    if (user.name && user.email && user.profileImage) {
      score += 10;
      breakdown.push({ label: 'Profile completed', points: 10, earned: true });
    } else {
      breakdown.push({ label: 'Profile completed', points: 10, earned: false });
    }

    // Strong password (assumed if password set) (+20)
    // We check this implicitly — the user must have a password to be logged in
    const hasStrongPassword = checklist?.items?.find(
      (i) => i.key === 'strong_password'
    )?.completed;
    if (hasStrongPassword) {
      score += 20;
      breakdown.push({ label: 'Strong password', points: 20, earned: true });
    } else {
      breakdown.push({ label: 'Strong password', points: 20, earned: false });
    }

    // MFA enabled (+20)
    const hasMFA = checklist?.items?.find((i) => i.key === 'enable_mfa')?.completed;
    if (hasMFA) {
      score += 20;
      breakdown.push({ label: 'MFA enabled', points: 20, earned: true });
    } else {
      breakdown.push({ label: 'MFA enabled', points: 20, earned: false });
    }

    // Security checklist progress (+20)
    if (checklist) {
      const completedCount = checklist.items.filter((i) => i.completed).length;
      const checklistPercent = completedCount / checklist.items.length;
      const checklistPoints = Math.round(checklistPercent * 20);
      score += checklistPoints;
      breakdown.push({
        label: 'Security checklist',
        points: 20,
        earned: checklistPoints > 0,
        earnedPoints: checklistPoints,
      });
    } else {
      breakdown.push({ label: 'Security checklist', points: 20, earned: false });
    }

    // Recent security review (+10) — check if any incidents resolved in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentResolvedIncidents = await Incident.countDocuments({
      user: req.user._id,
      status: 'Resolved',
      updatedAt: { $gte: thirtyDaysAgo },
    });
    if (recentResolvedIncidents > 0) {
      score += 10;
      breakdown.push({ label: 'Recent security review', points: 10, earned: true });
    } else {
      breakdown.push({ label: 'Recent security review', points: 10, earned: false });
    }

    // No high-risk open incidents (+20)
    const highRiskOpen = await Incident.countDocuments({
      user: req.user._id,
      status: 'Open',
      severity: { $in: ['High', 'Critical'] },
    });
    if (highRiskOpen === 0) {
      score += 20;
      breakdown.push({ label: 'No high-risk open incidents', points: 20, earned: true });
    } else {
      breakdown.push({ label: 'No high-risk open incidents', points: 20, earned: false });
    }

    // Generate recommendations
    const recommendations = breakdown
      .filter((b) => !b.earned)
      .map((b) => `${b.label} (+${b.earnedPoints || b.points} points)`);

    res.json({
      success: true,
      score: Math.min(score, 100),
      maxScore: 100,
      breakdown,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};
