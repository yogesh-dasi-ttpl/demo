import { useState, useEffect } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('published');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9, sort: '-createdAt' };
    if (statusFilter) params.status = statusFilter;
    if (search) params.search = search;

    api.get('/posts', { params })
      .then((res) => {
        setPosts(res.data.data.posts || res.data.data);
        const pagination = res.data.data.pagination;
        if (pagination) setTotalPages(pagination.totalPages);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [page, statusFilter, search]);

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Blog Posts</h1>
        <div className="home-filters">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="empty">No posts found.</div>
      ) : (
        <>
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-outline"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-outline"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
