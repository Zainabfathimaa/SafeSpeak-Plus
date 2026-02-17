# 🚀 DEPLOYING SAFESPEAK+ BACKEND TO RENDER
## Complete Step-by-Step Guide

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before deploying, ensure you have:

- [ ] Created a GitHub account and pushed your code
- [ ] Created a MongoDB Atlas account (free tier is fine)
- [ ] Created a Gmail App Password (for email verification)
- [ ] Generated a strong JWT secret
- [ ] Your Vercel frontend URL ready

---

## 🔑 STEP 1: PREPARE SECRETS & CREDENTIALS

### 1.1 Generate JWT Secret
```bash
# Windows PowerShell:
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([guid]::NewGuid().ToString() + [guid]::NewGuid().ToString())) | Write-Host

# Or use:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.2 Get MongoDB Connection String (MongoDB Atlas)
1. Go to https://cloud.mongodb.com
2. Create/login to your account
3. Create a cluster (free tier)
4. Click "Connect" → "Connect Your Application"
5. Copy the connection string
6. Replace:
   - `<username>` with your DB user
   - `<password>` with DB user password
7. Final format:
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/safespeak-plus?retryWrites=true&w=majority
   ```

### 1.3 Get Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Google generates 16 characters: `xxxx xxxx xxxx xxxx`
4. Copy without spaces: `xxxxxxxxxxxxxxxx`

---

## 🌐 STEP 2: CREATE RENDER BACKEND SERVICE

### 2.1 Create New Service on Render
1. Go to https://render.com
2. Sign up / Login
3. Click "New +" → "Web Service"
4. Choose "Deploy an existing repository"
5. Connect your GitHub account
6. Select your `safe-speak-plus` repository
7. Configure:
   ```
   Name: safespeak-plus-api (or your choice)
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free (for testing) or Starter (production recommended)
   ```

### 2.2 Verify Build Command
Ensure your `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 🔐 STEP 3: SET ENVIRONMENT VARIABLES ON RENDER

After creating the service:

1. Go to your Render service dashboard
2. Click "Environment"
3. Add each variable:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Tell Node.js this is production |
| `PORT` | `5000` | Render will assign automatically |
| `MONGODB_URI` | `mongodb+srv://...` | From MongoDB Atlas |
| `JWT_SECRET` | `Your generated secret` | **Must be at least 32 chars** |
| `JWT_EXPIRE` | `7d` | Token expiration |
| `FRONTEND_URL` | `https://yourdomain.vercel.app` | Your Vercel frontend URL |
| `ADDITIONAL_FRONTEND_ORIGINS` | (leave empty or add preview URLs) | For staging/preview |
| `SMTP_SERVICE` | `gmail` | Email service provider |
| `SMTP_HOST` | `smtp.gmail.com` | Gmail SMTP server |
| `SMTP_PORT` | `587` | Standard TLS port |
| `SMTP_SECURE` | `false` | Use TLS, not SSL |
| `SMTP_EMAIL` | `your-email@gmail.com` | Sender email |
| `SMTP_PASSWORD` | `xxxxxxxxxxxxxxxx` | Gmail app password (16 chars) |
| `APP_NAME` | `SafeSpeak-Plus` | Application name |
| `APP_VERSION` | `1.0.0` | Current version |
| `BCRYPT_ROUNDS` | `10` | Password encryption strength |

---

## 📝 STEP 4: DEPLOY & TEST

### 4.1 Deploy
1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. Render auto-deploys when you push
3. Check deployment status on Render dashboard
4. Wait for "Live" status

### 4.2 Get Your Backend URL
Once deployed:
- Your API URL will be: `https://safespeak-plus-api.onrender.com` (Render generates this)
- Copy this URL

### 4.3 Test Backend
```bash
# Test if server is running
curl https://safespeak-plus-api.onrender.com/api/auth/health

# Should return:
# { "success": true, "message": "Server is running" }
```

---

## ⚠️ TROUBLESHOOTING

### Issue: "Cannot find module"
**Solution:**
```bash
# Make sure package.json is in backend/ folder
# Render runs: npm install in the repo root
# If your backend/ is a subfolder, you need:
# 1. Move backend/package.json dependencies to root package.json, OR
# 2. Create a custom build command in Render
```

### Issue: "MongoDB Connection Failed"
**Check:**
- [ ] Correct username and password in MONGODB_URI
- [ ] Your IP is whitelisted in MongoDB Atlas (Network Access)
- [ ] Database name exists in MongoDB

### Issue: "Email not sending"
**Check:**
- [ ] Gmail App Password is correct (16 chars, no spaces)
- [ ] 2-Step verification is enabled on Gmail
- [ ] SMTP credentials are correct

### Issue: "CORS policy error"
**Solution:**
- Set `FRONTEND_URL` environment variable to your Vercel domain
- Example: `https://yourapp.vercel.app`

---

## 🔄 UPDATING YOUR BACKEND

After deployment, to update:
```bash
# Push changes to GitHub
git add .
git commit -m "Update: description of changes"
git push origin main

# Render automatically redeploys
# Check status on Render dashboard
```

---

## 💰 PRICING & LIMITS (Render Free Tier)

| Limit | Value |
|-------|-------|
| Monthly hours | 750 (24/7 for ~31 days) |
| Auto-sleep | After 15 min inactivity |
| Restart on activity | Cold start ~30 seconds |
| Bandwidth | 100 GB/month |

**Recommendation:** Use Pro plan (~$7/month) for production to avoid sleeps.

---

## ✅ VERIFICATION CHECKLIST

After deployment:
- [ ] API server is running ("Live" badge on Render)
- [ ] Environment variables are set correctly
- [ ] MongoDB can connect (check logs for "✓ MongoDB Connected")
- [ ] CORS allows Vercel frontend domain
- [ ] Email service configured correctly
- [ ] Backend URL is https:// (not http://)
- [ ] Update frontend `//.env` with backend URL

---

## 📞 NEED HELP?

- **Render Docs:** https://render.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/
- **Gmail App Password:** https://support.google.com/accounts/answer/185833
- **SMTP Configuration:** https://nodemailer.com/smtp/

---

**Next Step:** See `VERCEL_DEPLOYMENT_GUIDE.md` to deploy frontend
