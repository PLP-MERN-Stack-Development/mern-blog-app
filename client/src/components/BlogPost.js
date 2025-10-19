import React from 'react';
import Comments from './Comments';

const BlogPost = ({ post, isAuthor, onEdit, onDelete, onImageUpload, currentUser }) => {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className=\"blog-post\" style={{ 
      border: '1px solid #e0e0e0', 
      padding: '25px', 
      margin: '20px 0', 
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        marginTop: 0, 
        color: '#333',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '10px'
      }}>
        {post.title}
      </h2>
      
      <div style={{ 
        color: '#666', 
        fontSize: '14px', 
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>
          By <strong>{post.author?.name || post.authorName || 'Unknown Author'}</strong>
        </span>
        <span>
          {formatDate(post.createdAt || post.date)}
        </span>
      </div>
      
      <p style={{ 
        lineHeight: '1.6', 
        fontSize: '16px',
        color: '#444',
        whiteSpace: 'pre-wrap'
      }}>
        {post.content}
      </p>
      
      {/* Image display */}
      {post.image && (
        <div style={{ margin: '20px 0' }}>
          <img 
            src={\http://localhost:5000/uploads/\\} 
            alt={post.title} 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Action buttons - conditionally rendered for author */}
      {isAuthor && (
        <div className=\"action-buttons\" style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '20px',
          paddingTop: '15px',
          borderTop: '1px solid #f0f0f0'
        }}>
          {/* Image upload button */}
          <label htmlFor={\image-upload-\\} style={{ 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            padding: '10px 16px', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            <input
              type=\"file\"
              id={\image-upload-\\}
              accept=\"image/*\"
              onChange={onImageUpload}
              style={{ display: 'none' }}
            />
            📷 Change Image
          </label>
          
          {/* Edit button */}
          <button 
            onClick={onEdit}
            style={{ 
              backgroundColor: '#2196F3', 
              color: 'white', 
              padding: '10px 16px', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ✏️ Edit Post
          </button>
          
          {/* Delete button */}
          <button 
            onClick={onDelete}
            style={{ 
              backgroundColor: '#f44336', 
              color: 'white', 
              padding: '10px 16px', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
      
      {/* Comments Section */}
      <Comments postId={post._id} currentUser={currentUser} />
    </div>
  );
};

export default BlogPost;
