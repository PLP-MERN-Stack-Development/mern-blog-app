import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CommentThread from "../components/CommentThread";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
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
        setPost(data.data);
      } else {
        setError("Post not found");
      }
    } catch (error) {
      setError("Error fetching post");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      alert("Delete functionality will be implemented with database integration");
    }
  };

  // Function to safely render HTML content
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link to="/" className="btn btn-secondary">
          ← Back to Posts
        </Link>
      </div>

      <article className="post-card">
        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: "0 0 1rem 0", fontSize: "2.5rem", color: "#2c3e50" }}>
            {post.title}
          </h1>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#7f8c8d",
            fontSize: "0.9rem",
            borderBottom: "1px solid #ecf0f1",
            paddingBottom: "1rem"
          }}>
            <span>By {post.author}</span>
            <span>Posted on {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        <div 
          className="post-content-rich" 
          dangerouslySetInnerHTML={createMarkup(post.content)}
        />

        <footer style={{
          marginTop: "2rem",
          paddingTop: "1rem",
          borderTop: "1px solid #ecf0f1",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
            Last updated: {new Date(post.createdAt).toLocaleDateString()}
          </div>
          {currentUser && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link 
                to={`/posts/${post._id}/edit`}
                className="btn btn-primary"
              >
                Edit Post
              </Link>
              <button onClick={deletePost} className="btn btn-danger">
                Delete Post
              </button>
            </div>
          )}
        </footer>
      </article>

      {/* Comments Section */}
      <CommentThread postId={post._id} />
    </div>
  );
};

export default SinglePost;
