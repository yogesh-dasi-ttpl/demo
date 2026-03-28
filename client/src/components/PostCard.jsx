import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      {post.featuredImage && (
        <img src={post.featuredImage} alt={post.title} className="post-card-image" />
      )}
      <div className="post-card-body">
        <div className="post-card-meta">
          <span className={`badge badge-${post.status}`}>{post.status}</span>
          {post.tags?.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <h2 className="post-card-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>
        <p className="post-card-excerpt">
          {post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content}
        </p>
        <div className="post-card-footer">
          <span className="post-card-author">
            {post.author?.profile?.name || 'Unknown'}
          </span>
          <span className="post-card-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </article>
  );
}
