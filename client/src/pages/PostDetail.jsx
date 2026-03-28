import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then((res) => setPost(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Post not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-page"><h2>{error}</h2><Link to="/">Back to Home</Link></div>;
  if (!post) return null;

  const isAuthor = user && (user.id === post.author?._id || user.role === 'admin');

  return (
    <div className="post-detail">
      <article>
        <header className="post-detail-header">
          <div className="post-detail-meta">
            <span className={`badge badge-${post.status}`}>{post.status}</span>
            {post.tags?.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail-info">
            <span>By {post.author?.profile?.name || 'Unknown'}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        {post.featuredImage && (
          <img src={post.featuredImage} alt={post.title} className="post-detail-image" />
        )}

        <div className="post-detail-content">
          {post.content.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {isAuthor && (
          <div className="post-detail-actions">
            <Link to={`/posts/${id}/edit`} className="btn btn-primary">Edit</Link>
            <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          </div>
        )}
      </article>
    </div>
  );
}
