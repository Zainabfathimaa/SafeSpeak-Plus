# 🎓 SafeSpeak-Plus Backend Setup - Complete Learning Guide

## 📌 Table of Contents
1. [Understanding the Project](#understanding-the-project)
2. [Backend Architecture](#backend-architecture)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [API Endpoints Reference](#api-endpoints-reference)
5. [Database Schema](#database-schema)

---

## 🎯 Understanding the Project

### What is SafeSpeak-Plus?
- **Purpose:** An anonymous incident reporting platform
- **Users:** College students, employees who want to report issues safely
- **Key Feature:** Users remain anonymous while reporting

### Frontend Summary (What We Already Have)
- **Registration Page:** Users create account with email + password
  - Currently: Takes email, password, confirm password
  - Needed: Send to backend, get anonymous code back
  
- **Login Page:** Two modes
  - Email & Password login (for registered users)
  - Anonymous Code login (for those with code)

---

## 🏗️ Backend Architecture

### What is a Backend?
```
Think of it like:
- Frontend = Restaurant's Customer Menu & Dining Area
- Backend = Kitchen where food is prepared
- Database = Storage/Pantry

Frontend sends requests → Backend processes → Database stores data
```

### Technologies We'll Use:

1. **Node.js** - JavaScript runtime (runs JavaScript on server)
2. **Express** - Framework that makes building APIs easy
3. **MongoDB** - Database to store user data
4. **bcrypt** - Encrypts passwords (never store plain passwords!)
5. **JWT (JSON Web Tokens)** - Authenticates users after login
6. **dotenv** - Manages secret variables (.env file)

### Why Each Technology?
- **Node.js**: Easy to use, JavaScript everywhere (frontend & backend)
- **Express**: Minimal, flexible, perfect for building APIs
- **MongoDB**: NoSQL, flexible data structure, great for rapid development
- **bcrypt**: Industry standard for password encryption
- **JWT**: Secure way to maintain user sessions
- **dotenv**: Keep secrets safe (don't hardcode passwords!)

---

## 📝 Step-by-Step Implementation

### STEP 1: Create Backend Folder & Initialize Node.js Project

**What we're doing:**
- Creating a new folder called `backend` inside your project
- Initializing Node.js project (creates package.json)

**Commands:**
```bash
# Create backend folder
mkdir backend

# Go into backend folder
cd backend

# Initialize Node.js project
npm init -y
```

**What each does:**
- `mkdir backend` = Make new folder named "backend"
- `cd backend` = Change directory to backend (like opening the folder)
- `npm init -y` = Create package.json with default settings
  - `-y` flag means "yes to all defaults"

**What is package.json?**
- A file that lists all your project dependencies
- Lists scripts you can run (like `npm start`)
- Stores project information (name, version, etc.)

**Example package.json will look like:**
```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5"
  }
}
```

---

### STEP 2: Install Required Packages (Dependencies)

**What we're doing:**
- Installing all libraries our backend needs

**Commands:**
```bash
npm install express bcryptjs jsonwebtoken mongoose dotenv cors nodemon
```

**What each package does:**

| Package | Why We Need It | What It Does |
|---------|----------------|-------------|
| **express** | Build API | Creates web server & handles routes |
| **bcryptjs** | Security | Encrypts passwords before saving |
| **jsonwebtoken** | Authentication | Creates tokens for logged-in users |
| **mongoose** | Database | Connects & manages MongoDB |
| **dotenv** | Environment | Loads secret variables from .env file |
| **cors** | Browser | Allows frontend to talk to backend |
| **nodemon** | Development | Auto-restarts server when you save files |

**What happens when you run this:**
1. npm downloads packages from npmjs.com
2. Creates `node_modules` folder (contains all code)
3. Updates `package.json` with versions
4. Creates `package-lock.json` (locks exact versions)

---

### STEP 3: Create .env File

**What we're doing:**
- Creating a file for secret variables (passwords, API keys, database URLs)
- NEVER commit this to GitHub (add to .gitignore)

**Why?**
- Never hardcode secrets in your code
- Different values for development vs production
- Easy to change without editing code

**File: `.env`**
```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/safespeak-plus
# OR if using MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/safespeak-plus

# JWT Configuration
JWT_SECRET=your_super_secret_key_here_min_32_characters
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Email Configuration (if sending emails)
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# App Configuration
APP_NAME=SafeSpeak-Plus
```

---

### STEP 4: Create server.js (Main Server File)

**What we're doing:**
- Creating the main file that starts your backend server
- Setting up Express app
- Configuring middleware
- Setting up routes

**What is middleware?**
```
Think of it as security/processing checkpoints:
Request → Middleware 1 (check format) → Middleware 2 (log request) → Route handler → Response
```

**Key Middleware:**
- **CORS**: Allows frontend to make requests
- **JSON Parser**: Converts JSON strings to objects
- **dotenv**: Loads environment variables

---

### STEP 5: Create Database Connection (db.js)

**What we're doing:**
- Setting up MongoDB connection
- Creating reusable connection function
- Adding error handling

**MongoDB Basics:**
```
Database = File Cabinet
Collection = Drawer (like "users" drawer)
Document = Individual File (each user's data)
```

**Example User Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "student@college.edu",
  "password": "$2b$10$encrypted_password_here",
  "anonymousCode": "A7X-992-B4Q",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### STEP 6: Create User Model (models/User.js)

**What we're doing:**
- Defining what a User document looks like
- Setting validation rules
- Creating methods for the User

**Schema Explanation:**
```javascript
email: {
  type: String,        // Text data type
  required: true,      // Must provide this field
  unique: true,        // No two users with same email
  lowercase: true,     // Convert to lowercase before saving
  match: /.+@.+/       // Must be valid email format
}
```

**User Model Will Have:**
```
{
  email: String (required, unique),
  password: String (required, encrypted),
  anonymousCode: String (unique, generated),
  fullName: String (optional),
  createdAt: Date (automatic),
  isEmailVerified: Boolean (default false)
}
```

---

### STEP 7: Create Authentication Routes (routes/auth.js)

**What we're doing:**
- Creating /register endpoint
- Creating /login endpoint
- Creating /anonymous-login endpoint
- Adding error handling

#### 7A: Registration Flow
```
1. User submits: email, password
2. Backend checks: email not already registered
3. Backend: encrypt password using bcrypt
4. Backend: generate unique anonymous code (A7X-992-B4Q format)
5. Backend: save user to database
6. Backend: send anonymous code to user's email (optional)
7. Backend: return success response
```

#### 7B: Login Flow (Email & Password)
```
1. User submits: email, password
2. Backend: find user by email
3. Backend: compare submitted password with encrypted password
4. Backend: if match, create JWT token
5. Backend: return token to frontend
6. Frontend: stores token in localStorage
```

#### 7C: Anonymous Login Flow
```
1. User submits: anonymous code (A7X-992-B4Q)
2. Backend: find user with that code
3. Backend: if found, create JWT token
4. Backend: return token to frontend
```

---

### STEP 8: Create JWT Middleware (middleware/auth.js)

**What is JWT?**
```
JWT = Passport for authenticated users

Without JWT:
- User logs in
- Backend forgets they're logged in
- User refreshes page → not logged in anymore
- User must login again

With JWT:
- User logs in → gets token (like passport)
- Frontend stores token
- Every request includes token
- Backend checks token → "Yes, you're valid!"
```

**JWT Structure:**
```
Token = Header.Payload.Signature

Example: eyJhbGc.eyJpZCI6IjEyMyJ9.SflKxw...

- Header: Type of token (JWT) and algorithm
- Payload: User data (email, id, etc.)
- Signature: Secret signature to verify it's real
```

**Middleware Does:**
```
1. Check if request has token
2. Extract token from request header
3. Verify signature (is it real?)
4. Extract user info from token
5. If valid: continue to route handler
6. If invalid: return 401 Unauthorized
```

---

### STEP 9: Connect Frontend to Backend

**What we're doing:**
- Update LoginPage.jsx to call /login API
- Update RegisterPage.jsx to call /register API
- Store JWT token in localStorage
- Add Authorization header to requests

**Frontend Changes:**
```javascript
// Instead of: console.log('Login submitted', formData)
// We'll do:

const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
// Save token
localStorage.setItem('token', data.token);
// Redirect
navigate('/dashboard');
```

---

## 🔌 API Endpoints Reference

### BASE URL: `http://localhost:5000/api`

### Authentication Endpoints

#### 1. **POST /auth/register**
**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "SecurePassword123"
}
```

**Response (Success 201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@college.edu",
    "anonymousCode": "A7X-992-B4Q"
  }
}
```

**Response (Error 400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

#### 2. **POST /auth/login**
**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "SecurePassword123"
}
```

**Response (Success 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@college.edu"
  }
}
```

#### 3. **POST /auth/anonymous-login**
**Request Body:**
```json
{
  "anonymousCode": "A7X-992-B4Q"
}
```

**Response (Success 200):**
```json
{
  "success": true,
  "message": "Anonymous login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 💾 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (encrypted, required),
  anonymousCode: String (unique, auto-generated),
  fullName: String (optional),
  phone: String (optional),
  department: String (optional),
  role: String (default: 'user'),
  isEmailVerified: Boolean (default: false),
  lastLogin: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Reports Collection (Future)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  title: String,
  description: String,
  category: String,
  priority: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Features We're Implementing

1. **Password Encryption (bcrypt)**
   - Passwords never stored in plain text
   - One-way encryption (can't decrypt)
   - Salt rounds: 10 (stronger = slower but safer)

2. **JWT Tokens**
   - Stateless authentication (no session database needed)
   - Expiration time (7 days)
   - Signed with secret key

3. **Environment Variables**
   - Secrets not in code
   - Different values per environment

4. **CORS**
   - Only frontend can access backend
   - Prevents unauthorized access

5. **Input Validation**
   - Check email format
   - Check password strength
   - Prevent SQL injection

---

## 🚀 Running the Application

### Development (Terminal 1 - Backend):
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

### Development (Terminal 2 - Frontend):
```bash
cd frontend
npm run dev
# App starts on http://localhost:5173
```

### Testing:
```bash
# Test register endpoint:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@college.edu","password":"Test123"}'

# Test login endpoint:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@college.edu","password":"Test123"}'
```

---

## 📚 Key Concepts Summary

| Concept | Explanation | Analogy |
|---------|-------------|---------|
| **API** | Interface between frontend & backend | Waiter between customer & kitchen |
| **Endpoint** | URL that does something | Address of a business |
| **Request** | Data sent to backend | Customer's order |
| **Response** | Data sent back | Kitchen's finished dish |
| **Database** | Permanent storage | Filing cabinet |
| **Middleware** | Processing between request & response | Security checkpoint |
| **JWT Token** | Proof of login | Passport |
| **bcrypt** | Password encryption | Secret code generator |
| **Environment Variable** | Secret settings | Locked safe |

---

## ⚠️ Common Mistakes to Avoid

❌ **Don't:**
- Store passwords in plain text
- Commit .env file to GitHub
- Use weak passwords
- Forget to validate input
- Hardcode database URLs

✅ **Do:**
- Use bcrypt for passwords
- Add .env to .gitignore
- Require strong passwords
- Validate all input
- Use environment variables

---

## 🔗 Frontend-Backend Communication Flow

```
REGISTRATION FLOW:
┌─ Frontend (RegisterPage.jsx)
│   User fills: email, password
│   Clicks "Register"
│   JavaScript collects form data
│   Sends POST request to /api/auth/register
│
├─ Backend (server.js → routes/auth.js)
│   Receives email, password
│   Validates email format
│   Checks if email already exists
│   Encrypts password with bcrypt
│   Generates anonymous code
│   Saves user to MongoDB
│
└─ Frontend Receives Response
    If success: Show "Check your email for code"
    If error: Show "Email already registered"
    Redirect to login page after 3 seconds

LOGIN FLOW:
┌─ Frontend (LoginPage.jsx)
│   User fills: email, password
│   Sends POST request to /api/auth/login
│
├─ Backend
│   Finds user by email
│   Compares password with bcrypt
│   Creates JWT token
│   Sends token back
│
└─ Frontend
    Stores token in localStorage
    Uses token for future requests
    Redirects to dashboard
    Every request includes: Authorization: Bearer TOKEN
```

---

## 📞 Need Help?

Check error messages:
- **Cannot find module**: Package not installed (run `npm install`)
- **ECONNREFUSED**: Database not connected
- **jwt malformed**: Token expired or invalid
- **401 Unauthorized**: Token missing or invalid

---

## Next Steps After Backend is Ready

1. **Email Verification** - Send confirmation emails
2. **Password Reset** - Allow users to reset forgotten passwords
3. **Report Management** - Create, read, update, delete reports
4. **Admin Dashboard** - View all reports, manage users
5. **Notification System** - Alert admins of new reports
6. **Analytics** - Dashboard with statistics

---

*Last Updated: January 15, 2026*
*Safe Speak Plus - Anonymous Incident Reporting Platform*
