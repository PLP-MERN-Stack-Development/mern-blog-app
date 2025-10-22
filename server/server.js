import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

// Validation schemas
const Joi = (await import('joi')).default;

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const postSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(10).required(),
  category: Joi.string(),
  tags: Joi.array(),
  image: Joi.string().allow('')
});
app.use(cors({
  origin: ['http://localhost:3000', 'https://biscoohitos-f81ea7.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profilePicture: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: String,
  category: { type: String, default: 'Other' },
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth failed' });
  }
};

app.post('/api/auth/register', validateRequest(registerSchema), async (req, res) => {
  console.log(' Registration request received:', req.body);
  try {
    console.log('Registration attempt:', req.body); 
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, username, email, profilePicture: user.profilePicture }
    });
  } catch (error) {
    console.error('Registration error:', error); // ADD THIS
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, username: user.username, email, profilePicture: user.profilePicture } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username profilePicture').sort('-createdAt');
    res.json({ posts, totalPages: 1, currentPage: 1, totalPosts: posts.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username profilePicture');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.views += 1;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

app.post('/api/posts', auth, async (req, res) => {
  try {
    const post = new Post({ ...req.body, author: req.user._id });
    await post.save();
    await post.populate('author', 'username profilePicture');
    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post' });
  }
});

app.put('/api/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    Object.assign(post, req.body);
    await post.save();
    res.json({ message: 'Updated', post });
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
});

app.delete('/api/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    await post.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

app.post('/api/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const idx = post.likes.indexOf(req.user._id);
    if (idx === -1) post.likes.push(req.user._id); else post.likes.splice(idx, 1);
    await post.save();
    res.json({ likes: post.likes.length, liked: idx === -1 });
  } catch (error) {
    res.status(500).json({ message: 'Like failed' });
  }
});

app.get('/api/comments/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username profilePicture').sort('-createdAt');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed' });
  }
});

app.post('/api/comments', auth, async (req, res) => {
  try {
    const comment = new Comment({ content: req.body.content, post: req.body.postId, author: req.user._id });
    await comment.save();
    await comment.populate('author', 'username profilePicture');
    res.status(201).json({ message: 'Comment created', comment });
  } catch (error) {
    res.status(500).json({ message: 'Failed' });
  }
});

app.delete('/api/comments/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    await comment.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Health', 'Business', 'Other'];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    res.status(201).json({ message: 'Category endpoint ready', category: name });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'API Running' });
});

const Category = mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true }));

app.get('/api/categories', async (req, res) => {
  try {
    const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Health', 'Business', 'Other'];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server on port ' + PORT));