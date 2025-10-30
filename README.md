# MERN Blog Application

Full-stack blog application built with MongoDB, Express.js, React.js, and Node.js.

## 🌐 Live Demo

- **Frontend:** https://biscoohitos-f81ea7.netlify.app
- **GitHub Repository:** https://github.com/PLP-MERN-Stack-Development/mern-blog-app

## ✨ Features

### Core Features
- User registration and authentication (JWT)
- Create, read, update, delete blog posts
- Comment on posts
- Like/unlike posts
- User profiles
- Search posts by keywords
- Filter posts by category
- Pagination (9 posts per page)

### Technical Features
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT authentication
- Password hashing with Bcrypt
- Input validation
- Error handling middleware
- CORS configuration
- React Context API for state management
- React Router for navigation
- Responsive design

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT & Bcrypt
- Joi Validation

**Frontend:**
- React.js
- React Router DOM
- Axios
- React Toastify
- Context API

## 📁 Project Structure
```
mern-blog/
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── server/          # Express backend  
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- npm

### Installation

1. Clone repository:
```bash
git clone https://github.com/PLP-MERN-Stack-Development/mern-blog-app.git
cd mern-blog-app
```

2. Backend setup:
```bash
cd server
npm install
```

3. Frontend setup:
```bash
cd client
npm install
```

4. Environment variables:

**server/.env:**
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
NODE_ENV=development
```

**client/.env:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Run application:

Backend:
```bash
cd server
npm run dev
```

Frontend (new terminal):
```bash
cd client
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Posts
- `GET /api/posts` - Get all posts (supports ?search, ?category, ?page)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (Protected)
- `PUT /api/posts/:id` - Update post (Protected)
- `DELETE /api/posts/:id` - Delete post (Protected)
- `POST /api/posts/:id/like` - Like/unlike post (Protected)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Protected)

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment (Protected)
- `DELETE /api/comments/:id` - Delete comment (Protected)

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)
*Browse all blog posts with search and filter*

### Post Detail
![Post Detail](screenshots/post.png)
*Read posts with comments section*

### Create Post
![Create Post](screenshots/create.png)
*Easy post creation interface*

### User Profile
![Profile](screenshots/profile.png)
*Manage your posts and profile*

## 🌍 Deployment

- **Frontend:** Deployed on Netlify
- **Backend:** Deployed on Render
- **Database:** MongoDB Atlas

## 📝 Assignment Completion

This project fulfills Week 4 MERN Stack Integration requirements:

✅ Task 1: Project Setup
✅ Task 2: Back-End Development (All RESTful endpoints)
✅ Task 3: Front-End Development (React components & routing)
✅ Task 4: Integration and Data Flow
✅ Task 5: Advanced Features (Auth, search, pagination, comments)

## 👨‍💻 Author

**Mawunyof Mary**
- GitHub: [@PLP-MERN-Stack-Development](https://github.com/PLP-MERN-Stack-Development)

## 🙏 Acknowledgments

- PLP Academy MERN Stack Development Course
- MongoDB, Express, React, Node.js communities

---

**⭐ PLP MERN Stack Development - Week 4 Assignment**
