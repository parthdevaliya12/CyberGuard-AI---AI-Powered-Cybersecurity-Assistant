import { useState, useEffect } from 'react';
import API from '../api/axios';
import { BookOpen, Search, Tag, ChevronDown, ChevronUp, Shield } from 'lucide-react';

const SecurityKnowledge = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['Phishing', 'Malware', 'Password Security', 'Social Engineering', 'Account Security', 'Safe Browsing', 'Privacy'];

  useEffect(() => { fetchArticles(); }, [category, search]);

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const { data } = await API.get(`/knowledge?${params}`);
      setArticles(data.articles);
    } catch (error) {
      console.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    Phishing: '#ef4444', Malware: '#f97316', 'Password Security': '#8b5cf6',
    'Social Engineering': '#ec4899', 'Account Security': '#06b6d4',
    'Safe Browsing': '#22c55e', Privacy: '#6366f1',
  };

  return (
    <div className="knowledge-page">
      <div className="page-header">
        <div>
          <h1>Security Knowledge Base</h1>
          <p className="page-subtitle">Learn about cybersecurity threats and how to protect yourself</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="page-loading"><p>Loading articles...</p></div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No articles found</h3>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div className="knowledge-grid">
          {articles.map((article) => (
            <div key={article._id} className="knowledge-card" onClick={() => setExpanded(expanded === article._id ? null : article._id)}>
              <div className="knowledge-card-header">
                <span className="knowledge-category-badge" style={{ background: categoryColors[article.category] || '#6366f1' }}>
                  {article.category}
                </span>
                <h3>{article.title}</h3>
                {expanded === article._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {expanded === article._id && (
                <div className="knowledge-card-body">
                  <p>{article.content}</p>

                  {article.prevention && (
                    <div className="knowledge-section">
                      <h4><Shield size={16} /> Prevention</h4>
                      <p>{article.prevention}</p>
                    </div>
                  )}

                  {article.recommendedActions?.length > 0 && (
                    <div className="knowledge-section">
                      <h4>Recommended Actions</h4>
                      <ul>
                        {article.recommendedActions.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {article.tags?.length > 0 && (
                    <div className="knowledge-tags">
                      {article.tags.map((tag, i) => (
                        <span key={i} className="knowledge-tag"><Tag size={12} /> {tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecurityKnowledge;
