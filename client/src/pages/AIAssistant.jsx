import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import {
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Bot,
  User,
  Loader,
  Sparkles,
  Shield,
  AlertTriangle,
  Search,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    { text: 'Explain phishing', icon: Shield },
    { text: 'How can I protect my account?', icon: Shield },
    { text: 'Is this URL suspicious?', icon: Search },
    { text: 'What should I do after clicking a suspicious link?', icon: AlertTriangle },
    { text: 'How do I create a strong password?', icon: Sparkles },
    { text: 'Show me my incidents', icon: FileText },
  ];

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/conversations');
      setConversations(data.conversations);
    } catch (error) {
      console.error('Failed to fetch conversations');
    }
  };

  const createConversation = async () => {
    try {
      const { data } = await API.post('/conversations', { title: 'New Conversation' });
      setConversations((prev) => [data.conversation, ...prev]);
      setActiveConv(data.conversation);
      setMessages([]);
    } catch (error) {
      toast.error('Failed to create conversation');
    }
  };

  const loadConversation = async (conv) => {
    try {
      setActiveConv(conv);
      const { data } = await API.get(`/conversations/${conv._id}`);
      setMessages(data.messages);
    } catch (error) {
      toast.error('Failed to load conversation');
    }
  };

  const deleteConversation = async (convId, e) => {
    e.stopPropagation();
    try {
      await API.delete(`/conversations/${convId}`);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (activeConv?._id === convId) {
        setActiveConv(null);
        setMessages([]);
      }
      toast.success('Conversation deleted');
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;

    // Create conversation if none active
    let conversation = activeConv;
    if (!conversation) {
      try {
        const { data } = await API.post('/conversations', { title: content.substring(0, 50) });
        conversation = data.conversation;
        setConversations((prev) => [data.conversation, ...prev]);
        setActiveConv(data.conversation);
      } catch {
        toast.error('Failed to start conversation');
        return;
      }
    }

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content, _id: 'temp-' + Date.now() }]);
    setLoading(true);

    try {
      const { data } = await API.post(`/conversations/${conversation._id}/messages`, { content });
      setMessages((prev) => [
        ...prev.filter((m) => !m._id.startsWith('temp-')),
        data.userMessage,
        data.assistantMessage,
      ]);

      // Update conversation title in sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversation._id
            ? { ...c, title: content.length > 50 ? content.substring(0, 50) + '...' : content, updatedAt: new Date() }
            : c
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
      setMessages((prev) => prev.filter((m) => !m._id.startsWith('temp-')));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getToolStatusMessage = (toolCalls) => {
    if (!toolCalls) return null;
    return toolCalls.map((tc) => {
      const labels = {
        search_knowledge: '📚 Searched knowledge base',
        url_risk_analyzer: '🔍 Analyzed URL for risks',
        create_incident: '📋 Created incident report',
        get_my_incidents: '📂 Retrieved your incidents',
      };
      return labels[tc.tool] || `Used tool: ${tc.tool}`;
    });
  };

  return (
    <div className="ai-assistant-page">
      {/* Conversations Sidebar */}
      <div className={`chat-sidebar ${sidebarOpen ? '' : 'chat-sidebar-hidden'}`}>
        <div className="chat-sidebar-header">
          <h3>Conversations</h3>
          <button className="btn btn-sm btn-primary" onClick={createConversation}>
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className="chat-sidebar-list">
          {conversations.length === 0 ? (
            <div className="chat-sidebar-empty">
              <MessageSquare size={24} />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={`chat-sidebar-item ${activeConv?._id === conv._id ? 'active' : ''}`}
                onClick={() => loadConversation(conv)}
              >
                <MessageSquare size={16} />
                <span className="chat-sidebar-item-title">{conv.title}</span>
                <button
                  className="chat-sidebar-delete"
                  onClick={(e) => deleteConversation(conv._id, e)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-main">
        <div className="chat-header">
          <button
            className="chat-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MessageSquare size={20} />
          </button>
          <div className="chat-header-info">
            <Bot size={22} />
            <div>
              <h3>CyberGuard AI</h3>
              <span className="chat-header-status">
                {loading ? 'Thinking...' : 'Online'}
              </span>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && !loading ? (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">
                <Shield size={48} />
              </div>
              <h2>CyberGuard AI Assistant</h2>
              <p>Your AI-powered cybersecurity companion. Ask me anything about staying safe online.</p>
              <div className="suggested-prompts">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    className="suggested-prompt"
                    onClick={() => sendMessage(prompt.text)}
                  >
                    <prompt.icon size={16} />
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg._id} className={`chat-message ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className="message-content">
                    {msg.toolCalls && (
                      <div className="tool-status">
                        {getToolStatusMessage(msg.toolCalls)?.map((status, i) => (
                          <span key={i} className="tool-status-item">{status}</span>
                        ))}
                      </div>
                    )}
                    <div className="message-text" dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                        .replace(/`(.*?)`/g, '<code>$1</code>')
                        .replace(/^### (.*?)$/gm, '<h4>$1</h4>')
                        .replace(/^## (.*?)$/gm, '<h3>$1</h3>')
                        .replace(/^# (.*?)$/gm, '<h2>$1</h2>')
                    }} />
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-message assistant">
                  <div className="message-avatar"><Bot size={18} /></div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask CyberGuard AI anything about cybersecurity..."
              rows={1}
              disabled={loading}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              {loading ? <Loader size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="chat-disclaimer">
            CyberGuard AI provides educational cybersecurity advice. Always verify critical security decisions with professionals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
