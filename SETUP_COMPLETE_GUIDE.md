# 🚀 Quick Start: Git & MongoDB Atlas Setup

## 🎉 Your Git is Fixed!

Your changes **ARE being tracked**. Git just needed to be re-added to Windows PATH.

### Quick Command to Use Git from Now On

Add this to the top of your PowerShell script or terminal startup:

```powershell
$env:Path += ";C:\Program Files\Git\bin"
```

Or permanently add to Windows:
1. Right-click **This PC** → Properties
2. Advanced system settings
3. Environment Variables
4. Under "System variables", find/create "Path"
5. Add: `C:\Program Files\Git\bin`
6. Restart PowerShell

---

## 🌐 MongoDB Atlas Setup - Quick Version

### 1️⃣ Create Account (5 min)
- Go: https://www.mongodb.com/cloud/atlas/register
- Sign up with **Google** (fastest) or email
- Verify your email

### 2️⃣ Create Cluster (5 min)
- Click "Create a Cluster"
- Select **AWS** (default)
- Choose your region (closest to you)
- Wait 1-3 minutes for creation
- ✅ Cluster created!

### 3️⃣ Create Database User (2 min)
- Go to **Database Access** (left menu)
- Click **"Add New Database User"**
- Username: `safespeak_user`
- Password: `YourPassword123!` (make it strong)
- Privilege: "Read and write to any database"
- Click **"Add User"**

### 4️⃣ Add Your IP (1 min)
- Go to **Network Access** (left menu)
- Click **"Add IP Address"**
- Select **"Add Current IP Address"**
- Click **"Confirm"**

### 5️⃣ Get Connection String (1 min)
- Go to your **Cluster**
- Click **"Connect"**
- Select **"Connect your application"**
- Choose **Node.js** 4.1+
- Copy the connection string

### 6️⃣ Update Your .env (1 min)

Open `backend/.env` and change:

```bash
# BEFORE (Local MongoDB)
MONGODB_URI=mongodb://localhost:27017/safespeak-plus

# AFTER (MongoDB Atlas - REPLACE WITH YOUR VALUES)
MONGODB_URI=mongodb+srv://safespeak_user:YourPassword123!@cluster0.xxxxx.mongodb.net/safespeak-plus?retryWrites=true&w=majority
```

**Replace these values with YOUR data:**
- `safespeak_user` → your database username
- `YourPassword123!` → your database password
- `cluster0.xxxxx.mongodb.net` → your cluster address

### 7️⃣ Test Connection (2 min)

```bash
cd backend
npm run dev
```

**Success:**
```
✓ Server running on port 5000
✓ MongoDB connected
```

**Error?** Check:
- ✓ Connection string is correct
- ✓ Username/password matches
- ✓ Your IP is in Network Access
- ✓ Cluster is fully created (wait 1-3 min)

---

## 📝 Your Connection String Explained

```
mongodb+srv://safespeak_user:YourPassword123!@cluster0.abcde.mongodb.net/safespeak-plus?retryWrites=true&w=majority
                ↓                                  ↓                          ↓
            Username:Password              Cluster Address            Database Name
```

---

## ✅ Commit Your Changes (Git)

Once MongoDB Atlas is working:

```bash
cd C:\capstone-project\safe-speak
$env:Path += ";C:\Program Files\Git\bin"

# See your changes
git status

# Save all changes
git add .

# Create commit with message
git commit -m "Add MongoDB Atlas and complete backend setup"

# Done! ✓
git status
```

---

## 🎯 What's Next?

1. **✅ Git Fixed** - Changes tracked
2. **✅ MongoDB Atlas** - Cloud database ready
3. **✅ Backend Connected** - Using real database
4. **Now:** Start your app!

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Browser: http://localhost:5173
```

---

## 📚 Full Guides Available

- **MONGODB_ATLAS_SETUP.md** - Complete MongoDB Atlas tutorial with screenshots
- **GIT_EXPLAINED.md** - Full git explanation and troubleshooting
- **QUICK_START_GUIDE.md** - Complete setup guide
- **BACKEND_SETUP_NOTES.md** - Backend code explanation

---

## 🆘 Common Issues & Fixes

### "git is not recognized"
✅ **Fix:** Run `$env:Path += ";C:\Program Files\Git\bin"`

### "Authentication failed (13)"
✅ **Fix:** Check username/password in connection string

### "connect ENOTFOUND cluster0..."
✅ **Fix:** Wrong connection string - copy again from Atlas

### "IP not allowed"
✅ **Fix:** Add your IP in Network Access section

### "Cannot find module bcryptjs"
✅ **Fix:** Run `npm install` in backend folder

---

## 💡 Pro Tips

- ✅ Keep `.env` secret (don't commit!)
- ✅ Commit frequently with clear messages
- ✅ MongoDB Atlas is free for 512MB
- ✅ Always use strong passwords
- ✅ Test connection before deploying

---

**Everything set up? Start coding!** 🚀

Next: Open **QUICK_START_GUIDE.md** for complete walkthrough.
