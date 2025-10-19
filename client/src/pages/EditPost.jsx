import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RichTextEditor from "../components/RichTextEditor";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/posts/" + id);
      const data = await response.json();
      if (data.success) {
        setTitle(data.data.title);
        setContent(data.data.content);
      } else {
        setError("Post not found");
      }
    } catch (error) {
      setError("Error fetching post");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || content === "<p><br></p>") {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // For now, we'll just show a success message since we're using in-memory storage
      // In a real app, you'd make a PUT request to update the post
      alert("Post updated successfully! (Edit functionality will be fully implemented with database)");
      navigate("/posts/" + id);
    } catch (error) {
      setError("Error updating post");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Access Denied</h2>
          <p>Please log in to edit posts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "800px" }}>
        <h2 className="auth-title">Edit Post</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your post content here..."
            />
          </div>
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading}
              className="auth-button"
            >
              {loading ? "Updating Post..." : "Update Post"}
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/posts/" + id)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
