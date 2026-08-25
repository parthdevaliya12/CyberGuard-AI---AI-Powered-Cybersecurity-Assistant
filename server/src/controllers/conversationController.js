const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ErrorResponse = require('../utils/errorResponse');
const { processMessage } = require('../services/agent/agentService');

// @desc    Create a new conversation
// @route   POST /api/conversations
exports.createConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.create({
      user: req.user._id,
      title: req.body.title || 'New Conversation',
    });

    res.status(201).json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's conversations
// @route   GET /api/conversations
exports.getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id })
      .sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single conversation with messages
// @route   GET /api/conversations/:id
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return next(new ErrorResponse('Conversation not found', 404));
    }

    if (conversation.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized', 403));
    }

    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: 1 });

    res.json({ success: true, conversation, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message in conversation
// @route   POST /api/conversations/:id/messages
exports.sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return next(new ErrorResponse('Message content is required', 400));
    }

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return next(new ErrorResponse('Conversation not found', 404));
    }

    if (conversation.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized', 403));
    }

    // Save user message
    const userMessage = await Message.create({
      conversation: conversation._id,
      role: 'user',
      content,
    });

    // Get conversation history for context
    const history = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .limit(20);

    // Process with AI agent
    const aiResponse = await processMessage(content, history, req.user._id);

    // Save AI response
    const assistantMessage = await Message.create({
      conversation: conversation._id,
      role: 'assistant',
      content: aiResponse.content,
      toolCalls: aiResponse.toolCalls || null,
    });

    // Update conversation title from first message
    if (history.length <= 1) {
      const title = content.length > 50 ? content.substring(0, 50) + '...' : content;
      await Conversation.findByIdAndUpdate(conversation._id, { title });
    }

    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversation._id, { updatedAt: new Date() });

    res.json({
      success: true,
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete conversation
// @route   DELETE /api/conversations/:id
exports.deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return next(new ErrorResponse('Conversation not found', 404));
    }

    if (conversation.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized', 403));
    }

    // Delete all messages in conversation
    await Message.deleteMany({ conversation: conversation._id });
    await Conversation.findByIdAndDelete(conversation._id);

    res.json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    next(error);
  }
};
