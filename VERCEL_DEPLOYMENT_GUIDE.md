# 🚀 DEPLOYING SAFESPEAK+ FRONTEND TO VERCEL
## Complete Step-by-Step Guide

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before deploying, ensure you have:

- [ ] Created a Vercel account (free)
- [ ] Backend deployed to Render (have the URL)
- [ ] GitHub account with code pushed
- [ ] Environment variables prepared

---

## 🔑 STEP 1: PREPARE FRONTEND FOR DEPLOYMENT

### 1.1 Update Frontend Environment File
Create/update `.env` in the `frontend/` folder:

```dotenv
# Development
VITE_BACKEND_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development

# OR for production (after Render deployment):
VITE_BACKEND_URL=https://safespeak-plus-api.onrender.com/api
VITE_ENVIRONMENT=production
```

**Important:**
- `VITE_BACKEND_URL` = Your Render backend API URL + `/api`
- Example: `https://safespeak-plus-api.onrender.com/api`
- Do NOT include trailing slash

### 1.2 Check Vite Config
Ensure `frontend/vite.config.js` has React plugin:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 1.3 Check Build Output
Ensure `frontend/package.json` has correct scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🌐 STEP 2: DEPLOY TO VERCEL

### 2.1 Connect GitHub to Vercel
1. Go to https://vercel.com
2. Sign up / Login (use GitHub account)
3. Click "Import Project"
4. Paste your GitHub repository URL
5. Click "Continue"

### 2.2 Configure Vercel Project
When importing:

```
Project Name: safespeak-plus (or your choice)
Root Directory: frontend/ (IMPORTANT!)
Framework: Vite
Environment: Node
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.3 Set Environment Variables on Vercel
1. Click "Environment Variables" in Vercel settings
2. Add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_BACKEND_URL` | `https://safespeak-plus-api.onrender.com/api` | Production |
| `VITE_ENVIRONMENT` | `production` | Production |
| `VITE_BACKEND_URL` | `http://localhost:5000/api` | Development |
| `VITE_ENVIRONMENT` | `development` | Development |

**Note:** Use different values for Preview and Production environments

### 2.4 Deploy
Click "Deploy"
- Vercel builds and deploys automatically
- Wait for "Ready" status

---

## ✅ STEP 3: CONFIGURE BACKEND CORS

After getting your Vercel URL:

1. Go to Render dashboard (your backend service)
2. Click "Environment" 
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://yourdomain.vercel.app
   ```
4. Click "Save"
5. Service redeploys automatically

---

## 🧪 STEP 4: TEST DEPLOYMENT

### 4.1 Test Frontend
```bash
# Visit your Vercel URL
https://yourdomain.vercel.app

# Should see:
# - Landing page loads
# - No CORS errors in Console
# - Can navigate through app
```

### 4.2 Test API Calls
1. Open browser DevTools (F12)
2. Click "Console" tab
3. Try login - should make API call to Render backend
4. Check Network tab - should see successful API requests

### 4.3 Check for Errors
```bash
# Common errors in browser Console:
# 1. "Cannot find module" → rebuild frontend
# 2. "CORS policy" → check FRONTEND_URL on Render
# 3. "Failed to fetch" → check backend is running on Render
# 4. "Undefined variable" → check .env variables
```

---

## 🔐 SECURITY CHECKLIST

- [ ] Never commit `.env` file to GitHub
- [ ] Use `.env.example` for documentation
- [ ] All secrets in Vercel environment variables
- [ ] Backend uses HTTPS (Render provides this)
- [ ] CORS properly configured
- [ ] No hardcoded API URLs in code
- [ ] Use `import.meta.env.VITE_*` for frontend env vars

---

## 🏗️ PROJECT STRUCTURE VERIFICATION

```
safe-speak-plus/
├── backend/                    ← Deployed to Render
│   ├── package.json           ← Has "start" script
│   ├── server.js              ← Entry point
│   ├── .env.example           ← Documentation
│   └── ...
├── frontend/                   ← Deployed to Vercel
│   ├── vite.config.js         ← Vite configuration
│   ├── package.json           ← Build scripts correct
│   ├── .env                   ← Backend URL
│   ├── .env.example           ← Documentation
│   ├── src/
│   │   ├── services/
│   │   │   └── authService.js ← Uses VITE_BACKEND_URL
│   │   └── ...
│   └── index.html
└── README.md
```

---

## 🚀 PRODUCTION OPTIMIZATION

### 4.1 Enable Caching
In Vercel project settings:
- Cache: "Automatic"
- This caches static assets for faster loads

### 4.2 Image Optimization
In Vercel settings:
- Image Optimization: "Enabled"
- Reduces image file sizes automatically

### 4.3 Edge Middleware (Advanced)
Add edge middleware to:
- Redirect HTTP to HTTPS
- Add security headers
- Rate limiting

---

## ⚠️ TROUBLESHOOTING

### Issue: "Command failed: npm run build"
**Solution:**
```bash
# Check build errors:
# 1. Run locally: npm run build in frontend/
# 2. Fix any errors shown
# 3. Push to GitHub
# 4. Vercel rebuilds automatically
```

### Issue: "Cannot GET /"
**Solution:**
- Check Root Directory is set to `frontend/` in Vercel
- Check Build Command is `npm run build`
- Check Output Directory is `dist`

### Issue: "CORS policy: origin not allowed"
**Solution:**
1. Get your Vercel deployment URL (e.g., `https://safespeak-plus.vercel.app`)
2. Go to Render backend settings
3. Update `FRONTEND_URL` environment variable
4. Service redeploys

### Issue: "API requests failing"
**Checklist:**
- [ ] `VITE_BACKEND_URL` set in Vercel
- [ ] Backend is running on Render
- [ ] Backend CORS allows Vercel domain
- [ ] API endpoint exists on backend

### Issue: "White screen / blank page"
**Solutions:**
```bash
# 1. Open DevTools Console (F12 → Console)
# 2. Look for JavaScript errors
# 3. Check Network tab for failed requests
# 4. Verify VITE_BACKEND_URL in environment
# 5. Run locally to test: npm run dev in frontend/
```

---

## 📊 MONITORING & LOGS

### View Deployment Logs
1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments" tab
4. Click any deployment
5. See build and runtime logs

### View Frontend Errors
1. Open your deployed app
2. Press F12 → Console
3. See any JavaScript errors

### View Network Requests
1. Press F12 → Network tab
2. Reload page
3. See all API calls
4. Click on request to see details

---

## 🔄 CONTINUOUS DEPLOYMENT

After setup, your site updates automatically:

```
1. Make changes locally
2. git push origin main
3. GitHub receives push
4. Vercel automatically rebuilds
5. New version live in ~2 minutes
```

No manual deployment needed!

---

## 💰 PRICING (Vercel Free Tier)

| Limit | Value |
|-------|-------|
| Deployments | Unlimited |
| Bandwidth | 100 GB/month |
| Serverless Functions | 1000 invocations/day |
| CMS Integration | Included |
| Analytics | Included |

**Perfect for small to medium projects!**

---

## ✅ VERIFICATION CHECKLIST

After deployment:
- [ ] Frontend loads at Vercel URL
- [ ] No console errors
- [ ] API requests reach backend
- [ ] CORS errors resolved
- [ ] Login/registration work
- [ ] Images/assets load correctly
- [ ] Responsive design works on mobile
- [ ] Performance is acceptable

---

## 📝 COMMON FILE LOCATIONS

| Purpose | File | Location |
|---------|------|----------|
| Frontend config | vite.config.js | `frontend/` |
| Build output | dist/ | `frontend/dist/` |
| Environment | .env | `frontend/.env` |
| Auth service | authService.js | `frontend/src/services/` |
| Backend API | server.js | `backend/` |
| Backend config | .env | `backend/.env` |

---

## 🎯 NEXT STEPS

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ⏭️ Test both together
4. ⏭️ Update DNS (if using custom domain)
5. ⏭️ Share deployment URL with team

---

## 📞 NEED HELP?

- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev/
- **Environment Variables:** https://vercel.com/docs/projects/environment-variables
- **Troubleshooting:** https://vercel.com/support

---

**Previous Step:** See `RENDER_DEPLOYMENT_GUIDE.md` to deploy backend  
**Full Setup:** See `00_START_HERE.md`
