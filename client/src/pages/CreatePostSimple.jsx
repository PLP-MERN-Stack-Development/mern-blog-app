import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CreatePostSimple = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Other',
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await postsAPI.createPost({ ...formData, tags: tagsArray }, token);
      toast.success('Post created!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '15px', fontSize: '16px' }}
        />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows="10"
          style={{ width: '100%', padding: '10px', marginBottom: '15px', fontSize: '16px' }}
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', fontSize: '16px' }}
        >
          <option>Technology</option>
          <option>Travel</option>
          <option>Food</option>
          <option>Lifestyle</option>
          <option>Health</option>
          <option>Other</option>
        </select>
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '12px 30px', fontSize: '16px', cursor: 'pointer' }}>
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostSimple;