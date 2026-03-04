# 🚀 GitHub → Vercel Deployment Checklist

## Step 1: Push to GitHub
```bash
git add .
git commit -m "SafeSpeak+ ready for deployment"
git push origin main
```

## Step 2: Deploy Backend to Render (Skip if already deployed)
- Go to: https://dashboard.render.com
- Create New → Web Service
- Connect your GitHub repo
- Deploy as Node.js service
- Get your Render URL (e.g., https://safespeak-plus-api.onrender.com)

## Step 3: Deploy Frontend to Vercel
1. Go to: https://vercel.com
2. Click "New Project"
3. Select GitHub repo: `safe-speak`
4. Framework Preset: `React`
5. Root Directory: `frontend`
6. Build Command: `npm run build`
7. Install Command: `npm install`

## Step 4: Set Environment Variables in Vercel
In Vercel Project Settings → Environment Variables:
```
VITE_BACKEND_URL=https://safespeak-plus-api.onrender.com/api
```

## Step 5: Update Backend .env on Render
Once Vercel gives you your production URL (e.g., `https://safespeak-plus-abc123.vercel.app`):

1. Go to Render dashboard
2. Select your backend service
3. Go to Environment
4. Update `FRONTEND_URL`:
```
FRONTEND_URL=https://safespeak-plus-abc123.vercel.app
```
5. **Important**: Redeploy the backend service after updating .env

## Step 6: Test
1. Go to your Vercel URL
2. Register with @cmr.edu.in email ✓
3. Login with anonymous code ✓
4. Submit report ✓
5. Check Messages ✓

## 📝 CORS Details
- **Local Dev**: Uses http://localhost:5173 (auto-allowed)
- **Vercel**: Uses *.vercel.app wildcard + FRONTEND_URL
- **Render Backend**: Already configured to accept Vercel requests

## 🔄 Update Workflow
When you push new changes:
1. Push to GitHub: `git push origin main`
2. Vercel auto-deploys frontend
3. If backend changes: Push to backend repo, Render auto-deploys
4. No manual CORS configuration needed (already wildcard configured)

## ⚠️ Important Notes
- NEVER commit `.env` files to GitHub
- `.env.example` should be committed (for reference)
- Render environment variables override `.env` file
- Vercel environment variables set at deploy time
- Frontend needs `VITE_BACKEND_URL` pointing to Render backend
- Backend needs `FRONTEND_URL` for CORS verification

## ✅ Verification Checklist
- [ ] GitHub repo pushed
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Vercel has VITE_BACKEND_URL set
- [ ] Render .env has correct FRONTEND_URL
- [ ] Render backend redeployed after .env update
- [ ] Registration works on Vercel
- [ ] Email verification works
- [ ] Admin dashboard loads on Vercel
