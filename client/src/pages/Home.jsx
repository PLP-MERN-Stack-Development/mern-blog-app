import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/posts");
      const data = await response.json();
      setPosts(data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to strip HTML tags for preview
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Function to create safe HTML preview
  const createPreview = (htmlContent, maxLength = 150) => {
    const stripped = stripHtml(htmlContent);
    return stripped.length > maxLength ? stripped.substring(0, maxLength) + "..." : stripped;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="home-header">
        <h1>Latest Posts</h1>
        {currentUser && (
          <Link to="/create-post" className="btn btn-primary">
            Create New Post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="post-card">
          <h2>No posts yet</h2>
          <p>Be the first to create a post!</p>
          {currentUser ? (
            <Link to="/create-post" className="btn btn-primary">
              Create First Post
            </Link>
          ) : (
            <p>Please log in to create posts</p>
          )}
        </div>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            <h2 className="post-title">
              <Link to={`/posts/${post._id}`}>
                {post.title}
              </Link>
            </h2>
            <div className="post-meta">
              <span>By {post.author}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="post-content">
              {createPreview(post.content)}
            </p>
            <Link to={`/posts/${post._id}`} className="btn btn-secondary">
              Read More
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
