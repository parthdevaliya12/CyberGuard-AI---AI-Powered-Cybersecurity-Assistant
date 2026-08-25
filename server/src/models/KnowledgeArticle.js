const mongoose = require('mongoose');

const knowledgeArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Phishing',
        'Malware',
        'Password Security',
        'Social Engineering',
        'Account Security',
        'Safe Browsing',
        'Privacy',
      ],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    prevention: {
      type: String,
      default: '',
    },
    recommendedActions: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

knowledgeArticleSchema.index({ category: 1 });
knowledgeArticleSchema.index({ tags: 1 });
knowledgeArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('KnowledgeArticle', knowledgeArticleSchema);
