import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPosts(filtered)
  }, [searchTerm, posts])

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/posts")
      setPosts(response.data.data)
      setFilteredPosts(response.data.data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/api/posts/${id}`)
        fetchPosts()
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  if (loading) return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <div>Loading posts...</div>
    </div>
  )

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <h1 style={{ margin: 0 }}>Blog Posts</h1>
        <Link 
          to="/create-post" 
          style={{
            backgroundColor: "#3498db",
            color: "white",
            padding: "0.75rem 1.5rem",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            whiteSpace: "nowrap"
          }}
        >
          Create New Post
        </Link>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Search posts by title, content, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem",
            maxWidth: "500px"
          }}
        />
        <div style={{ color: "#7f8c8d", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          {filteredPosts.length} of {posts.length} posts found
        </div>
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {filteredPosts.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem", 
            color: "#7f8c8d",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #ddd"
          }}>
            <h3>No posts found</h3>
            <p>
              {searchTerm ? "Try adjusting your search terms" : "No posts available. Create the first post!"}
            </p>
            {!searchTerm && (
              <Link 
                to="/create-post" 
                style={{
                  backgroundColor: "#3498db",
                  color: "white",
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                  borderRadius: "4px",
                  display: "inline-block",
                  marginTop: "1rem"
                }}
              >
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              key={post._id} 
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem" }}>
                <Link 
                  to={`/posts/${post._id}`}
                  style={{ 
                    color: "#2c3e50", 
                    textDecoration: "none",
                    display: "block"
                  }}
                >
                  {post.title}
                </Link>
              </h3>
              
              {post.excerpt && (
                <p style={{ 
                  color: "#666", 
                  margin: "0 0 1rem 0",
                  fontSize: "1.1rem",
                  lineHeight: "1.4"
                }}>
                  {post.excerpt}
                </p>
              )}
              
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                fontSize: "0.9rem",
                color: "#7f8c8d"
              }}>
                <div>
                  <span style={{ fontWeight: "bold" }}>By {post.author}</span>
                  <span style={{ margin: "0 0.5rem" }}>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Link 
                    to={`/posts/${post._id}`}
                    style={{ 
                      color: "#3498db", 
                      textDecoration: "none",
                      fontWeight: "bold"
                    }}
                  >
                    Read More
                  </Link>
                  <Link 
                    to={`/posts/${post._id}/edit`}
                    style={{ 
                      color: "#27ae60", 
                      textDecoration: "none" 
                    }}
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deletePost(post._id)}
                    style={{ 
                      color: "#e74c3c", 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Home
