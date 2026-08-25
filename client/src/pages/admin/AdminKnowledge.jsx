import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { BookOpen, Plus, Edit3, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminKnowledge = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', category: 'Phishing', content: '', prevention: '', recommendedActions: '', tags: '',
  });

  const categories = ['Phishing', 'Malware', 'Password Security', 'Social Engineering', 'Account Security', 'Safe Browsing', 'Privacy'];

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    try {
      const { data } = await API.get('/knowledge');
      setArticles(data.articles);
    } catch (error) {
      console.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', category: 'Phishing', content: '', prevention: '', recommendedActions: '', tags: '' });
    setShowModal(true);
  };

  const openEdit = (article) => {
    setEditing(article._id);
    setForm({
      title: article.title,
      category: article.category,
      content: article.content,
      prevention: article.prevention || '',
      recommendedActions: article.recommendedActions?.join(', ') || '',
      tags: article.tags?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      recommendedActions: form.recommendedActions.split(',').map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await API.put(`/knowledge/${editing}`, payload);
        toast.success('Article updated');
      } else {
        await API.post('/knowledge', payload);
        toast.success('Article created');
      }
      setShowModal(false);
      fetchArticles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save article');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await API.delete(`/knowledge/${id}`);
      toast.success('Article deleted');
      fetchArticles();
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  if (loading) return <div className="page-loading"><p>Loading...</p></div>;

  return (
    <div className="admin-knowledge-page">
      <div className="page-header">
        <div>
          <h1>Manage Knowledge Base</h1>
          <p className="page-subtitle">{articles.length} articles</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Article
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td className="table-title">{article.title}</td>
                <td>{article.category}</td>
                <td>{article.tags?.join(', ')}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(article)}>
                      <Edit3 size={14} />
                    </button>
                    <button className="btn btn-sm btn-danger-icon" onClick={() => handleDelete(article._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Article' : 'Add Article'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} required />
              </div>
              <div className="form-group">
                <label>Prevention Tips</label>
                <textarea value={form.prevention} onChange={(e) => setForm({ ...form, prevention: e.target.value })} rows={3} />
              </div>
              <div className="form-group">
                <label>Recommended Actions (comma-separated)</label>
                <input type="text" value={form.recommendedActions} onChange={(e) => setForm({ ...form, recommendedActions: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKnowledge;
