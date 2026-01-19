# 🚀 SafeSpeak-Plus - Quick Start Guide

## ✅ What We've Built

### Backend (Node.js + Express)
- ✓ Server setup with Express
- ✓ MongoDB database connection
- ✓ User authentication routes (/register, /login, /anonymous-login)
- ✓ JWT token generation and verification
- ✓ Password encryption with bcrypt
- ✓ Error handling middleware
- ✓ CORS configuration

### Frontend (React)
- ✓ Registration page with backend API integration
- ✓ Login page with two authentication methods
- ✓ API service file for centralized requests
- ✓ Token storage in localStorage
- ✓ Error and loading state handling

---

## 🔧 Setup Instructions

### STEP 1: Install MongoDB

**Option A: Local MongoDB**
1. Download from: https://www.mongodb.com/try/download/community
2. Install and run MongoDB service
3. Verify running: `mongosh` (should open MongoDB shell)

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/safespeak-plus`
5. Update `backend/.env` with your connection string

### STEP 2: Configure Backend

```bash
# Go to backend folder
cd backend

# File: .env
# Make sure these values are correct:
MONGODB_URI=mongodb://localhost:27017/safespeak-plus
# (or your MongoDB Atlas URL)

JWT_SECRET=safespeak_plus_development_secret_key_change_in_production_12345
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### STEP 3: Start Backend Server

```bash
# In backend folder
npm run dev

# Expected output:
# ╔════════════════════════════════════════╗
# ║  SafeSpeak-Plus Backend Server Started ║
# ║  🚀 Server running at: http://localhost:5000
# ╚════════════════════════════════════════╝
```

### STEP 4: Start Frontend Server

```bash
# In NEW terminal, go to frontend folder
cd frontend

npm run dev

# Expected output:
# VITE v... ready in ... ms
# ➜  Local:   http://localhost:5173/
```

### STEP 5: Test the Application

1. **Open browser**: http://localhost:5173
2. **Click Register**
3. **Fill form:**
   - Email: `test@college.edu`
   - Password: `Test123456`
   - Confirm: `Test123456`
4. **Click Register Securely**
5. **You should see:**
   - Success message
   - Anonymous code displayed (e.g., `A7X-992-B4Q`)
   - Redirect to login in 5 seconds

6. **Click Email & Password tab**
7. **Login with:**
   - Email: `test@college.edu`
   - Password: `Test123456`
8. **Success:** Redirected to dashboard!

---

## 🧪 Testing with Postman

### Test 1: Register User

```
Method: POST
URL: http://localhost:5000/api/auth/register

Headers:
Content-Type: application/json

Body (JSON):
{
  "email": "newuser@college.edu",
  "password": "Password123",
  "confirmPassword": "Password123"
}

Expected Response:
{
  "success": true,
  "message": "Registration successful!",
  "user": {
    "id": "...",
    "email": "newuser@college.edu",
    "anonymousCode": "ABC-123-DEF"
  }
}
```

### Test 2: Login with Email

```
Method: POST
URL: http://localhost:5000/api/auth/login

Headers:
Content-Type: application/json

Body (JSON):
{
  "email": "newuser@college.edu",
  "password": "Password123"
}

Expected Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "newuser@college.edu"
  }
}
```

### Test 3: Login with Anonymous Code

```
Method: POST
URL: http://localhost:5000/api/auth/anonymous-login

Headers:
Content-Type: application/json

Body (JSON):
{
  "anonymousCode": "ABC-123-DEF"
}

Expected Response:
{
  "success": true,
  "message": "Anonymous login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "..."
  }
}
```

### Test 4: Get Current User (Protected Route)

```
Method: GET
URL: http://localhost:5000/api/auth/me

Headers:
Content-Type: application/json
Authorization: Bearer <YOUR_TOKEN_HERE>

Expected Response:
{
  "success": true,
  "user": {
    "id": "...",
    "email": "newuser@college.edu",
    "fullName": null,
    "role": "user"
  }
}
```

---

## 📊 File Structure

```
safe-speak/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── authController.js     # Register, login logic
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── models/
│   │   └── User.js               # User schema
│   ├── routes/
│   │   └── authRoutes.js         # API endpoints
│   ├── .env                       # Environment variables
│   ├── .gitignore                 # Don't commit .env, node_modules
│   ├── package.json               # Dependencies
│   └── server.js                  # Main server file
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.jsx      # Updated with API calls
    │   │   ├── RegisterPage.jsx   # Updated with API calls
    │   │   └── ...
    │   ├── services/
    │   │   └── authService.js     # API service file
    │   └── ...
    └── ...
```

---

## 🔐 Security Checklist

- ✓ Passwords encrypted with bcrypt
- ✓ JWT tokens for authentication
- ✓ CORS enabled only for frontend
- ✓ .env file in .gitignore
- ✓ No secrets in code
- ✓ Input validation on backend
- ✓ Error messages don't leak info

### To Improve Security:

1. **Add HTTPS in production**
2. **Implement refresh tokens** (7-day expiration)
3. **Add rate limiting** (prevent brute force)
4. **Validate file uploads**
5. **Implement email verification**
6. **Add two-factor authentication**
7. **Log security events**
8. **Regular security audits**

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
```bash
# Solution: Install dependencies
cd backend
npm install
```

### Error: "MongoDB connection failed"
```bash
# Solution 1: Make sure MongoDB is running
# On Windows: mongod.exe should be running

# Solution 2: Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/safespeak-plus

# Solution 3: If using MongoDB Atlas, update connection string with credentials
```

### Error: "CORS error in browser console"
```bash
# Solution: Make sure CORS is configured in server.js
# Check: app.use(cors({ origin: 'http://localhost:5173' }))
```

### Error: "Token expired or invalid"
```bash
# Solution: Clear localStorage and login again
# In browser console: localStorage.clear()
```

### Frontend can't reach backend
```bash
# Check 1: Backend running? http://localhost:5000/api/health
# Check 2: Frontend URL correct in backend .env?
# Check 3: Frontend API URL correct? Check authService.js
# Check 4: CORS enabled on backend?
```

---

## 📚 What We Learned

### Backend Concepts:
- REST API design
- Express middleware
- MongoDB & Mongoose
- JWT authentication
- Password encryption (bcrypt)
- Error handling
- Environment variables

### Frontend Concepts:
- API calls with fetch
- State management
- Token storage
- Error handling
- Loading states
- Conditional rendering

### Full Stack Concepts:
- Request/Response cycle
- HTTP methods
- Headers and status codes
- Authentication flow
- Data validation
- Security best practices

---

## 🚀 Next Steps (Future Enhancements)

1. **Email Verification**
   - Send confirmation email after registration
   - User clicks link to verify email

2. **Password Reset**
   - "Forgot Password" functionality
   - Reset email with temporary link

3. **Refresh Tokens**
   - Extend session without re-login
   - Better user experience

4. **Report Management**
   - Create incident reports
   - View submitted reports
   - Admin dashboard

5. **Notifications**
   - Email notifications
   - In-app notifications
   - Admin alerts

6. **Analytics**
   - Dashboard with statistics
   - Report categories
   - Trend analysis

7. **Admin Features**
   - View all reports
   - Manage users
   - Ban/deactivate accounts

8. **Advanced Security**
   - Two-factor authentication
   - Rate limiting
   - Suspicious activity detection

---

## 💡 Key Commands

### Backend
```bash
# Start development server (with auto-restart)
npm run dev

# Start production server
npm start

# Install new package
npm install package-name

# Fix npm vulnerabilities
npm audit fix
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Git
```bash
# Initialize git repository
git init

# Stage files for commit
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main
```

---

## 📞 Common Questions

**Q: Can I use a different database?**
A: Yes! Replace MongoDB with PostgreSQL, MySQL, etc. Just update the database connection in config/db.js

**Q: How do I deploy this?**
A: Frontend: Vercel, Netlify. Backend: Heroku, Railway, AWS, DigitalOcean

**Q: How long are tokens valid?**
A: 7 days by default (JWT_EXPIRE in .env). User must login again after expiration.

**Q: Is the anonymous code really anonymous?**
A: Yes! Backend doesn't store which email has which code. Code is just a lookup key.

**Q: Can I add more fields to User model?**
A: Yes! Edit models/User.js and add new fields to the schema.

**Q: How do I handle user roles (admin, moderator)?**
A: Already in User model! Add role checking middleware and use it on protected routes.

---

## 📖 Documentation Files

We created several documentation files:

1. **BACKEND_SETUP_NOTES.md** - Complete backend explanation
2. **FRONTEND_INTEGRATION_GUIDE.md** - Frontend connection guide
3. **This file** - Quick start and troubleshooting

Read these for deeper understanding!

---

## ✨ Congratulations!

You've built a full-stack authentication system! This is the foundation for SafeSpeak-Plus. You now understand:

- How frontends and backends communicate
- How to secure authentication
- How to manage databases
- How to structure a project properly
- Best practices for web development

**Next time:** Add report management features!

---

*Last Updated: January 15, 2026*
*Happy Coding! 🎉*
