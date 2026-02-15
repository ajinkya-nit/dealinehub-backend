##FRONTEND LINK
[https://github.com/ajinkya-nit/deadline-hub-frontend](https://github.com/ajinkya-nit/deadline-hub-frontend)

# NITJ Deadline Management System - Backend

A robust Node.js and Express.js backend API for the NITJ Deadline Management System. Manages academic deadlines, campus events, and user authentication with MongoDB as the database.

## 🎯 Features

- **JWT-based Authentication**: Secure user authentication and session management
- **Role-Based Access Control**: Separate access levels for students and professors
- **Academic Post Management**: Create and manage assignments, notes, and quizzes with group targeting
- **Campus Event Management**: Full CRUD operations for student-posted events with engagement features (likes, comments)
- **Pagination Support**: Efficient data retrieval with pagination for posts and events
- **Image Storage**: Cloud-based image storage using Cloudinary
- **Password Hashing**: Secure password encryption with bcrypt
- **CORS Support**: Built-in cross-origin request handling for frontend integration
- **Error Handling**: Comprehensive error handling with async/await

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose ODM 7.0.0
- **Authentication**: JWT (jsonwebtoken 9.0.0)
- **Security**: bcrypt 5.1.0
- **File Upload**: Multer 1.4.5
- **Cloud Storage**: Cloudinary 2.9.0
- **Development**: Nodemon 3.1.11

## 📋 Prerequisites

- Node.js 14+ and npm
- MongoDB (local or cloud MongoDB Atlas)
- Cloudinary account for image storage
- Git for version control

## 🚀 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd deadline-management/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the backend root directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nitj-deadline-management

# JWT Configuration
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── server.js                 # Entry point, Express configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # Dependency lock file
│
├── config/
│   └── database.js         # MongoDB connection setup
│
├── models/                 # Mongoose schemas
│   ├── User.js            # User model (students & professors)
│   ├── Post.js            # Academic posts model (assignments, notes, quizzes)
│   └── Event.js           # Campus events model
│
├── controllers/            # Business logic for routes
│   ├── authController.js  # Authentication logic
│   ├── postController.js  # Post management logic
│   └── eventController.js # Event management logic
│
├── routes/                # API route definitions
│   ├── auth.js           # Authentication endpoints
│   ├── posts.js          # Post management endpoints
│   └── events.js         # Event management endpoints
│
├── middleware/            # Custom middleware
│   └── auth.js           # JWT verification and role authorization
│
└── utils/                # Utility functions
    ├── auth.js           # Token generation utilities
    └── envValidator.js   # Environment variable validation
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user (student/professor)
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user profile

### Post Routes (`/api/posts`)
- `GET /` - Get all posts with pagination (students see filtered posts)
- `POST /` - Create new post (professor only)
- `GET /:id` - Get specific post
- `PUT /:id` - Update post (professor only)
- `DELETE /:id` - Delete post (professor only)

### Event Routes (`/api/events`)
- `GET /` - Get all events with pagination
- `POST /` - Create new event (students)
- `GET /:id` - Get specific event
- `PUT /:id` - Update event
- `DELETE /:id` - Delete event
- `POST /:id/like` - Like/unlike event
- `POST /:id/comment` - Add comment to event

## 🗄️ Database Models

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (student/professor),
  // Student-specific
  group: String,
  subgroup: String,
  rollNumber: String,
  // Professor-specific
  department: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  title: String,
  description: String,
  type: String (assignment/notes/quiz),
  targetGroups: [String],
  targetSubgroups: [String],
  deadline: Date,
  postedBy: UUID (professor),
  views: [UUID],
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model
```javascript
{
  title: String,
  description: String,
  image: String (image URL),
  category: String,
  createdBy: UUID (student),
  likes: [UUID],
  comments: [{
    userId: UUID,
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

1. **Register**: User provides email, password, and role-specific details
2. **Password Hashing**: Password is encrypted using bcrypt
3. **Login**: User credentials are verified
4. **JWT Generation**: JWT token is created with userId and role
5. **Token Verification**: Middleware verifies token for protected routes
6. **Authorization**: Endpoint checks user role for access control

## 🛡️ Middleware

### Auth Middleware (`middleware/auth.js`)
- Verifies JWT tokens from request headers
- Attaches user info (userId, role) to request object
- Handles authorization based on user roles
- Returns 401 for missing/invalid tokens
- Returns 403 for unauthorized access

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## 🧪 Testing the API

### Using cURL or Postman

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@nitj.ac.in",
    "password": "password123",
    "name": "Student Name",
    "role": "student",
    "group": "A",
    "subgroup": "1"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@nitj.ac.in",
    "password": "password123"
  }'
```

#### Get All Posts (with token)
```bash
curl -X GET http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check MongoDB service is running and URI is correct in .env |
| CORS errors | Ensure `CORS_ORIGIN` in .env matches frontend URL |
| JWT errors | Verify `JWT_SECRET` is set in .env |
| Image upload fails | Check Cloudinary credentials in .env |
| Port 5000 already in use | Change PORT in .env or stop the process using that port |

## 📦 Environment Variables Checklist

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Secret key for JWT signing
- [ ] `JWT_EXPIRE` - Token expiration time
- [ ] `PORT` - Server port (default: 5000)
- [ ] `NODE_ENV` - Environment (development/production)
- [ ] `CORS_ORIGIN` - Frontend URL for CORS
- [ ] `CLOUDINARY_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret

## 🔄 Development Workflow

1. Create a new feature branch
2. Make changes to controllers/routes/models
3. Test endpoints using Postman or cURL
4. Ensure error handling is in place
5. Update this README if adding new endpoints
6. Commit and push changes

## 📚 Related Documentation

- [Frontend README](../frontend/README.md) - Frontend setup and documentation
- [Quick Reference Guide](../QUICK_REFERENCE.md) - Quick start guide
- [Project Summary](../PROJECT_SUMMARY.md) - Complete project overview
- [Express.js Documentation](https://expressjs.com/en/api.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👨‍💻 Support

For issues, questions, or suggestions, please create an issue in the repository.
