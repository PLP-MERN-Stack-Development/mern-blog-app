import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, default: '' },
  category: { type: String, default: 'Other' },
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture }
    });
  } catch (error) {
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (category && category !== 'All') query.category = category;
    const posts = await Post.find(query)
      .populate('author', 'username profilePicture')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Post.countDocuments(query);
    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPosts: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
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
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
});

app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content, image, category, tags } = req.body;
    const post = new Post({
      title, content, image, category,
      tags: tags || [],
      author: req.user._id
    });
    await post.save();
    await post.populate('author', 'username profilePicture');
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
});

app.put('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { title, content, image, category, tags } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    if (image !== undefined) post.image = image;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    await post.save();
    await post.populate('author', 'username profilePicture');
    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
});

app.post('/api/posts/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userIndex = post.likes.indexOf(req.user._id);
    if (userIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(userIndex, 1);
    }
    await post.save();
    res.json({ message: 'Like updated', likes: post.likes.length, liked: userIndex === -1 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update like', error: error.message });
  }
});

app.get('/api/comments/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username profilePicture')
      .sort('-createdAt');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
});

app.post('/api/comments', authMiddleware, async (req, res) => {
  try {
    const { content, postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = new Comment({
      content,
      post: postId,
      author: req.user._id
    });
    await comment.save();
    await comment.populate('author', 'username profilePicture');
    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
});

app.delete('/api/comments/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'MERN Blog API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });