const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createConversation,
  getMyConversations,
  getConversation,
  sendMessage,
  deleteConversation,
} = require('../controllers/conversationController');

router.use(auth);

router.post('/', createConversation);
router.get('/', getMyConversations);
router.get('/:id', getConversation);
router.post('/:id/messages', sendMessage);
router.delete('/:id', deleteConversation);

module.exports = router;
