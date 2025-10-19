import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Comment = ({ comment, onReply, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { currentUser } = useAuth();

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    await onReply(comment._id, replyContent);
    setReplyContent("");
    setIsReplying(false);
  };

  const maxDepth = 5;
  const canReply = depth < maxDepth && currentUser;

  return (
    <div className="comment" style={{ marginLeft: depth * 20 + "px" }}>
      <div className="comment-header">
        <strong>{comment.author}</strong>
        <span className="comment-date">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <div className="comment-content">
        {comment.content}
      </div>
      
      {canReply && (
        <div className="comment-actions">
          <button 
            onClick={() => setIsReplying(!isReplying)}
            className="reply-btn"
          >
            Reply
          </button>
        </div>
      )}
      
      {isReplying && canReply && (
        <form onSubmit={handleSubmitReply} className="reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            rows="3"
            required
          />
          <div className="form-actions">
            <button type="submit">Post Reply</button>
            <button type="button" onClick={() => setIsReplying(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {comment.replies && comment.replies.map((reply) => (
        <Comment 
          key={reply._id} 
          comment={reply} 
          onReply={onReply}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

const CommentThread = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/comments/post/" + postId);
      const data = await response.json();
      setComments(data.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const buildCommentTree = (commentsArray) => {
    const commentMap = {};
    const roots = [];
    
    commentsArray.forEach(comment => {
      comment.replies = [];
      commentMap[comment._id] = comment;
    });
    
    commentsArray.forEach(comment => {
      if (comment.parentCommentId) {
        const parent = commentMap[comment.parentCommentId];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        roots.push(comment);
      }
    });
    
    return roots;
  };

  const handleReply = async (parentCommentId, content) => {
    try {
      await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          postId,
          parentCommentId,
          author: currentUser.username,
          authorId: currentUser.id
        })
      });
      fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Failed to post reply");
    }
  };

  const handleNewComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          postId,
          author: currentUser.username,
          authorId: currentUser.id
        })
      });
      
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment");
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const nestedComments = buildCommentTree(comments);

  if (loading) return <div className="loading">Loading comments...</div>;

  return (
    <div className="comment-thread">
      <h3>Comments ({nestedComments.length})</h3>
      
      {currentUser ? (
        <form onSubmit={handleNewComment} className="new-comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="4"
            required
          />
          <button type="submit" className="btn btn-primary">Post Comment</button>
        </form>
      ) : (
        <p>Please log in to comment</p>
      )}
      
      <div className="comments-list">
        {nestedComments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          nestedComments.map((comment) => (
            <Comment 
              key={comment._id} 
              comment={comment} 
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentThread;
