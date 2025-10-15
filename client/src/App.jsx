import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"
import SinglePost from "./pages/SinglePost"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
          <Route path="/posts/:id" element={<SinglePost />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
