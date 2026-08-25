const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Phishing',
        'Suspicious URL',
        'Malware',
        'Account Security',
        'Social Engineering',
        'Data Privacy',
        'Other',
      ],
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'Under Review', 'Resolved', 'Closed'],
      default: 'Open',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for frequent queries
incidentSchema.index({ user: 1, status: 1 });
incidentSchema.index({ category: 1 });
incidentSchema.index({ severity: 1 });
incidentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Incident', incidentSchema);
