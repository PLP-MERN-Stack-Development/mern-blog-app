import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data storage (temporary, until we set up MongoDB)
let posts = [
  {
    _id: "1",
    title: "Welcome to MERN Blog",
    content: "This is your first blog post. Start writing!",
    author: "System",
    createdAt: new Date().toISOString()
  }
];

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: "MERN Blog API is running!",
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy (MongoDB not connected)",
    timestamp: new Date().toISOString()
  });
});

// Get all posts
app.get("/api/posts", (req, res) => {
  res.json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// Create new post
app.post("/api/posts", (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Please provide title and content"
    });
  }
  
  const newPost = {
    _id: (posts.length + 1).toString(),
    title,
    content,
    author: "Anonymous",
    createdAt: new Date().toISOString()
  };
  
  posts.push(newPost);
  
  res.status(201).json({
    success: true,
    data: newPost
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
  console.log("📡 API available at http://localhost:" + PORT);
  console.log("💡 Using in-memory storage (MongoDB not connected)");
});
