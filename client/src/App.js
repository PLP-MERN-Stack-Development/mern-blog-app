import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomeSimple from './pages/HomeSimple';
import LoginSimple from './pages/LoginSimple';
import RegisterSimple from './pages/RegisterSimple';
import CreatePostSimple from './pages/CreatePostSimple';
import SinglePostEnhanced from './pages/SinglePostEnhanced';
import EditPostEnhanced from './pages/EditPostEnhanced';
import ProfileEnhanced from './pages/ProfileEnhanced';

import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomeSimple />} />
            <Route path="/login" element={<LoginSimple />} />
            <Route path="/register" element={<RegisterSimple />} />
            <Route path="/post/:id" element={<SinglePostEnhanced />} />
            <Route path="/create" element={<PrivateRoute><CreatePostSimple /></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><EditPostEnhanced /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfileEnhanced /></PrivateRoute>} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;