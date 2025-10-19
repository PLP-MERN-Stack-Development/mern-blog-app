import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RichTextEditor from "../components/RichTextEditor";
import SimpleTextEditor from "../components/SimpleTextEditor";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useSimpleEditor, setUseSimpleEditor] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      const data = await response.json();
      if (data.success) {
        navigate("/posts/" + data.data._id);
      } else {
        setError("Error creating post");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Access Denied</h2>
          <p>Please log in to create posts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "800px" }}>
        <h2 className="auth-title">Create New Post</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button 
            type="button"
            onClick={() => setUseSimpleEditor(!useSimpleEditor)}
            className="btn btn-secondary"
          >
            {useSimpleEditor ? "Switch to Rich Editor" : "Switch to Simple Editor"}
          </button>
        </div>

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
            {useSimpleEditor ? (
              <SimpleTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your post content here..."
              />
            ) : (
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your post content here..."
              />
            )}
          </div>
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading}
              className="auth-button"
            >
              {loading ? "Creating Post..." : "Create Post"}
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/")}
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

export default CreatePost;
