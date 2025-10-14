import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const CreatePost = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      setError("Title and content are required")
      return
    }

    setLoading(true)
    setError("")

    try {
      await axios.post("/api/posts", formData)
      navigate("/")
    } catch (error) {
      setError(error.response?.data?.message || "Error creating post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Create New Post</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: "#f8d7da", 
          color: "#721c24", 
          padding: "0.75rem", 
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem"
            }}
            placeholder="Enter post title"
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              resize: "vertical"
            }}
            placeholder="Brief description of your post (optional)"
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              resize: "vertical"
            }}
            placeholder="Write your post content here..."
            required
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#27ae60",
              color: "white",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "#95a5a6",
              color: "white",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
