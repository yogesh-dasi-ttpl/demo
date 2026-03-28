import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', status: 'draft', tags: '', featuredImage: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then((res) => {
        const p = res.data.data;
        setForm({
          title: p.title,
          content: p.content,
          status: p.status,
          tags: (p.tags || []).join(', '),
          featuredImage: p.featuredImage || '',
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Post not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      if (!payload.featuredImage) delete payload.featuredImage;
      await api.put(`/posts/${id}`, payload);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="form-page">
      <h1>Edit Post</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" value={form.content} onChange={handleChange} required rows={10} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input id="tags" name="tags" value={form.tags} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="featuredImage">Featured Image URL</label>
          <input id="featuredImage" name="featuredImage" value={form.featuredImage} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
          {saving ? 'Saving...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}
