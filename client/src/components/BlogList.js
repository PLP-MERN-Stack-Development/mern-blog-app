import React, { useState, useEffect } from 'react';
import BlogPost from './BlogPost';
import CreatePost from './CreatePost';
import SearchBar from './SearchBar';
import './../styles/BlogPost.css';

const BlogList = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
      setError('');
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      (post.author?.name && post.author.name.toLowerCase().includes(query))
    );
    setFilteredPosts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowCreateForm(false);
  };

  const handleImageUpload = async (postId, file) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(\\/posts/\/image\, {
        method: 'POST',
        headers: {
          'Authorization': \Bearer \\
        },
        body: formData,
      });
      
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(post => 
          post._id === postId ? updatedPost : post
        ));
        alert('Image uploaded successfully!');
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const handleEdit = (postId) => {
    const postToEdit = posts.find(post => post._id === postId);
    const newTitle = prompt('Enter new title:', postToEdit.title);
    const newContent = prompt('Enter new content:', postToEdit.content);
    
    if (newTitle && newContent) {
      updatePost(postId, { title: newTitle, content: newContent });
    }
  };

  const updatePost = async (postId, updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(\\/posts/\\, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \Bearer \\
        },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(post => 
          post._id === postId ? updatedPost : post
        ));
        alert('Post updated successfully!');
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post. Please try again.');
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(\\/posts/\\, {
          method: 'DELETE',
          headers: {
            'Authorization': \Bearer \\
          },
        });
        
        if (response.ok) {
          setPosts(posts.filter(post => post._id !== postId));
          alert('Post deleted successfully!');
        } else {
          throw new Error('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        <div>Loading posts...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>📝 MERN Blog</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        A full-stack blog application
      </p>
      
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

      {/* Search Bar */}
      <SearchBar 
        onSearch={handleSearch}
        placeholder=\"Search posts by title, content, or author...\"
      />

      {/* Create Post Button - Only show if user is logged in */}
      {currentUser && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              backgroundColor: showCreateForm ? '#666' : '#4CAF50',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {showCreateForm ? '✕ Cancel' : '✏️ Create New Post'}
          </button>
        </div>
      )}

      {/* Create Post Form */}
      {showCreateForm && currentUser && (
        <CreatePost 
          onPostCreated={handlePostCreated} 
          currentUser={currentUser}
          API_URL={API_URL}
        />
      )}

      {/* Search Results Info */}
      {searchQuery && (
        <div style={{ 
          marginBottom: '20px',
          padding: '10px',
          background: '#e3f2fd',
          borderRadius: '4px',
          border: '1px solid #bbdefb'
        }}>
          Showing {filteredPosts.length} results for \"{searchQuery}\"
        </div>
      )}

      {/* Posts List */}
      <div>
        {filteredPosts.length === 0 && !loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: '#666',
            background: '#f9f9f9',
            borderRadius: '8px',
            border: '2px dashed #ddd'
          }}>
            <h3>
              {searchQuery ? 'No posts found' : 'No posts yet'}
            </h3>
            <p>
              {searchQuery 
                ? 'Try different search terms'
                : currentUser 
                  ? 'Be the first to create a post!'
                  : 'No posts available. Login to create the first post!'
              }
            </p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <BlogPost
              key={post._id}
              post={post}
              currentUser={currentUser}
              isAuthor={currentUser && currentUser._id === post.author?._id}
              onEdit={() => handleEdit(post._id)}
              onDelete={() => handleDelete(post._id)}
              onImageUpload={(e) => handleImageUpload(post._id, e.target.files[0])}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;
