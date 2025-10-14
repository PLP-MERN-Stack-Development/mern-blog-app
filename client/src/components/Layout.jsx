import React from "react"
import { Link } from "react-router-dom"

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ 
        backgroundColor: "#2c3e50", 
        color: "white", 
        padding: "1rem 2rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1.5rem", fontWeight: "bold" }}>
            MERN Blog
          </Link>
          <nav>
            <Link to="/" style={{ color: "white", textDecoration: "none", margin: "0 1rem" }}>
              Home
            </Link>
            <Link to="/create-post" style={{ color: "white", textDecoration: "none", margin: "0 1rem" }}>
              Create Post
            </Link>
          </nav>
        </div>
      </header>
      
      <main style={{ flex: 1, padding: "2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </div>
      </main>
      
      <footer style={{ 
        backgroundColor: "#34495e", 
        color: "white", 
        textAlign: "center", 
        padding: "1rem",
        marginTop: "auto"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p>&copy; 2024 MERN Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
