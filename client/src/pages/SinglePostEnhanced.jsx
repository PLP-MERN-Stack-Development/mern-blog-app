import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SinglePostEnhanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPost(id);
      setPost(response.data);
      setLiked(response.data.likes?.includes(user?.id));
      setLoading(false);
    } catch (error) {
      toast.error('Post not found');
      navigate('/');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like');
      return;
    }
    try {
      const response = await postsAPI.likePost(id, token);
      setLiked(response.data.liked);
      setPost({ ...post, likes: response.data.liked ? [...post.likes, user.id] : post.likes.filter(l => l !== user.id) });
      toast.success(response.data.liked ? 'Post liked!' : 'Post unliked!');
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      try {
        await postsAPI.deletePost(id, token);
        toast.success('Post deleted');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    try {
      await commentsAPI.createComment({ content: commentText, postId: id }, token);
      toast.success('Comment added!');
      setCommentText('');
      fetchComments();
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await commentsAPI.deleteComment(commentId, token);
        toast.success('Comment deleted');
        fetchComments();
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  const isAuthor = user?.id === post.author?._id;

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#007bff' }}>← Back to Home</Link>
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div>
            <span style={{ display: 'inline-block', padding: '4px 12px', background: '#007bff', color: 'white', borderRadius: '15px', fontSize: '12px', marginBottom: '10px' }}>
              {post.category}
            </span>
            <h1 style={{ margin: '0' }}>{post.title}</h1>
          </div>
          {isAuthor && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to={`/edit/${post._id}`} style={{ padding: '8px 16px', background: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                Edit
              </Link>
              <button onClick={handleDelete} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <img src={post.author?.profilePicture} alt={post.author?.username} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          <div>
            <strong>{post.author?.username}</strong>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
            <span>👁️ {post.views} views</span>
            <span>❤️ {post.likes?.length || 0} likes</span>
            <span>💬 {comments.length} comments</span>
          </div>
        </div>

        <div style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '30px', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            {post.tags.map((tag, i) => (
              <span key={i} style={{ display: 'inline-block', padding: '4px 12px', background: '#f0f0f0', borderRadius: '15px', fontSize: '12px', marginRight: '8px' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <button 
          onClick={handleLike} 
          disabled={!isAuthenticated}
          style={{ 
            padding: '10px 24px', 
            background: liked ? '#dc3545' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: isAuthenticated ? 'pointer' : 'not-allowed',
            fontSize: '16px'
          }}
        >
          {liked ? '❤️ Unlike' : '🤍 Like'} ({post.likes?.length || 0})
        </button>
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', marginTop: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Comments ({comments.length})</h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '30px' }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              required
              rows="4"
              style={{ width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
            />
            <button type="submit" style={{ padding: '10px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
              Post Comment
            </button>
          </form>
        ) : (
          <p style={{ marginBottom: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <Link to="/login">Login</Link> to leave a comment
          </p>
        )}

        {comments.length === 0 ? (
          <p style={{ color: '#666' }}>No comments yet. Be the first to comment!</p>
        ) : (
          <div>
            {comments.map(comment => (
              <div key={comment._id} style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={comment.author?.profilePicture} alt={comment.author?.username} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div>
                      <strong>{comment.author?.username}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {user?.id === comment.author?._id && (
                    <button 
                      onClick={() => handleDeleteComment(comment._id)} 
                      style={{ padding: '4px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p style={{ margin: '0', lineHeight: '1.6' }}>{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePostEnhanced;