# 🔐 ENVIRONMENT VARIABLES CONFIGURATION GUIDE
## SafeSpeak+ Complete Setup Reference

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Backend Variables](#backend-variables)
3. [Frontend Variables](#frontend-variables)
4. [Getting Credentials](#getting-credentials)
5. [Security Best Practices](#security-best-practices)
6. [Deployment Environments](#deployment-environments)

---

## 🎯 OVERVIEW

Environment variables are configuration values that:
- Change between environments (dev, staging, production)
- Contain sensitive secrets (never commit to git)
- Are stored outside the code for security
- Are read by code using `process.env` (Node.js) or `import.meta.env` (Vite)

**Golden Rule:** Never hardcode secrets in your code!

---

## 🔧 BACKEND VARIABLES
### File: `backend/.env`

---

### 1️⃣ SERVER CONFIGURATION

#### `NODE_ENV`
```
Purpose:     Tell Node.js what environment we're in
Value:       "production" (on Render), "development" (local)
Where to set: .env (development), Render dashboard (production)
Impact:      Controls logging levels, error details, caching
```

#### `PORT`
```
Purpose:     Which port server listens on
Value:       5000 (development), auto (Render manages)
Where to set: .env (local only)
Impact:      http://localhost:5000 locally, Render handles at deployment
```

**Example:**
```
NODE_ENV=production
PORT=5000
```

---

### 2️⃣ DATABASE CONFIGURATION

#### `MONGODB_URI`
```
Purpose:     Connection string to MongoDB database
Format:      mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME
Where to get: MongoDB Atlas cloud dashboard

Steps to get:
1. Go to: https://cloud.mongodb.com
2. Create/login account
3. Create cluster (free tier available)
4. Click "Connect" → "Connect Your Application"
5. Copy connection string
6. Replace:
   - USERNAME: Your MongoDB user
   - PASSWORD: Your MongoDB user password
   - CLUSTER: Your cluster name (e.g., cluster0)
   - DATABASE_NAME: safespeak-plus

IMPORTANT:
- If password has @ or # symbols, URL encode them:
  @ becomes %40
  # becomes %23
- Test connection before deploying
```

**Example:**
```dotenv
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/safespeak-plus

# MongoDB Atlas (Cloud):
MONGODB_URI=mongodb+srv://safespeak_user:MySecurePass123@cluster0.abc123.mongodb.net/safespeak-plus?retryWrites=true&w=majority
```

**Testing Connection:**
```bash
# Test locally
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ Connected'))
  .catch(e => console.error('✗ Failed:', e.message));
"
```

---

### 3️⃣ JWT AUTHENTICATION

#### `JWT_SECRET`
```
Purpose:     Secret key to sign/verify JSON Web Tokens
Length:      MUST be at least 32 characters
Where to get: Generate randomly - NEVER reuse or guess

How to generate:
Option 1 - Using Node.js:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  
Option 2 - Using PowerShell (Windows):
  [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([guid]::NewGuid().ToString() + [guid]::NewGuid().ToString()))
  
Option 3 - Online generator:
  https://www.uuidgenerator.net/ (copy 2 UUIDs, remove hyphens)

Security:
- NEVER share this secret
- NEVER commit to git
- Only store in .env (local) and Render dashboard (production)
- If compromised, regenerate and update everywhere
```

#### `JWT_EXPIRE`
```
Purpose:     How long a JWT token is valid
Value:       Time format (e.g., "7d", "24h", "30d")
Where to set: .env and Render dashboard
Impact:      After expiration, user must login again

Common values:
- "1h"   = 1 hour (strict for sensitive apps)
- "7d"   = 7 days (default for most apps)
- "30d"  = 30 days (long-term for remember-me)
```

**Example:**
```dotenv
JWT_SECRET=a7b9c3d1e5f7g9h1i3k5l7m9n1o3p5r7s9t1u3v5w7x9y1z3a5b7c9d1e3
JWT_EXPIRE=7d
```

---

### 4️⃣ CORS CONFIGURATION

#### `FRONTEND_URL`
```
Purpose:     Tell backend which frontend domain is allowed
Value:       Full URL of your Vercel deployment
Where to get: Vercel dashboard after deploying frontend
Format:      https://domain.vercel.app (HTTPS, no trailing slash)

Local dev:
FRONTEND_URL=http://localhost:5173

Production:
FRONTEND_URL=https://safespeak-plus.vercel.app
```

#### `ADDITIONAL_FRONTEND_ORIGINS`
```
Purpose:     Extra frontend domains for preview/testing
Value:       Comma-separated list of URLs
Where to set: Vercel environment variables, Render dashboard
Example:     https://staging.vercel.app, https://preview.vercel.app

Why needed:
- Vercel creates preview URLs for each pull request
- These preview URLs need CORS access
- List them here to enable testing
```

**Example:**
```dotenv
# Production
FRONTEND_URL=https://safespeak-plus.vercel.app
ADDITIONAL_FRONTEND_ORIGINS=https://pr-123.vercel.app, https://staging.vercel.app

# Development
FRONTEND_URL=http://localhost:5173
ADDITIONAL_FRONTEND_ORIGINS=
```

---

### 5️⃣ EMAIL CONFIGURATION

#### Email Service Setup

**Which service to use:**
- **Gmail** (Recommended for small projects) ✓
- Office 365
- SendGrid
- AWS SES
- Mailgun

#### Gmail SMTP Configuration

```
Service:     gmail
Host:        smtp.gmail.com
Port:        587
Secure:      false (uses TLS, not SSL)
Encryption:  STARTTLS

Important: Enable "Less Secure Apps" or use App Password
- 2-Step verification MUST be enabled on Gmail
- Generate App Password (not your regular password)
```

#### `SMTP_SERVICE`
```
Purpose:     Email provider name
Value:       "gmail", "outlook", "sendgrid", etc.
Where to set: .env and Render dashboard
```

#### `SMTP_HOST` & `SMTP_PORT`
```
Purpose:     SMTP server address and port
Values:      Depends on provider

Gmail:
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_SECURE=false

Outlook:
  SMTP_HOST=smtp.office365.com
  SMTP_PORT=587
  SMTP_SECURE=false
```

#### `SMTP_EMAIL` (Sender Email)
```
Purpose:     Email address to send FROM
Value:       your-email@gmail.com
Where to set: .env and Render dashboard
Impact:      Users see this in email "From" field

Important:
- Must match Gmail account that generated App Password
- Verification emails will come from this address
```

#### `SMTP_PASSWORD` (App Password, NOT regular password)
```
Purpose:     Password to authenticate with email server
Value:       16 character app password (from Google)
Where to get: https://myaccount.google.com/apppasswords

Steps:
1. Go to: https://myaccount.google.com/apppasswords
2. Select: "Mail" and "Windows Computer"
3. Click: "Generate"
4. Google creates: xxxx xxxx xxxx xxxx (16 chars)
5. Copy: Without spaces = xxxxxxxxxxxxxxxx
6. Paste in .env and Render dashboard

CRITICAL:
- Use this generated password, NOT your Gmail password
- If 2-Step verification not enabled, this option won't appear
- If you don't see this option:
  1. Go to https://myaccount.google.com/security
  2. Enable "2-Step Verification"
  3. Then go back to apppasswords
```

**Gmail Setup Instructions:**

```
Step 1: Enable 2-Step Verification
- Go to: https://myaccount.google.com/security
- Click: "2-Step Verification"
- Follow prompts to enable

Step 2: Generate App Password
- Same page, find: "App passwords"
- Select: "Mail" and "Windows Computer"
- Click: "Generate"
- Copy the 16-character password

Step 3: Update .env
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=xxxxxxxxxxxxxxxx
```

**Example (with real Gmail):**
```dotenv
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=safespeak-admin@gmail.com
SMTP_PASSWORD=pfrjigcvfipnpfly
```

---

### 6️⃣ APPLICATION METADATA

#### `APP_NAME`
```
Purpose:     Application display name
Value:       "SafeSpeak-Plus"
Where to set: .env
Impact:      Used in emails, logs, about page
```

#### `APP_VERSION`
```
Purpose:     Current version for tracking
Value:       Semantic versioning (e.g., "1.0.0", "1.2.3")
Where to set: .env
Impact:      Helps identify which version users are on
```

#### `BCRYPT_ROUNDS`
```
Purpose:     Password encryption strength
Value:       10 (recommended)
Where to set: .env
Impact:      Higher = more secure but slower

Guidelines:
- 8  = Fast (mobile apps)
- 10 = Balanced (most apps) ✓
- 12 = Secure (high-security apps)

Note: Don't change after users exist
```

**Example:**
```dotenv
APP_NAME=SafeSpeak-Plus
APP_VERSION=1.0.0
BCRYPT_ROUNDS=10
```

---

## 📝 FRONTEND VARIABLES
### File: `frontend/.env`

---

### `VITE_BACKEND_URL`
```
Purpose:     URL of backend API
Format:      https://domain.com/api (HTTPS, no trailing slash)
Where to get: Render dashboard after deploying backend

Local development:
VITE_BACKEND_URL=http://localhost:5000/api

Production (after Render deployment):
VITE_BACKEND_URL=https://safespeak-plus-api.onrender.com/api

Why /api suffix:
- Your backend routes are: /api/auth/login, /api/auth/register
- AuthService adds this: `${API_BASE_URL}/auth/login`
- Final URL becomes: https://...onrender.com/api/auth/login
```

### `VITE_ENVIRONMENT`
```
Purpose:     Identify current environment
Value:       "development" | "staging" | "production"
Where to set: .env
Impact:      Can be used for feature flags, logging levels
```

**Example:**
```dotenv
# Development (local)
VITE_BACKEND_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development

# Production (after Render deployment)
VITE_BACKEND_URL=https://safespeak-plus-api.onrender.com/api
VITE_ENVIRONMENT=production
```

---

## 🔑 GETTING CREDENTIALS

### Checklist: Step-by-Step

```
☐ MongoDB Atlas Account
  URL: https://cloud.mongodb.com
  Action: Register → Create project → Create cluster
  Time: ~5 minutes
  Get: Connection URI with username/password

☐ Gmail App Password
  URL: https://myaccount.google.com/apppasswords
  Requires: 2-Step verification enabled
  Action: Select Mail + Windows Computer → Generate
  Time: ~2 minutes
  Get: 16 character password

☐ JWT Secret
  Action: Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  Time: 1 minute
  Get: 64 character random string

☐ Vercel Deployment (for FRONTEND_URL)
  URL: https://vercel.com
  Action: Import GitHub repo → Deploy
  Time: ~2 minutes
  Get: Domain like: safespeak-plus.vercel.app

☐ Render Deployment (for backend URL)
  URL: https://render.com
  Action: Create Web Service → Set env vars → Deploy
  Time: ~5 minutes
  Get: Domain like: safespeak-plus-api.onrender.com
```

---

## 🔐 SECURITY BEST PRACTICES

### DO ✓

```
✓ Store secrets in .env file
✓ Add .env to .gitignore
✓ Create .env.example for documentation
✓ Use strong random secrets (32+ characters)
✓ Rotate secrets if compromised
✓ Use HTTPS in production
✓ Keep secrets in Render/Vercel dashboards
✓ Different secrets for each environment
✓ Log rotate sensitive data in logs
```

### DON'T ✗

```
✗ Commit .env to GitHub
✗ Hardcode credentials in code
✗ Share secrets via email/chat
✗ Use same secret for multiple environments
✗ Log sensitive values to console
✗ Use weak/simple passwords
✗ Reuse old secrets
✗ Tell others your secrets
✗ Store secrets in code comments
```

### .gitignore Configuration

```
# backend/.gitignore
.env              ← Ignore actual secrets
!.env.example     ← Keep example file
node_modules/
dist/
*.log

# frontend/.gitignore
.env              ← Ignore actual secrets
.env.local        ← Local overrides
.env.*.local      ← Environment-specific
!.env.example     ← Keep example file
node_modules/
dist/
build/
```

---

## 🚀 DEPLOYMENT ENVIRONMENTS

### Comparison Table

| Config | Development | Staging | Production |
|--------|-------------|---------|-----------|
| **Node** | development | development/production | production |
| **Port** | 5000 | 5000 | Auto (Render) |
| **DB** | Local MongoDB | MongoDB Atlas | MongoDB Atlas |
| **JWT Expire** | 7d | 7d | 7d |
| **Logging** | Verbose | Moderate | Minimal |
| **CORS** | localhost:5173 | staging.vercel.app | domain.vercel.app |
| **API URL** | localhost:5000 | render-staging.com/api | render-prod.com/api |

---

## 📊 COMPLETE ENVIRONMENT FILES

### backend/.env (Development)

```dotenv
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/safespeak-plus

# JWT
JWT_SECRET=dev_secret_key_32_chars_minimum_required_for_security_key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
ADDITIONAL_FRONTEND_ORIGINS=

# Email
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your16charapppassword

# App
APP_NAME=SafeSpeak-Plus
APP_VERSION=1.0.0
BCRYPT_ROUNDS=10
```

### backend/.env (Production on Render)

Set these variables in Render dashboard:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/safespeak-plus
JWT_SECRET=prod_secret_key_minimum_32_characters_random_and_secure
JWT_EXPIRE=7d
FRONTEND_URL=https://safespeak-plus.vercel.app
ADDITIONAL_FRONTEND_ORIGINS=https://pr-*.vercel.app
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=safespeak-admin@gmail.com
SMTP_PASSWORD=gmail_app_password_16chars
APP_NAME=SafeSpeak-Plus
APP_VERSION=1.0.0
BCRYPT_ROUNDS=10
```

### frontend/.env (Development)

```dotenv
VITE_BACKEND_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development
```

### frontend/.env (Production on Vercel)

Set in Vercel Environment Variables:

```
VITE_BACKEND_URL=https://safespeak-plus-api.onrender.com/api
VITE_ENVIRONMENT=production
```

---

## ✅ VERIFICATION CHECKLIST

Before deployment, verify:

```
Backend (.env):
☐ NODE_ENV is "production"
☐ MONGODB_URI connects successfully
☐ JWT_SECRET is 32+ characters
☐ FRONTEND_URL matches Vercel domain
☐ Email credentials work
☐ All values without spaces/quotes

Frontend (.env):
☐ VITE_BACKEND_URL is correct Render URL
☐ No trailing slashes in URLs
☐ Backend URL includes /api suffix
☐ HTTPS used in production

.env Files:
☐ .env not in git (check .gitignore)
☐ .env.example in git with examples
☐ Credentials stored securely elsewhere
☐ No secrets in code comments
```

---

## 🆘 TROUBLESHOOTING

### "Cannot connect to database"
- Check MONGODB_URI is correct
- Verify username:password
- IP whitelist on MongoDB Atlas includes your Render IP

### "Email not sending"
- Gmail App Password matches (16 chars, no spaces)
- 2-Step verification enabled on Gmail
- SMTP credentials correct in .env

### "Frontend can't reach backend"
- VITE_BACKEND_URL set correctly
- No trailing slash in URL
- FRONTEND_URL on Render matches Vercel domain
- CORS allows frontend origin

### "JWT secret too short"
- Must be at least 32 characters
- Use generated random strings, not simple passwords

---

## 📚 ADDITIONAL RESOURCES

- [Node.js Environment Variables](https://nodejs.org/en/knowledge/file-system/how-to-use-the-os-module-in-nodejs/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Nodemailer Configuration](https://nodemailer.com/smtp/)
- [MongoDB Connection Strings](https://docs.mongodb.com/manual/connection-string/)
- [Gmail App Passwords Help](https://support.google.com/accounts/answer/185833)

---

**Last Updated:** February 2026  
**Version:** 1.0.0
