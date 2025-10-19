import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomeSimple = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated, logout, user } = useAuth();

  const categories = ['All', 'Technology', 'Travel', 'Food', 'Lifestyle', 'Health', 'Business', 'Other'];

  useEffect(() => {
    fetchPosts();
  }, [currentPage, category]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
        category: category !== 'All' ? category : undefined
      };
      const response = await postsAPI.getAllPosts(params);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts({ search, page: 1, limit: 9 });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  if (loading && posts.length === 0) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '15px' }}>
        <h1>MERN Blog</h1>
        <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: '#666' }}>Welcome, <strong>{user?.username}</strong></span>
              <Link to="/create" style={{ padding: '8px 16px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Create Post</Link>
              <Link to="/profile" style={{ padding: '8px 16px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Profile</Link>
              <button onClick={logout} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '8px 16px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Login</Link>
              <Link to="/register" style={{ padding: '8px 16px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Register</Link>
            </>
          )}
        </nav>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button type="submit" style={{ padding: '12px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🔍 Search
        </button>
        {search && (
          <button 
            type="button" 
            onClick={() => { setSearch(''); fetchPosts(); }} 
            style={{ padding: '12px 24px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{ 
              padding: '8px 16px', 
              background: category === cat ? '#007bff' : '#f0f0f0', 
              color: category === cat ? 'white' : '#333', 
              border: 'none', 
              borderRadius: '20px', 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2 style={{ marginBottom: '20px' }}>
        {search ? `Search Results for "${search}"` : category !== 'All' ? `${category} Posts` : 'All Posts'}
      </h2>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '8px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>No posts found.</p>
          {isAuthenticated && <Link to="/create" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 24px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Create First Post</Link>}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {posts.map(post => (
              <div key={post._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: 'white', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: '#007bff', color: 'white', borderRadius: '15px', fontSize: '12px', marginBottom: '10px' }}>
                  {post.category}
                </span>
                <h3 style={{ margin: '10px 0', fontSize: '20px' }}>{post.title}</h3>
                <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '15px' }}>{post.content.substring(0, 150)}...</p>
                <div style={{ marginBottom: '15px', fontSize: '14px', color: '#888', display: 'flex', justifyContent: 'space-between', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <img src={post.author?.profilePicture} alt={post.author?.username} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                    <span>{post.author?.username}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span>👁️ {post.views}</span>
                    <span>❤️ {post.likes?.length || 0}</span>
                  </div>
                </div>
                <Link to={`/post/${post._id}`} style={{ display: 'block', padding: '10px', textAlign: 'center', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                  Read More →
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '40px' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: '10px 20px', background: currentPage === 1 ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ padding: '10px 20px', background: currentPage === totalPages ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomeSimple;