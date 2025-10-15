import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"

const SinglePost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`)
      setPost(response.data.data)
    } catch (error) {
      setError("Post not found")
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/api/posts/${id}`)
        navigate("/")
      } catch (error) {
        setError("Error deleting post")
      }
    }
  }

  if (loading) return <div>Loading post...</div>
  if (error) return <div>{error}</div>
  if (!post) return <div>Post not found</div>

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link 
          to="/"
          style={{ 
            color: "#3498db", 
            textDecoration: "none",
            marginBottom: "1rem",
            display: "inline-block"
          }}
        >
          ← Back to Posts
        </Link>
      </div>

      <article style={{ 
        backgroundColor: "white", 
        padding: "2rem", 
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{ 
            margin: "0 0 1rem 0", 
            fontSize: "2.5rem",
            color: "#2c3e50"
          }}>
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

        <div style={{ 
          lineHeight: "1.6",
          fontSize: "1.1rem",
          color: "#34495e"
        }}>
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: "1rem" }}>
              {paragraph}
            </p>
          ))}
        </div>

        <footer style={{ 
          marginTop: "2rem",
          paddingTop: "1rem",
          borderTop: "1px solid #ecf0f1",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
            Last updated: {new Date(post.updatedAt).toLocaleDateString()}
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              to={`/posts/${post._id}/edit`}
              style={{
                backgroundColor: "#3498db",
                color: "white",
                padding: "0.5rem 1rem",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "0.9rem"
              }}
            >
              Edit Post
            </Link>
            <button
              onClick={deletePost}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              Delete Post
            </button>
          </div>
        </footer>
      </article>
    </div>
  )
}

export default SinglePost
