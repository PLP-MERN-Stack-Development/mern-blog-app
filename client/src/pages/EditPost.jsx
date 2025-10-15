import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const EditPost = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: ""
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`)
      setFormData({
        title: response.data.data.title,
        content: response.data.data.content,
        excerpt: response.data.data.excerpt || ""
      })
    } catch (error) {
      setError("Post not found")
    } finally {
      setFetchLoading(false)
    }
  }

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
      await axios.put(`/api/posts/${id}`, formData)
      navigate("/")
    } catch (error) {
      setError(error.response?.data?.message || "Error updating post")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <div>Loading post...</div>
  if (error && !formData.title) return <div>{error}</div>

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Edit Post</h1>
      
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
            required
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#3498db",
              color: "white",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Updating..." : "Update Post"}
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

export default EditPost
