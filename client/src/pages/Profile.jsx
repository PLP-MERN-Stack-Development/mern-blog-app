import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const isOwnProfile = currentUser && currentUser.id === id;

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const userResponse = await fetch("http://localhost:5000/api/users/" + id);
      const userData = await userResponse.json();
      
      if (userData.success) {
        setUser(userData.data);
        
        // Fetch user posts
        const postsResponse = await fetch("http://localhost:5000/api/users/" + id + "/posts");
        const postsData = await postsResponse.json();
        
        if (postsData.success) {
          setUserPosts(postsData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!user) return <div className="error-message">User not found</div>;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-joined">
            Joined {new Date(user.joinedDate).toLocaleDateString()}
          </p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{user.postsCount}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat">
              <span className="stat-number">{user.commentsCount}</span>
              <span className="stat-label">Comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button 
          className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts ({userPosts.length})
        </button>
        {isOwnProfile && (
          <button 
            className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "profile" && (
          <div className="profile-content">
            <h2>About</h2>
            <p>This is {isOwnProfile ? "your" : user.username + "'s"} profile page.</p>
            {isOwnProfile && (
              <div className="profile-actions">
                <button className="btn btn-primary">Edit Profile</button>
              </div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="posts-content">
            <h2>Recent Posts</h2>
            {userPosts.length === 0 ? (
              <div className="empty-state">
                <p>No posts yet.</p>
                {isOwnProfile && (
                  <Link to="/create-post" className="btn btn-primary">
                    Create Your First Post
                  </Link>
                )}
              </div>
            ) : (
              userPosts.map((post) => (
                <div key={post._id} className="post-card">
                  <h3 className="post-title">
                    <Link to={`/posts/${post._id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <div className="post-meta">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="post-content">
                    {post.content.length > 150 ? post.content.substring(0, 150) + "..." : post.content}
                  </p>
                  <Link to={`/posts/${post._id}`} className="btn btn-secondary">
                    Read More
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "settings" && isOwnProfile && (
          <div className="settings-content">
            <h2>Account Settings</h2>
            <div className="settings-section">
              <h3>Profile Information</h3>
              <p>Update your username, email, and other profile details.</p>
              <button className="btn btn-primary">Edit Profile</button>
            </div>
            <div className="settings-section">
              <h3>Security</h3>
              <p>Change your password and manage account security.</p>
              <button className="btn btn-secondary">Change Password</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
