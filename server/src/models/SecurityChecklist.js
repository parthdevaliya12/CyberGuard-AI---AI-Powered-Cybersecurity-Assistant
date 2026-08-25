const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const securityChecklistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: {
      type: [checklistItemSchema],
      default: () => [
        { key: 'strong_password', label: 'Use a strong password', completed: false },
        { key: 'enable_mfa', label: 'Enable Multi-Factor Authentication', completed: false },
        { key: 'update_os', label: 'Update operating system', completed: false },
        { key: 'update_browser', label: 'Update browser', completed: false },
        { key: 'review_sessions', label: 'Review active sessions', completed: false },
        { key: 'check_recovery_email', label: 'Check recovery email', completed: false },
        { key: 'enable_device_lock', label: 'Enable device lock', completed: false },
        { key: 'backup_files', label: 'Backup important files', completed: false },
      ],
    },
  },
  {
    timestamps: true,
  }
);

securityChecklistSchema.index({ user: 1 });

module.exports = mongoose.model('SecurityChecklist', securityChecklistSchema);
