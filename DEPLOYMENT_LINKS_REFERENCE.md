# 🔗 DEPLOYMENT LINKS & URLS REFERENCE
## Quick Access Guide

---

## 📌 IMPORTANT LINKS (Keep Bookmarked)

### Backend Services

```
🟢 DEVELOPMENT
Local Backend:  http://localhost:5000
Local API:      http://localhost:5000/api

🔵 PRODUCTION (Render)
Render Dashboard:        https://render.com/dashboard
Backend API (Prod):      https://safespeak-plus-api.onrender.com/api
Backend Service URL:     (Will be assigned by Render during deployment)
```

### Frontend Services

```
🟢 DEVELOPMENT
Local Frontend:  http://localhost:5173
Vite Dev URL:    http://localhost:5173

🔵 PRODUCTION (Vercel)
Vercel Dashboard:        https://vercel.com/dashboard
Frontend (Prod):         https://safespeak-plus.vercel.app
                         (Your specific domain assigned by Vercel)
```

---

## 🔐 EXTERNAL SERVICES (Keep Credentials Safe!)

### Database - MongoDB Atlas
```
URL:         https://cloud.mongodb.com
Action:      Create account → Setup cluster → Get connection string
Frequency:   One-time setup, then rarely needed
Keep Secret: MONGODB_URI connection string (contains credentials)
```

### Email - Gmail Setup
```
URL:         https://myaccount.google.com/apppasswords
Requires:    2-Step verification enabled
Action:      Generate App Password (16 characters)
Keep Secret: SMTP_PASSWORD and SMTP_EMAIL
```

### Authentication - JWT
```
Format:      32+ character random string
Generate:    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Keep Secret: JWT_SECRET (never share!)
```

---

## 📋 ENDPOINT REFERENCE


### API Base URL
```
Development:  http://localhost:5000/api
Production:   https://safespeak-plus-api.onrender.com/api
```

### Authentication Endpoints

```
POST   /api/auth/register
       Body: { email, password, collegeId }
       Returns: { success, user, token }

POST   /api/auth/login
       Body: { anonymousCode }
       Returns: { success, token, user }

POST   /api/auth/verify-email
       Body: { email, verificationCode }
       Returns: { success, anonymousCode }

POST   /api/auth/forgot-code
       Body: { email }
       Returns: { success, message }

POST   /api/auth/logout
       Headers: { Authorization: Bearer TOKEN }
       Returns: { success }
```

### Additional Endpoints (As Built)
```
GET    /api/auth/health
       Returns: { success, message: "Server is running" }
```

---

## 🔄 ENVIRONMENT VARIABLE REFERENCE

### Backend Required Variables

```
NODE_ENV              development or production
PORT                  5000 (local), auto (Render)
MONGODB_URI           mongodb+srv://username:password@...
JWT_SECRET            32+ character random string
JWT_EXPIRE            7d
FRONTEND_URL          http://localhost:5173 (dev) or https://domain.vercel.app (prod)
ADDITIONAL_FRONTEND_ORIGINS  (optional, for preview URLs)
SMTP_SERVICE          gmail
SMTP_HOST             smtp.gmail.com
SMTP_PORT             587
SMTP_SECURE           false
SMTP_EMAIL            your-email@gmail.com
SMTP_PASSWORD         16-character Gmail app password
APP_NAME              SafeSpeak-Plus
APP_VERSION           1.0.0
BCRYPT_ROUNDS         10
```

### Frontend Required Variables

```
VITE_BACKEND_URL      http://localhost:5000/api (dev) or https://domain.onrender.com/api (prod)
VITE_ENVIRONMENT      development or production
```

---

## 📍 API ENDPOINT TESTING

### Test Backend Health

```bash
# Development
curl http://localhost:5000/api/auth/health

# Production (after Render deployment)
curl https://safespeak-plus-api.onrender.com/api/auth/health

# Expected Response:
# { "success": true, "message": "Server is running" }
```

### Test Registration (Development)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@college.edu",
    "password": "test123",
    "collegeId": "ID12345"
  }'
```

### Test with Frontend

```bash
# In browser console:
fetch('http://localhost:5000/api/auth/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 🚀 DEPLOYMENT FLOW

### In Order:

```
1. CREATE CREDENTIALS
   ├─ Generate JWT_SECRET
   ├─ Get MongoDB URI from Atlas
   └─ Get Gmail App Password

2. DEPLOY BACKEND (Render)
   ├─ Push code to GitHub
   ├─ Create service on Render
   ├─ Set environment variables
   ├─ Deploy and test health endpoint
   └─ Copy backend URL: https://safespeak-plus-api.onrender.com/api

3. UPDATE ENVIRONMENT
   ├─ Update frontend/.env with VITE_BACKEND_URL
   └─ Set FRONTEND_URL in backend for Render

4. DEPLOY FRONTEND (Vercel)
   ├─ Push code to GitHub
   ├─ Import project to Vercel
   ├─ Set VITE_BACKEND_URL environment variable
   ├─ Deploy
   └─ Copy frontend URL: https://safespeak-plus.vercel.app

5. VERIFY INTEGRATION
   ├─ Test frontend loads
   ├─ Check API calls work
   ├─ Verify no CORS errors
   ├─ Test login/register flow
   └─ Monitor logs for 24 hours
```

---

## 🔗 DEPLOYMENT SERVICE LINKS

### Render (Backend Hosting)
```
Main Site:           https://render.com
Dashboard:           https://render.com/dashboard
Pricing:             https://render.com/pricing
Docs:                https://render.com/docs
Create Web Service:  https://dashboard.render.com
Environment Vars:    https://render.com/docs/environment-variables
Logs & Monitoring:   In service dashboard
```

### Vercel (Frontend Hosting)
```
Main Site:           https://vercel.com
Dashboard:           https://vercel.com/dashboard
Pricing:             https://vercel.com/pricing
Docs:                https://vercel.com/docs
New Project:         https://vercel.com/new
Environment Vars:    https://vercel.com/docs/projects/environment-variables
Analytics:           In project dashboard
```

### MongoDB Atlas (Database)
```
Main Site:           https://www.mongodb.com/cloud
Dashboard:           https://cloud.mongodb.com
Getting Started:     https://www.mongodb.com/docs/atlas/getting-started/
Pricing:             https://www.mongodb.com/cloud/atlas/pricing
Security:            https://www.mongodb.com/docs/atlas/security/
Connection String:   In cluster → Connect → Connection String
IP Whitelist:        In cluster → Security → Network Access
```

### Gmail (Email Service)
```
Gmail Account:       https://mail.google.com
Account Settings:    https://myaccount.google.com
2-Step Setup:        https://myaccount.google.com/security
App Passwords:       https://myaccount.google.com/apppasswords
Security Status:     https://myaccount.google.com/security-checkup
```

---

## 📝 ENVIRONMENT VARIABLE FORMAT

### Example .env File (backend)

```dotenv
# Copy to backend/.env before running locally
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safespeak-plus
JWT_SECRET=your_generated_32_character_secret_key_here_copy_paste
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
ADDITIONAL_FRONTEND_ORIGINS=
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=xxxxxxxxxxxxxxxx
APP_NAME=SafeSpeak-Plus
APP_VERSION=1.0.0
BCRYPT_ROUNDS=10
```

### Example .env File (frontend)

```dotenv
# Copy to frontend/.env before running locally
VITE_BACKEND_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development
```

### For Render (Set in Dashboard)

```
Copy each variable name and value to Render Environment Variables:

NODE_ENV                          = production
MONGODB_URI                       = mongodb+srv://username:password@cluster...
JWT_SECRET                        = your_generated_secret_key
JWT_EXPIRE                        = 7d
FRONTEND_URL                      = https://safespeak-plus.vercel.app
ADDITIONAL_FRONTEND_ORIGINS       = (leave blank or add staging URLs)
SMTP_SERVICE                      = gmail
SMTP_HOST                         = smtp.gmail.com
SMTP_PORT                         = 587
SMTP_SECURE                       = false
SMTP_EMAIL                        = safespeak-admin@gmail.com
SMTP_PASSWORD                     = your-gmail-app-password
APP_NAME                          = SafeSpeak-Plus
APP_VERSION                       = 1.0.0
BCRYPT_ROUNDS                     = 10
```

### For Vercel (Set in Dashboard)

```
Environment: Production

VITE_BACKEND_URL          = https://safespeak-plus-api.onrender.com/api
VITE_ENVIRONMENT          = production
```

---

## 🔍 STATUS VERIFICATION

### Check Backend is Running
```
Render Dashboard → Select service → Logs tab
Should see: "✓ MongoDB Connected Successfully"
            "[PORT] Server starting on http://...:5000"
```

### Check Frontend is Deployed
```
Vercel Dashboard → Select project → Deployments
Should show: "✓ Ready" badge with a link
```

### Check API Connection
```
DevTools → Application tab → Environment Variables
Should show VITE_BACKEND_URL pointing to Render URL

DevTools → Network tab → any API call
Should show requests to https://safespeak-plus-api.onrender.com/api/*
```

---

## ⚠️ COMMON MISTAKES & FIXES

| Mistake | Fix |
|---------|-----|
| VITE_BACKEND_URL=http://localhost:5000 in production | Use HTTPS URL to Render |
| VITE_BACKEND_URL=https://domain.com (no /api) | Add /api: https://domain.com/api |
| FRONTEND_URL=https://domain.com/ (with slash) | Remove trailing slash |
| JWT_SECRET too short (< 32 chars) | Generate new secret with full length |
| .env committed to git | Use .gitignore to exclude .env |
| CORS "origin not allowed" | Update FRONTEND_URL on Render |
| API returns 404 | Check endpoint path is correct |
| MongoDB "connection refused" | Whitelist IP in Atlas or check URI |

---

## 📞 QUICK HELP

### "How do I get my backend URL?"
→ After deploying to Render, go to Render dashboard → Select service → Copy the URL from the header

### "How do I get my frontend URL?"
→ After deploying to Vercel, go to Vercel dashboard → Select project → Copy the domain from the top

### "Where do I set environment variables on Render?"
→ Your service page → Settings → Environment Variables (or Environment tab)

### "Where do I set environment variables on Vercel?"
→ Your project → Settings → Environment Variables

### "How do I test the backend is working?"
→ curl the health endpoint: https://your-backend-url/api/auth/health

### "How do I see deployment logs?"
→ Render: Service dashboard → Logs tab  
→ Vercel: Deployments → Click deployment → Logs

---

## ✅ FINAL CHECKLIST

Before sharing the app with users:

```
☐ Backend URL from Render (https://...)
☐ Frontend URL from Vercel (https://...)
☐ All environment variables set in both services
☐ CORS configured (FRONTEND_URL on Render)
☐ Email service tested and working
☐ Database connection verified
☐ Registration and login working
☐ No CORS errors in console
☐ No hardcoded localhost URLs
☐ HTTPS used everywhere
☐ Credentials stored securely (not in code)
```

---

**Last Updated:** February 2026  
**Bookmark this page for quick reference during deployment!**
