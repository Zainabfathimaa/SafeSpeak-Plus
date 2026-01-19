# 🚀 Frontend Integration Guide - Connecting to Backend

## 📌 Overview

Now that we have a working backend, we need to update the frontend to:
1. Send registration data to backend API
2. Send login data to backend API
3. Store JWT token after login
4. Use token for authenticated requests

---

## 🔄 How Frontend-Backend Communication Works

### Before (Current - No Backend)
```
Frontend Form → JavaScript → console.log() → Nothing Happens
```

### After (With Backend)
```
Frontend Form → JavaScript → HTTP Request → Backend API → Database → Response → Token → Store Token
```

---

## 📝 STEP 1: Update LoginPage.jsx

### What We're Changing:
- Replace `navigate('/dashboard')` with API call
- Send email/password to backend
- Store token from response
- Handle errors properly

### Location:
`frontend/src/pages/LoginPage.jsx`

### Changes Required:
1. Import `useState` for managing API state
2. Create function to call backend login API
3. Store token in localStorage
4. Add error/loading states

---

## 📝 STEP 2: Update RegisterPage.jsx

### What We're Changing:
- Replace simulation with real API call
- Send email/password to backend
- Display returned anonymous code
- Handle errors

### Location:
`frontend/src/pages/RegisterPage.jsx`

### Changes Required:
1. Call backend register API
2. Display anonymous code from response
3. Show error if email already exists
4. Show success message with code

---

## 📝 STEP 3: Create API Service File

### What This Does:
- Centralized place for all API calls
- Easy to change backend URL later
- Reusable across multiple components
- Better error handling

### Location:
`frontend/src/services/authService.js`

### This File Will Have:
```javascript
- registerUser(email, password)
- loginUser(email, password)
- anonymousLogin(code)
- getCurrentUser()
- logout()
```

---

## 🔐 LocalStorage & Tokens

### What is localStorage?
- Browser's local storage (persists across page refresh)
- Stores data as key-value pairs
- Only JavaScript can access it

### What We Store:
```javascript
localStorage.setItem('token', 'eyJhbGci...');
```

### How We Retrieve:
```javascript
const token = localStorage.getItem('token');
```

### When Making Authenticated Requests:
```javascript
fetch(url, {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
```

---

## 🛠️ Implementation Details

### Error Handling:
```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();
  
  if (!response.ok) {
    // Handle error
    throw new Error(data.message);
  }
  
  return data;
} catch (error) {
  // Display error to user
  console.error(error);
}
```

### Loading States:
```javascript
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setLoading(true);
  try {
    // API call
  } finally {
    setLoading(false);
  }
};
```

### Token Refresh:
```javascript
// Check if token exists and is valid
const token = localStorage.getItem('token');
if (token) {
  // User is logged in
  navigate('/dashboard');
} else {
  // User is not logged in
  navigate('/login');
}
```

---

## 📋 Checklist Before Testing

- [ ] Backend server running (`npm run dev` in backend folder)
- [ ] Frontend server running (`npm run dev` in frontend folder)
- [ ] MongoDB running (for database)
- [ ] All backend files created
- [ ] All npm packages installed
- [ ] Frontend files updated with API calls
- [ ] CORS enabled in backend
- [ ] JWT token stored in localStorage

---

## 🧪 Testing the Connection

### Method 1: Using Postman
1. Download Postman
2. Create POST request to `http://localhost:5000/api/auth/register`
3. Add JSON body: `{"email":"test@college.edu","password":"Test123"}`
4. Send and check response

### Method 2: Using curl (Terminal)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@college.edu","password":"Test123"}'
```

### Method 3: Using Frontend
1. Go to register page
2. Fill form
3. Click Register
4. Check browser console for messages
5. Check Network tab to see API request/response

---

## 🔍 Debugging Tips

### Check Backend Logs:
- Look at terminal where backend is running
- Should see request logs
- Should show errors if any

### Check Frontend Logs:
- Open Browser DevTools (F12)
- Click Console tab
- Look for console.log messages
- Check for error messages

### Check Network:
- Open DevTools (F12)
- Click Network tab
- Make request
- Click on request to see details
- Check Headers, Payload, Response

### Common Errors:
- **CORS Error**: Backend CORS not configured
- **404 Not Found**: Wrong API URL
- **500 Server Error**: Backend error (check backend logs)
- **Network Error**: Backend not running

---

## 📚 Key Concepts

| Concept | Explanation |
|---------|-------------|
| **API** | Interface to communicate with backend |
| **Endpoint** | URL that does something (/api/auth/login) |
| **Request** | Data sent to API |
| **Response** | Data received from API |
| **Token** | Authentication proof |
| **localStorage** | Browser's local storage |
| **Headers** | Metadata about request |
| **CORS** | Allows cross-origin requests |
| **async/await** | Wait for API response |

---

## 🚀 After Frontend Updates

### The Flow Will Be:
1. User opens app → check if token in localStorage
2. If token exists → show dashboard
3. If no token → show login page
4. User fills login form → send to backend
5. Backend validates → returns token
6. Frontend stores token → redirects to dashboard
7. Dashboard requests data → includes token in header
8. Backend verifies token → returns user data

---

*Continue to next step when ready to update frontend files*
