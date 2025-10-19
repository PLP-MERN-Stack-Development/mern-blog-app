import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const authAPI = {
  register: (username, email, password) => 
    api.post('/auth/register', { username, email, password }),
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  getCurrentUser: (token) => 
    api.get('/auth/me', getAuthHeader(token))
};

export const postsAPI = {
  getAllPosts: (params = {}) => 
    api.get('/posts', { params }),
  getPost: (id) => 
    api.get(`/posts/${id}`),
  createPost: (postData, token) => 
    api.post('/posts', postData, getAuthHeader(token)),
  updatePost: (id, postData, token) => 
    api.put(`/posts/${id}`, postData, getAuthHeader(token)),
  deletePost: (id, token) => 
    api.delete(`/posts/${id}`, getAuthHeader(token)),
  likePost: (id, token) => 
    api.post(`/posts/${id}/like`, {}, getAuthHeader(token))
};

export const commentsAPI = {
  getComments: (postId) => 
    api.get(`/comments/post/${postId}`),
  createComment: (commentData, token) => 
    api.post('/comments', commentData, getAuthHeader(token)),
  deleteComment: (id, token) => 
    api.delete(`/comments/${id}`, getAuthHeader(token))
};

export default api;