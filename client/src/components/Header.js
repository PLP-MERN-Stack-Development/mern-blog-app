import React from 'react';

const Header = ({ currentUser, onLogout, onShowAuth }) => {
  return (
    <header style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>📝 MERN Blog</h1>
          {currentUser && (
            <span style={{
              fontSize: '0.9rem',
              opacity: 0.8
            }}>
              Welcome, {currentUser.name}!
            </span>
          )}
        </div>
        
        <nav>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '0.9rem' }}>
                👋 Hello, {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onShowAuth}
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Login / Register
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
