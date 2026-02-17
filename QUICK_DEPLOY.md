# ⚡ SAFESPEAK+ DEPLOYMENT QUICK START
## 5 Steps to Production (15-30 minutes)

---

## 🎯 WHAT YOU NEED (GATHER FIRST - 10 MIN)

### 1. **JWT Secret** (32+ character random string)
```bash
# Copy output from:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. **MongoDB Atlas URI** (from https://cloud.mongodb.com)
```
Format: mongodb+srv://username:password@cluster.mongodb.net/safespeak-plus
```

### 3. **Gmail App Password** (from myaccount.google.com/apppasswords)
```
Format: 16 characters (xxxxxxxxxxxxxxxx)
Note: Requires 2-Step verification enabled on Gmail
```

---

## 🚀 DEPLOY BACKEND (5 MIN)

### A) Push to GitHub
```bash
cd backend
git add .
git commit -m "Deploy to Render"
git push origin main
```

### B) Create Render Service
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Select your GitHub repository
4. Configure:
   - **Name:** safespeak-plus-api
   - **Environment:** Node
   - **Build:** `npm install`
   - **Start:** `npm start`

### C) Add Environment Variables on Render
Copy these variables to Render dashboard:

```
NODE_ENV                    production
MONGODB_URI                 (your MongoDB URI with credentials)
JWT_SECRET                  (your generated JWT secret)
JWT_EXPIRE                  7d
FRONTEND_URL                (leave blank for now, update later)
ADDITIONAL_FRONTEND_ORIGINS (leave blank)
SMTP_SERVICE                gmail
SMTP_HOST                   smtp.gmail.com
SMTP_PORT                   587
SMTP_SECURE                 false
SMTP_EMAIL                  your-email@gmail.com
SMTP_PASSWORD               (your 16-char Gmail app password)
BCRYPT_ROUNDS               10
```

### D) Wait for "Live" Status
- Click Deploy
- Wait 3-5 minutes
- Status should show "Live" with a green dot
- Copy your backend URL: `https://safespeak-plus-api.onrender.com`

---

## 🎨 DEPLOY FRONTEND (5 MIN)

### A) Push to GitHub
```bash
cd frontend
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### B) Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure:
   - **Root Directory:** `frontend/`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### C) Add Environment Variable
In Vercel (Production environment):
```
VITE_BACKEND_URL    https://safespeak-plus-api.onrender.com/api
VITE_ENVIRONMENT    production
```

### D) Wait for "Ready"
- Click Deploy
- Wait 2-3 minutes
- Status should show "Ready"
- Copy your frontend URL: `https://yourdomain.vercel.app`

---

## 🔄 LINK BACKEND & FRONTEND (1 MIN)

### Update Render Backend with Frontend URL

1. Go to Render dashboard
2. Select your backend service
3. Click "Environment"
4. Update `FRONTEND_URL` to: `https://yourdomain.vercel.app` (your Vercel URL)
5. Save (service redeploys ~1 min)

---

## ✅ TEST EVERYTHING (2 MIN)

### Test Backend
```bash
curl https://safespeak-plus-api.onrender.com/api/auth/health
# Should return: {"success": true, "message": "Server is running"}
```

### Test Frontend
- Visit https://yourdomain.vercel.app
- Open DevTools (F12)
- Check Console tab for errors
- Try registering with test email

---

## 📋 URLS YOU'LL HAVE

| Service | URL | Where |
|---------|-----|-------|
| Frontend (User Access) | https://yourdomain.vercel.app | Share with users |
| Backend API | https://safespeak-plus-api.onrender.com/api | Use in frontend env var |
| Render Dashboard | https://render.com/dashboard | Monitor logs |
| Vercel Dashboard | https://vercel.com/dashboard | Monitor deployments |

---

## 🐛 QUICK FIXES IF SOMETHING BREAKS

### "CORS origin not allowed"
→ Update `FRONTEND_URL` on Render with correct Vercel domain

### "Cannot connect to database"
→ Verify MongoDB URI and IP whitelist in MongoDB Atlas

### "Email not sending"
→ Verify Gmail App Password (16 chars, no spaces) and 2-Step enabled

### "API returns 404"
→ Check `VITE_BACKEND_URL` includes `/api` suffix

### API shows 500 error
→ Check Render logs: Dashboard → Select service → Logs tab

---

## ⏱️ TIMELINE ESTIMATE

| Step | Time | Status |
|------|------|--------|
| Gather Credentials | 5 min | ⏳ |
| Deploy Backend | 10 min | ⏳ |
| Deploy Frontend | 10 min | ⏳ |
| Link & Test | 5 min | ⏳ |
| **TOTAL** | **30 min** | **🎉** |

---

## 📚 NEED MORE HELP?

- **Full Render Guide:** See `RENDER_DEPLOYMENT_GUIDE.md`
- **Full Vercel Guide:** See `VERCEL_DEPLOYMENT_GUIDE.md`
- **Troubleshooting:** See `DEPLOYMENT_CHECKLIST.md`
- **Environment Vars:** See `ENVIRONMENT_VARIABLES_GUIDE.md`

---

**That's it! Your app is now live! 🎉**
