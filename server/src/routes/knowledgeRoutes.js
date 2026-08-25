const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/knowledgeController');

router.get('/', getArticles);
router.get('/:id', getArticleById);

// Admin only
router.post('/', auth, authorize('admin'), createArticle);
router.put('/:id', auth, authorize('admin'), updateArticle);
router.delete('/:id', auth, authorize('admin'), deleteArticle);

module.exports = router;
