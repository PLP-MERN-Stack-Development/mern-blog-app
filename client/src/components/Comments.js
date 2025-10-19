import React, { useState, useEffect } from 'react';

const Comments = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(\\/comments/post/\\);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(\\/comments\, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \Bearer \\
        },
        body: JSON.stringify({
          content: newComment,
          postId: postId
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
      } else {
        alert('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (parentCommentId) => {
    if (!replyContent.trim() || !currentUser) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(\\/comments\, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \Bearer \\
        },
        body: JSON.stringify({
          content: replyContent,
          postId: postId,
          parentCommentId: parentCommentId
        }),
      });

      if (response.ok) {
        const reply = await response.json();
        setComments([reply, ...comments]);
        setReplyContent('');
        setReplyingTo(null);
      } else {
        alert('Failed to post reply');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Error posting reply');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(\\/comments/\\, {
        method: 'DELETE',
        headers: {
          'Authorization': \Bearer \\
        },
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment._id !== commentId));
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ marginTop: '30px', borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>💬 Comments ({comments.length})</h3>
      
      {/* Add Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} style={{ marginBottom: '30px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows="3"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical',
              fontSize: '14px',
              marginBottom: '10px'
            }}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            style={{
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p style={{ 
          padding: '15px', 
          background: '#f5f5f5', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          Please <a href="#login" style={{ color: '#2196F3' }}>login</a> to post comments.
        </p>
      )}

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <p style={{ 
            textAlign: 'center', 
            color: '#666', 
            fontStyle: 'italic',
            padding: '20px'
          }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} style={{ 
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              background: '#fafafa'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <div>
                  <strong style={{ color: '#333' }}>
                    {comment.author?.name || 'Unknown User'}
                  </strong>
                  <span style={{ 
                    color: '#666', 
                    fontSize: '12px',
                    marginLeft: '10px'
                  }}>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                
                {currentUser && currentUser._id === comment.author?._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f44336',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
              
              <p style={{ 
                margin: '0 0 10px 0',
                lineHeight: '1.5',
                color: '#333'
              }}>
                {comment.content}
              </p>
              
              {currentUser && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2196F3',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: 0
                  }}
                >
                  {replyingTo === comment._id ? 'Cancel' : 'Reply'}
                </button>
              )}
              
              {/* Reply Form */}
              {replyingTo === comment._id && currentUser && (
                <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      resize: 'vertical',
                      fontSize: '14px',
                      marginBottom: '5px'
                    }}
                  />
                  <div>
                    <button
                      onClick={() => handleSubmitReply(comment._id)}
                      disabled={loading || !replyContent.trim()}
                      style={{
                        backgroundColor: loading ? '#ccc' : '#2196F3',
                        color: 'white',
                        padding: '4px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        marginRight: '5px'
                      }}
                    >
                      Post Reply
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid #ddd',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
