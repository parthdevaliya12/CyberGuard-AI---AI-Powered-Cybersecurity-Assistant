const KnowledgeArticle = require('../models/KnowledgeArticle');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all articles
// @route   GET /api/knowledge
exports.getArticles = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const articles = await KnowledgeArticle.find(query).sort({ createdAt: -1 });

    res.json({ success: true, articles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article
// @route   GET /api/knowledge/:id
exports.getArticleById = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findById(req.params.id);
    if (!article) {
      return next(new ErrorResponse('Article not found', 404));
    }
    res.json({ success: true, article });
  } catch (error) {
    next(error);
  }
};

// @desc    Create article (admin)
// @route   POST /api/knowledge
exports.createArticle = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.create(req.body);
    res.status(201).json({ success: true, article });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article (admin)
// @route   PUT /api/knowledge/:id
exports.updateArticle = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) {
      return next(new ErrorResponse('Article not found', 404));
    }
    res.json({ success: true, article });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article (admin)
// @route   DELETE /api/knowledge/:id
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findById(req.params.id);
    if (!article) {
      return next(new ErrorResponse('Article not found', 404));
    }
    await KnowledgeArticle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    next(error);
  }
};
