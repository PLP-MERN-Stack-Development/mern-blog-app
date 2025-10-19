import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import { toast } from 'react-toastify';

const ProfileEnhanced = () => {
  const { user, updateProfile } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || ''
  });

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts({ author: user.id });
      setUserPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <img 
              src={user.profilePicture} 
              alt={user.username}
              style={{ width: '100px', height: '100px', borderRadius: '50%', border: '3px solid #007bff' }}
            />
            <div>
              <h1 style={{ margin: '0 0 10px 0' }}>{user.username}</h1>
              <p style={{ margin: '0', color: '#666' }}>{user.email}</p>
              <p style={{ margin: '10px 0 0 0', color: '#666' }}>{user.bio || 'No bio yet'}</p>
              <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setEditing(!editing)} 
            style={{ padding: '10px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                placeholder="Tell us about yourself..."
                style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Profile Picture URL</label>
              <input
                type="url"
                value={formData.profilePicture}
                onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                placeholder="https://example.com/image.jpg"
                style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <button type="submit" style={{ padding: '10px 24px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Save Changes
            </button>
          </form>
        )}
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Your Posts ({userPosts.length})</h2>

        {loading ? (
          <p>Loading posts...</p>
        ) : userPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>You haven't created any posts yet.</p>
            <Link to="/create" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 24px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {userPosts.map(post => (
              <div key={post._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#fafafa' }}>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: '#007bff', color: 'white', borderRadius: '15px', fontSize: '12px', marginBottom: '10px' }}>
                  {post.category}
                </span>
                <h3 style={{ margin: '10px 0' }}>{post.title}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>{post.content.substring(0, 100)}...</p>
                <div style={{ marginTop: '15px', fontSize: '14px', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                  <span>👁️ {post.views}</span>
                  <span>❤️ {post.likes?.length || 0}</span>
                </div>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <Link to={`/post/${post._id}`} style={{ flex: 1, padding: '8px', textAlign: 'center', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}>
                    View
                  </Link>
                  <Link to={`/edit/${post._id}`} style={{ flex: 1, padding: '8px', textAlign: 'center', background: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}>
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEnhanced;