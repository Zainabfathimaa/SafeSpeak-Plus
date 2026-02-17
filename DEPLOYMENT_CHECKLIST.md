# 🎯 SAFESPEAK+ DEPLOYMENT CHECKLIST
## Complete Verification Before Going Live

---

## 📋 SECTION 1: CREDENTIALS & SECRETS ✓

### Generate/Gather All Required Secrets BEFORE Deployment

```
❌ JWT Secret (32+ characters)
   Where: From crypto generator
   Keep: VERY SAFE - Never share
   Use: RENDER environment variable
   
❌ MongoDB Connection String
   Where: MongoDB Atlas cloud account
   Keep: Store securely - contains credentials
   Use: RENDER environment variable
   
❌ Gmail App Password (16 characters)
   Where: https://myaccount.google.com/apppasswords
   Keep: Never commit to GitHub
   Use: RENDER environment variable
```

---

## 🔧 SECTION 2: ENVIRONMENT FILES ✓

### Backend Configuration

**File:** `backend/.env`
```
✓ NODE_ENV = production
✓ PORT = 5000 (Render manages this)
✓ MONGODB_URI = mongodb+srv://...
✓ JWT_SECRET = (32+ character secret)
✓ JWT_EXPIRE = 7d
✓ FRONTEND_URL = https://yourdomain.vercel.app
✓ ADDITIONAL_FRONTEND_ORIGINS = (preview URLs if any)
✓ SMTP_SERVICE = gmail
✓ SMTP_HOST = smtp.gmail.com
✓ SMTP_PORT = 587
✓ SMTP_SECURE = false
✓ SMTP_EMAIL = your-email@gmail.com
✓ SMTP_PASSWORD = (Gmail app password)
✓ APP_NAME = SafeSpeak-Plus
✓ APP_VERSION = 1.0.0
✓ BCRYPT_ROUNDS = 10
```

**File:** `backend/.env.example` (safe to commit)
```
✓ Contains all variable names
✓ No actual credentials
✓ Clear descriptions
✓ Helps new developers
```

### Frontend Configuration

**File:** `frontend/.env`
```
✓ VITE_BACKEND_URL = https://safespeak-plus-api.onrender.com/api
✓ VITE_ENVIRONMENT = production
```

**File:** `frontend/.env.example` (safe to commit)
```
✓ Contains variable names
✓ Example values shown
✓ Instructions for developer
```

**File:** `frontend/vercel.json`
```
✓ Rewrites configured for SPA
✓ All requests → index.html
```

---

## 🌐 SECTION 3: CODE VERIFICATION ✓

### Backend (`backend/server.js`)

- [ ] CORS uses `allowedOrigins` array (not `origin: true`)
- [ ] Environment variables read from `.env`
- [ ] Port from `process.env.PORT`
- [ ] Credentials NOT hardcoded in code
- [ ] All routes registered correctly
- [ ] Database connection handled

### Frontend (`frontend/src/services/authService.js`)

- [ ] Uses `import.meta.env.VITE_BACKEND_URL`
- [ ] API endpoint includes `/api` suffix
- [ ] No hardcoded localhost URLs
- [ ] Token management working
- [ ] Error handling present

### Frontend Components

- [ ] No `localhost:5000` hardcoded anywhere
- [ ] All API calls use authService
- [ ] Environment check done:
  ```bash
  # In frontend folder:
  grep -r "localhost:5000" src/
  # Should return: (nothing)
  
  grep -r "http://" src/
  # Should return: (nothing for hardcoded IPs)
  ```

---

## 📦 SECTION 4: DEPENDENCIES ✓

### Backend Requirements

**File:** `backend/package.json`
```json
{
  "name": "safespeak-plus-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "mongoose": "^7.x",
    "nodemailer": "^6.x",
    "bcrypt": "^5.x",
    "jsonwebtoken": "^9.x"
  }
}
```

Check:
- [ ] `"type": "module"` present (for ES6 imports)
- [ ] `"start"` script exists
- [ ] All required packages listed

### Frontend Requirements

**File:** `frontend/package.json`
```json
{
  "name": "safespeak-plus-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Check:
- [ ] `"build"` script defined
- [ ] Vite installed
- [ ] React installed
- [ ] All UI packages present

---

## 🔐 SECTION 5: SECURITY CHECKLIST ✓

### Code Security

- [ ] No sensitive data in code comments
- [ ] No credentials in variables or constants
- [ ] Password hashing using bcrypt
- [ ] JWT tokens signed with strong secret
- [ ] Rate limiting on sensitive endpoints (optional but recommended)
- [ ] Input validation on all endpoints
- [ ] CORS properly restricted
- [ ] HTTPS enforced in production

### File Security

- [ ] `.env` in `.gitignore` (not committed)
- [ ] `.env.example` committed instead
- [ ] No API keys in `package.json`
- [ ] No secrets in MongoDB connection strings visible in logs

### Database Security

- [ ] MongoDB Atlas IP whitelist configured
- [ ] Database user with minimal permissions
- [ ] Strong password for database user
- [ ] Connection string uses TLS

---

## 📡 SECTION 6: RENDER DEPLOYMENT ✓

### Pre-Deployment

- [ ] Repository pushed to GitHub
- [ ] `backend/package.json` has `"start"` script
- [ ] All environment variables noted
- [ ] MongoDB URI tested locally
- [ ] Email service tested locally

### Render Configuration

- [ ] Render account created
- [ ] New Web Service created
- [ ] GitHub repository connected
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Root directory: `/` (or set correctly)

### Environment Variables on Render

- [ ] All 13 variables set in Render dashboard
- [ ] Values double-checked for typos
- [ ] Secrets copied without spaces/extra chars
- [ ] `FRONTEND_URL` matches Vercel domain

### Post-Deployment

- [ ] Service shows "Live" status
- [ ] Logs show "✓ MongoDB Connected"
- [ ] No critical errors in logs
- [ ] Can curl: `https://safespeak-plus-api.onrender.com/api/health`

---

## 🚀 SECTION 7: VERCEL DEPLOYMENT ✓

### Pre-Deployment

- [ ] Frontend code pushed to GitHub
- [ ] `frontend/vite.config.js` configured
- [ ] `frontend/package.json` has `"build"` script
- [ ] `.env` contains correct backend URL
- [ ] No console errors locally: `npm run build`

### Vercel Configuration

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project imported
- [ ] Root directory set to `frontend/`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables on Vercel

- [ ] `VITE_BACKEND_URL` set correctly
- [ ] `VITE_ENVIRONMENT` set to `production`
- [ ] Variables set for all required environments

### Post-Deployment

- [ ] Deployment shows success
- [ ] Site loads at Vercel URL
- [ ] No console errors in browser DevTools
- [ ] API calls reach backend successfully

---

## 🔗 SECTION 8: INTEGRATION VERIFICATION ✓

### Frontend ↔ Backend Connection

Test each flow:

1. **Registration Flow**
   - [ ] User enters email on frontend
   - [ ] Request reaches Render backend
   - [ ] Email verification sent
   - [ ] No CORS errors

2. **Login Flow**
   - [ ] Credentials sent to backend
   - [ ] Token received and stored
   - [ ] Authenticated requests work
   - [ ] Dashboard loads

3. **Submit Report**
   - [ ] Report data sent to backend
   - [ ] Database receives data
   - [ ] Report ID returned
   - [ ] Frontend shows success

4. **File Upload**
   - [ ] Files sent to backend
   - [ ] Stored in cloud storage
   - [ ] References saved to DB
   - [ ] Admin can access

---

## 📊 SECTION 9: TESTING CHECKLIST ✓

### Browser Testing

- [ ] Chrome/Firefox/Safari - desktop
- [ ] Mobile Safari - iPad/iPhone
- [ ] Chrome Mobile - Android
- [ ] Responsive design works
- [ ] Touch interactions work

### Functionality Testing

- [ ] Registration process complete
- [ ] Login works with code
- [ ] Create report functional
- [ ] Upload evidence works
- [ ] Dashboard displays correctly
- [ ] Navigation works
- [ ] Logout removes token

### Error Handling

- [ ] Network error shows message
- [ ] Invalid credentials error shown
- [ ] File too large error handled
- [ ] Timeout errors managed
- [ ] Server down gracefully handled

### Performance

- [ ] Page loads in < 3 seconds
- [ ] API responses < 2 seconds
- [ ] Images optimized
- [ ] No memory leaks
- [ ] No infinite loops

---

## 📝 SECTION 10: DOCUMENTATION ✓

### Code Documentation

- [ ] README.md exists and complete
- [ ] API endpoints documented
- [ ] Component descriptions clear
- [ ] Setup instructions accurate

### Deployment Documentation

- [ ] RENDER_DEPLOYMENT_GUIDE.md complete
- [ ] VERCEL_DEPLOYMENT_GUIDE.md complete
- [ ] Environment variables explained
- [ ] Troubleshooting guide provided

---

## 🚨 SECTION 11: COMMON ISSUES & FIXES ✓

### Issue: CORS Errors

```
Error: "Access to XMLHttpRequest at 'https://api...' 
from origin 'https://yourdomain.vercel.app' 
has been blocked by CORS policy"

Fix:
1. Go to Render backend service
2. Find: Environment Variables
3. Update: FRONTEND_URL = https://yourdomain.vercel.app
4. Save (will redeploy)
5. Wait 1-2 minutes
6. Refresh browser and test
```

### Issue: API URL Undefined

```
Error: "VITE_BACKEND_URL is undefined"

Fix:
1. Check frontend/.env exists
2. Contains: VITE_BACKEND_URL=https://...
3. Run: npm run build (test build)
4. Push to GitHub
5. Vercel rebuilds with env vars
```

### Issue: Database Connection Failed

```
Error: "MongoDB Connection Failed"

Fix:
1. Check MongoDB Atlas IP whitelist includes Render IP
2. Or use: 0.0.0.0/0 (any IP - less secure but works)
3. Verify username:password in URI
4. Test URI locally before pushing
```

### Issue: Email Not Sending

```
Error: "Error sending email"

Fix:
1. Go to https://myaccount.google.com/apppasswords
2. Regenerate Gmail app password (16 chars)
3. Update on Render: SMTP_PASSWORD
4. Save and test again
5. Check Gmail spam folder
```

---

## ✅ FINAL CHECKLIST

Before declaring done:

```
CREDENTIALS
☐ JWT Secret generated and stored safely
☐ MongoDB URI obtained and tested
☐ Gmail App Password created

ENVIRONMENT
☐ backend/.env complete
☐ frontend/.env complete
☐ .env files NOT in git
☐ .env.example files in git

CODE
☐ No hardcoded URLs
☐ No exposed credentials
☐ CORS properly configured
☐ All imports use env variables

DEPLOYMENT
☐ Render service live
☐ Vercel site deployed
☐ Both show "Live" or "Ready"
☐ Logs show no critical errors

TESTING
☐ Frontend loads
☐ Backend responds
☐ Login/Register works
☐ API calls successful
☐ No browser errors

DOCUMENTATION
☐ Deployment guides complete
☐ README updated
☐ Team has credentials securely
☐ Future developers can follow
```

---

## 🎉 YOU'RE READY TO DEPLOY!

If all checkboxes are complete:
1. Share Vercel URL with stakeholders
2. Share backend URL internally
3. Monitor logs for 24 hours
4. Set up error monitoring (Sentry, etc.)
5. Share feedback and iterate

---

**Questions?** Refer to specific deployment guide or README.md
