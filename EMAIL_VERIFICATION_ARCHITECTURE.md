# Email Verification - Visual Architecture & Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                           │
│                      (http://localhost:5174)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  RegisterPage.jsx → Shows registration form                      │
│       ↓                                                           │
│  User fills: email, password                                     │
│       ↓                                                           │
│  authService.registerUser() → POST /register                     │
│       ↓                                                           │
│  Success: Shows "Check Your Email! 📧"                           │
│       ↓                                                           │
│  User clicks email link: /verify-email?token=abc123              │
│       ↓                                                           │
│  VerificationPage.jsx loads                                      │
│       ↓                                                           │
│  authService.verifyEmail() → POST /verify-email                  │
│       ↓                                                           │
│  Shows anonymous code + "Go to Login"                            │
│       ↓                                                           │
│  LoginPage.jsx → User logs in with code or email                 │
│       ↓                                                           │
│  Redirects to: UserDashboard.jsx                                 │
│                                                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP Requests
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                       EXPRESS SERVER                             │
│                    (http://localhost:5000)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  authRoutes.js                                                   │
│  ├─ POST /register → authController.register()                  │
│  │   ├─ Validate email/password                                 │
│  │   ├─ Create user (isEmailVerified: false)                    │
│  │   ├─ Generate token (crypto.randomBytes(32))                 │
│  │   ├─ emailService.sendVerificationEmail()                    │
│  │   └─ Return: "Check your email"                              │
│  │                                                               │
│  ├─ POST /verify-email → authController.verifyEmail() [NEW]    │
│  │   ├─ Validate token (not expired)                            │
│  │   ├─ Mark isEmailVerified = true                             │
│  │   ├─ Generate anonymousCode                                  │
│  │   └─ Return: code                                            │
│  │                                                               │
│  └─ POST /login → authController.loginUser()                    │
│      └─ (existing functionality)                                │
│                                                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Database ops
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB ATLAS CLOUD                         │
│                   (safespeak-plus database)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  users collection:                                               │
│  ├─ _id: ObjectId                                               │
│  ├─ email: "user@example.com"                                   │
│  ├─ password: "$2b$10$hashed..." (bcryptjs)                     │
│  ├─ isEmailVerified: true/false                                 │
│  ├─ verificationToken: "abc123..." (before verification)        │
│  ├─ verificationTokenExpiry: Date (expires in 24h)              │
│  ├─ anonymousCode: "ABC-1234-DEF-5678" (after verification)     │
│  └─ createdAt: Date                                             │
│                                                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ SMTP
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      EMAIL PROVIDER                              │
│                  (Gmail, Outlook, etc.)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  emailService.js sends email:                                    │
│  ├─ To: user@example.com                                        │
│  ├─ From: safespeak-plus@gmail.com                              │
│  ├─ Subject: Verify Your SafeSpeak-Plus Account                 │
│  ├─ Body: HTML formatted email                                  │
│  │   ├─ Verification link: /verify-email?token=abc123...        │
│  │   ├─ SafeSpeak-Plus branding                                 │
│  │   └─ 24-hour expiry warning                                  │
│  └─ Returns: {success: true/false}                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Registration Flow Diagram

```
STEP 1: User Registers
┌─────────────────────────────────────────┐
│ User navigates to /register              │
│ Sees registration form                   │
│ Fills: email, password, confirm password │
│ Clicks: "Register Securely"              │
└────────────────┬────────────────────────┘
                 │
                 ▼
STEP 2: Backend Processes Registration
┌─────────────────────────────────────────┐
│ Validate inputs:                         │
│ ✓ Email format correct                  │
│ ✓ Passwords match                       │
│ ✓ Password length ≥ 6 chars              │
│                                          │
│ Check if email exists:                   │
│ ✓ Email not yet registered               │
│                                          │
│ Hash password with bcryptjs              │
│ Create user in MongoDB                   │
│ Set: isEmailVerified = false             │
│                                          │
│ Generate token:                          │
│ token = crypto.randomBytes(32).toString  │
│ (32 bytes = 64 hex characters)           │
│                                          │
│ Set expiry:                              │
│ expiry = now + 24 hours                  │
│                                          │
│ Save to user:                            │
│ user.verificationToken = token           │
│ user.verificationTokenExpiry = expiry    │
└────────────────┬────────────────────────┘
                 │
                 ▼
STEP 3: Send Email
┌─────────────────────────────────────────┐
│ emailService.sendVerificationEmail()     │
│                                          │
│ Creates nodemailer transporter:          │
│ service: Gmail/Outlook/etc               │
│ auth: SMTP_EMAIL & SMTP_PASSWORD         │
│                                          │
│ Creates email message:                   │
│ to: user@example.com                     │
│ from: safespeak-plus@gmail.com           │
│ subject: Verify Your SafeSpeak Account   │
│                                          │
│ HTML content:                            │
│ - SafeSpeak-Plus logo/branding           │
│ - Welcome message                        │
│ - "Click below to verify" button         │
│ - Link: /verify-email?token=abc123...    │
│ - Text version of link                   │
│ - 24-hour expiry warning                 │
│ - Footer with company info               │
│                                          │
│ Sends via SMTP provider                  │
│ Returns: {success: true, messageId}      │
└────────────────┬────────────────────────┘
                 │
                 ▼
STEP 4: Frontend Shows Success Message
┌─────────────────────────────────────────┐
│ RegisterPage.jsx success state:          │
│                                          │
│ Shows:                                   │
│ ✓ "Check Your Email! 📧"                 │
│ ✓ "We've sent a link to user@email.com" │
│ ✓ "What to do next:"                    │
│   1. Check your email inbox              │
│   2. Click the verification link         │
│   3. Your code will be displayed         │
│   4. Save your code and login            │
│ ✓ "Check spam/junk folder if needed"    │
│ ✓ Button: "Go to Login"                  │
│ ✓ Auto-redirect after 5 seconds          │
└─────────────────────────────────────────┘
```

---

## Email Verification Flow Diagram

```
STEP 5: User Receives Email
┌─────────────────────────────────────────┐
│ User checks email inbox                  │
│ Sees email from: safespeak-plus          │
│ Subject: Verify Your SafeSpeak Account   │
│                                          │
│ Email contains:                          │
│ - SafeSpeak-Plus branding                │
│ - Verification button/link               │
│ - Text: "http://localhost:5174/verify... │
│   ?token=abc123def456...xyz789"          │
│ - "This link expires in 24 hours"        │
└────────────────┬────────────────────────┘
                 │
                 ▼
STEP 6: User Clicks Verification Link
┌─────────────────────────────────────────┐
│ User clicks link in email                │
│ OR copies link and pastes in browser     │
│                                          │
│ Browser navigates to:                    │
│ /verify-email?token=abc123...            │
│                                          │
│ VerificationPage.jsx loads               │
│ useEffect() hook fires:                  │
│ 1. Extract token from URL                │
│ 2. Validate token exists                 │
│ 3. Call verifyEmail(token)               │
│ 4. Set status = 'loading'                │
└────────────────┬────────────────────────┘
                 │
                 ▼
STEP 7: Frontend Verifies Token
┌─────────────────────────────────────────┐
│ authService.verifyEmail(token):          │
│                                          │
│ Makes HTTP POST request:                 │
│ URL: /api/auth/verify-email              │
│ Body: {token: "abc123..."}               │
│                                          │
│ Frontend shows:                          │
│ - Loading spinner                        │
│ - Text: "Verifying Email..."             │
│ - Please wait...                         │
└────────────────┬────────────────────────┘
                 │
                 ▼
STEP 8: Backend Verifies Token
┌─────────────────────────────────────────┐
│ authController.verifyEmail():            │
│                                          │
│ 1. Get token from request body           │
│ 2. Query MongoDB:                        │
│    Find user where:                      │
│    - verificationToken == token          │
│    - verificationTokenExpiry > now       │
│                                          │
│ 3. If user not found:                    │
│    Return 400: "Invalid token"           │
│                                          │
│ 4. If token expired:                     │
│    Return 400: "Token expired"           │
│                                          │
│ 5. If valid:                             │
│    - Set isEmailVerified = true          │
│    - Clear verificationToken = null      │
│    - Clear verificationTokenExpiry=null  │
│    - Generate anonymousCode              │
│    - Save user to MongoDB                │
│    - Return: {success, code}             │
└────────────────┬────────────────────────┘
                 │
                 ▼
STEP 9: Frontend Shows Success
┌─────────────────────────────────────────┐
│ VerificationPage.jsx success state:      │
│                                          │
│ Shows:                                   │
│ ✓ Green checkmark icon                   │
│ ✓ "Email Verified!"                      │
│ ✓ "Email verified successfully!"         │
│ ✓ Code display box:                      │
│   "Your Access Code (Keep this safe!)"   │
│   [ABC-1234-DEF-5678] [Copy]             │
│ ✓ "Save this code. You'll need it."     │
│ ✓ Info: "How to login: Use code above"   │
│ ✓ Button: "Go to Login"                  │
│                                          │
│ User can:                                │
│ - Click Copy button (copies code)        │
│ - Click "Go to Login" (redirects)        │
│ - Manually write down code               │
└────────────────┬────────────────────────┘
                 │
                 ▼
STEP 10: User Logs In
┌─────────────────────────────────────────┐
│ LoginPage.jsx:                           │
│                                          │
│ User has two login options:              │
│                                          │
│ Option A - Login with Email:             │
│ - Email field: user@example.com          │
│ - Password field: Test@1234              │
│ - Button: "Sign in with Email"           │
│                                          │
│ Option B - Login with Code:              │
│ - Code field: ABC-1234-DEF-5678          │
│ - Button: "Sign in with Code"            │
│                                          │
│ User chooses Option B (code):            │
│ - Pastes code from clipboard             │
│ - Clicks "Sign in with Code"             │
│ - authService.anonymousLogin(code)       │
│                                          │
│ Backend validates code and returns JWT   │
│ Frontend saves JWT to localStorage       │
│ Frontend redirects to /dashboard         │
└────────────────┬────────────────────────┘
                 │
                 ▼
STEP 11: User Accesses Dashboard
┌─────────────────────────────────────────┐
│ UserDashboard.jsx loads                  │
│                                          │
│ Protected route checks JWT token         │
│ ✓ Token valid → Dashboard loads          │
│ ✗ Token invalid → Redirect to /login     │
│                                          │
│ Dashboard shows:                         │
│ ✓ "Welcome back!"                        │
│ ✓ User's email (optional display)        │
│ ✓ Report filing form                     │
│ ✓ Report list                            │
│                                          │
│ All reports are anonymous:               │
│ ✓ No email shown in reports              │
│ ✓ Only identified by code                │
│ ✓ Only user can access their reports     │
└─────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Data Structure During Registration

```
BEFORE REGISTRATION:
├─ User: Not in database
└─ Email: Not registered

DURING REGISTRATION:
├─ User submitted:
│  ├─ email: "john@example.com"
│  ├─ password: "Test@1234"
│  └─ confirmPassword: "Test@1234"
│
├─ Backend creates:
│  ├─ email: "john@example.com"
│  ├─ password: "$2b$10$hashed..." (bcryptjs)
│  ├─ isEmailVerified: false
│  ├─ verificationToken: "a1b2c3d4e5f6..." (32 bytes)
│  ├─ verificationTokenExpiry: 2024-01-17T12:30:00 (24h from now)
│  ├─ anonymousCode: null (NOT generated yet)
│  └─ createdAt: 2024-01-16T12:30:00
│
└─ Email sent with:
   └─ Link: /verify-email?token=a1b2c3d4e5f6...

AFTER VERIFICATION:
└─ User updated:
   ├─ isEmailVerified: true (CHANGED)
   ├─ verificationToken: null (CLEARED)
   ├─ verificationTokenExpiry: null (CLEARED)
   ├─ anonymousCode: "ABC-1234-DEF-5678" (GENERATED)
   └─ Other fields: unchanged
```

---

## State Machine Diagram

```
                    ┌──────────────────────┐
                    │ USER REGISTRATION    │
                    └─────────┬────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ EMAIL NOT VERIFIED   │
                    │ token: exists        │
                    │ code: null           │
                    └─────────┬────────────┘
                              │
                    ┌─────────┴──────────┐
                    │ User clicks email  │
                    │ link               │
                    ▼                    │
          ┌──────────────────────┐      │
          │ EMAIL VERIFYING      │      │
          │ (checking token)     │      │
          └──────┬───────────────┘      │
                 │                      │
         ┌───────┴────────┐             │
         │ Token valid?   │             │
         └───┬────────┬───┘             │
             │        │                 │
          YES│        │NO               │
             ▼        ▼                 │
      ┌──────────┐   │                  │
      │ VERIFIED │   │                  │
      │ code:gen │   │                  │
      └──────────┘   │                  │
                     │ Token invalid/   │
                     │ expired          │
                     ▼                  │
              ┌────────────────────┐    │
              │ ERROR: Retry or    │────┘
              │ Register again     │
              └────────────────────┘

Final states:
├─ ✓ VERIFIED (isEmailVerified: true, code exists)
│  └─ User can login
│
└─ ✗ ERROR (isEmailVerified: false, code doesn't exist)
   └─ User must register again
```

---

## Error Handling Flow

```
REGISTRATION ERRORS:
├─ Invalid email format
│  └─ Response: 400 "Invalid email"
├─ Password too short (< 6 chars)
│  └─ Response: 400 "Password too short"
├─ Passwords don't match
│  └─ Response: 400 "Passwords don't match"
├─ Email already registered
│  └─ Response: 400 "Email already registered"
└─ Email send fails
   └─ Action: Delete user account (cleanup)
      Response: 500 "Registration failed"

VERIFICATION ERRORS:
├─ No token in request
│  └─ Response: 400 "No token provided"
├─ Token not found in database
│  └─ Response: 400 "Invalid token"
├─ Token expired (> 24 hours)
│  └─ Response: 400 "Token expired"
├─ Token already used
│  └─ Response: 400 "Token already used"
└─ Server error
   └─ Response: 500 "Verification failed"

LOGIN ERRORS:
├─ Invalid credentials
│  └─ Response: 401 "Invalid credentials"
├─ Email not verified
│  └─ Response: 401 "Email not verified"
└─ Invalid code
   └─ Response: 400 "Invalid code"
```

---

## API Response Examples

### POST /register Success
```json
{
  "success": true,
  "message": "Registration successful. Check your email for verification.",
  "user": {
    "email": "john@example.com",
    "isEmailVerified": false
  }
}
```

### POST /register Error
```json
{
  "success": false,
  "message": "Email already registered",
  "code": "EMAIL_ALREADY_REGISTERED"
}
```

### POST /verify-email Success
```json
{
  "success": true,
  "message": "Email verified successfully!",
  "anonymousCode": "ABC-1234-DEF-5678",
  "user": {
    "email": "john@example.com",
    "isEmailVerified": true
  }
}
```

### POST /verify-email Error
```json
{
  "success": false,
  "message": "Token expired. Please register again.",
  "code": "TOKEN_EXPIRED"
}
```

---

## Timeline Diagram

```
TIME         EVENT                          STATUS
────────────────────────────────────────────────────
T+0s    → User registers                   [PENDING]
        → Backend creates user
        → Backend generates token
        → Backend sends email
        
T+0-2s  → Email in transit                 [PENDING]
        → User sees: "Check your email"
        
T+2-60s → User receives email              [EMAIL RECEIVED]
        → Email shows verification link
        
T+1min  → User clicks link                 [VERIFYING]
        → Frontend shows "Verifying..."
        
T+1min → Backend validates token           [VERIFIED]
        → User receives code
        
T+1min+ → User logs in with code           [AUTHENTICATED]
        → User accesses dashboard
        
T+24h   → Token expires                    [EXPIRED]
        → User can't use old link
        → User must register again
```

---

## Technology Stack

```
FRONTEND (Client-Side)
├─ React 18
├─ React Router (for /verify-email route)
├─ Tailwind CSS (styling)
└─ Fetch API (HTTP requests)

BACKEND (Server-Side)
├─ Node.js
├─ Express.js
├─ bcryptjs (password hashing)
├─ jsonwebtoken (JWT for login)
├─ nodemailer (email sending)
├─ MongoDB (database)
└─ mongoose (ODM)

EMAIL PROVIDER
├─ Gmail
├─ Outlook
├─ SendGrid (optional)
└─ Custom SMTP (optional)

DATABASE
└─ MongoDB Atlas (cloud)
   └─ Collection: users
      ├─ Stores: emails, passwords, codes, tokens
      └─ Queries: Find user by token, by email, by code
```

---

## Summary

The email verification system creates a secure, user-friendly flow that:

1. ✅ **Ensures Legitimacy** - Only real email owners can register
2. ✅ **Maintains Anonymity** - Reports use codes, not emails
3. ✅ **Provides Security** - Tokens expire, are random, single-use
4. ✅ **Great UX** - Clear steps, helpful messages, copy-to-clipboard
5. ✅ **Scalable** - Can grow from small to large deployments
6. ✅ **Reliable** - Error handling for all scenarios

**Status: READY FOR TESTING** 🚀
