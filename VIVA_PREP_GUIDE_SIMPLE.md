# SafeSpeak+ Viva Preparation Guide (Very Simple English)

This guide is written like a teacher explaining to a beginner.

---

## 1) Aim of this project

SafeSpeak+ is a **safe online platform** where students/users can report incidents (like harassment, ragging, abuse, unsafe behavior) without fear.

Main aim:
- protect reporter identity,
- let admins handle cases in one place,
- provide status tracking,
- allow escalation and communication,
- build trust and safety culture.

---

## 2) Problem it solves

Old/manual systems have problems:
- People are scared to complain openly.
- Reports get lost or delayed.
- No transparent status updates.
- No central dashboard for admins.
- No analytics to identify risky areas.

SafeSpeak+ solves this by giving:
- anonymous code based login,
- secure report submission,
- report status tracking,
- admin workflow,
- story sharing and support,
- notifications and escalation PDF flow.

---

## 3) Full project flow (start to end)

1. User registers with email/password.
2. Backend creates account and anonymous code.
3. User logs in (students with anonymous code, admins with email/password).
4. Frontend stores JWT token.
5. User opens dashboard.
6. User creates incident report in 4-step wizard.
7. Backend saves report in MongoDB and notifies admin.
8. Admin opens admin dashboard and reviews reports.
9. Admin updates report status/risk/authenticity.
10. User checks status and sees updates.
11. User and admin can message in report thread.
12. If needed, user escalates case; system generates escalation PDF endpoint.
13. Users can also submit stories; admins approve/reject.
14. Analytics page shows totals, risk split, status split, department split.

---

## 4) Frontend explanation

Frontend is React + Vite + Tailwind.

What frontend does:
- Shows pages (login, register, dashboard, report wizard, admin pages).
- Protects private routes using `ProtectedRoute`.
- Calls backend APIs through service files.
- Stores token and user data in browser storage.
- Shows toasts (success/error messages).
- Handles role-based UI (user vs admin).

Important frontend structure:
- `src/App.jsx`: main routes.
- `src/pages/*`: screen pages.
- `src/components/*`: reusable UI blocks.
- `src/services/*`: API call layer.

---

## 5) Backend explanation

Backend is Node.js + Express + MongoDB (Mongoose).

What backend does:
- Starts API server (`server.js`).
- Connects to MongoDB.
- Handles authentication and JWT.
- Verifies user role (admin/user).
- Creates/reads/updates reports.
- Handles messages, stories, notifications, analytics.
- Handles report authenticity and escalation endpoints.

Core backend flow:
- Route file receives request.
- Middleware checks token.
- Controller runs business logic.
- Model reads/writes MongoDB.
- JSON response goes back to frontend.

---

## 6) Database explanation

Database used: **MongoDB** (NoSQL).

Main collections:
- `users`: account, role, anonymous code, preferences.
- `reports`: incident details, status, risk, flags, escalation details.
- `messages`: conversation per report.
- `notifications`: in-app alert records.
- `stories`: user stories and moderation status.
- `activitylogs`: user activity history.

Why MongoDB here:
- Flexible schema (easy to add fields like authenticity score, flags, consent).
- Works naturally with JSON APIs.
- Fast development with Mongoose.

---

## 7) Main folder and file explanation (simple)

## Root
- `package.json`: root scripts to install/build/start project.
- `README.md` and docs: project notes, setup, deployment documentation.

## Backend folder (`backend/`)

- `server.js`
  - Starts Express app, CORS, parsers, DB connection, all routes.
  - Connects every route file.

- `config/db.js`
  - MongoDB connection logic.

- `middleware/auth.js`
  - JWT token check (`authenticate`).
  - Role permission check (`authorize`).

- `models/User.js`
  - User schema + password hashing + anonymous code generator.

- `models/Report.js`
  - Report schema: details, status, risk, flags, authenticity, escalation fields.

- `models/Message.js`
  - Message schema for report-based chat.

- `models/Notification.js`
  - Notification schema for alerts and read/unread state.

- `models/Story.js`
  - Story schema for community stories and moderation.

- `models/ActivityLog.js`
  - Activity tracking (who did what).

- `controllers/authController.js`
  - Register/login/anonymous login/forgot code/change password/me.

- `controllers/reportController.js`
  - Create report, list report(s), update status, appeal, escalate, PDF endpoint.

- `controllers/messageController.js`
  - Conversation list, fetch messages, send message.

- `controllers/userController.js`
  - Profile, preferences, onboarding, consent, activity, admin user list.

- `controllers/storyController.js`
  - Submit story, approve/reject, like/comment/share/update/delete.

- `controllers/notificationController.js`
  - Get notifications, mark read, clear notifications.

- `controllers/analyticsController.js`
  - Dashboard metrics and chart data.

- `controllers/reportAuthenticityController.js`
  - Verify authenticity, set risk, flag suspicious, metrics.

- `routes/*.js`
  - URL map to controller functions.

- `utils/emailService.js`
  - Sends registration/anonymous code emails.

- `seed-roles.js`, `reset-admin.js`
  - Helper scripts for admin/role setup.

## Frontend folder (`frontend/`)

- `src/main.jsx`
  - React app entry point.

- `src/App.jsx`
  - App router and route protection wiring.

- `src/pages/*`
  - Full page screens (login/register/dashboard/admin/report/messages/stories/settings).

- `src/components/*`
  - UI building blocks.
  - Example: report wizard steps, admin table, sidebar, notification bell.

- `src/services/*`
  - API wrapper functions.
  - `authService.js` is central request helper.

- `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
  - Build and styling configuration.

- `frontend/vercel.json`
  - Frontend deployment routing settings.

---

## 8) Technologies used and why

- React
  - What: frontend library.
  - Why: component-based UI, fast and clean.
- Vite
  - What: dev/build tool.
  - Why: very fast startup and builds.
- Tailwind CSS
  - What: utility CSS framework.
  - Why: quick UI styling.
- React Router
  - What: page routing in single-page app.
  - Why: navigation without full reload.
- Node.js
  - What: JavaScript runtime on server.
  - Why: same language frontend+backend.
- Express
  - What: backend framework.
  - Why: simple API creation.
- MongoDB + Mongoose
  - What: NoSQL DB + ODM library.
  - Why: flexible document storage and schema validation.
- JWT
  - What: token-based authentication.
  - Why: stateless secure session.
- bcryptjs
  - What: password hashing.
  - Why: password safety.
- Nodemailer/SendGrid
  - What: email sending.
  - Why: send anonymous code and notifications.

---

## 9) Project architecture (simple)

Three-layer architecture:

1. Presentation layer (Frontend React)
   - UI and user actions.
2. Application layer (Backend Express)
   - Business rules and APIs.
3. Data layer (MongoDB)
   - Persistent storage.

Request path:
Frontend -> API Route -> Middleware -> Controller -> Model/DB -> Response -> Frontend UI update.

---

## 10) 30 probable viva questions + simple answers

1. Q: What is this project?  
   A: It is an anonymous incident reporting and management platform.
2. Q: Why did you build it?  
   A: To help users report safely without fear and improve admin response.
3. Q: Who uses it?  
   A: Students/users, admins, and moderators.
4. Q: Which stack is used?  
   A: MERN-style stack: React, Node, Express, MongoDB.
5. Q: How is login handled?  
   A: Backend generates JWT token after valid credentials.
6. Q: How is anonymity handled?  
   A: Users get anonymous code; identity is hidden unless consented.
7. Q: Why MongoDB?  
   A: Flexible data model for evolving report fields.
8. Q: What is role-based access?  
   A: Admin routes are restricted using middleware.
9. Q: Where is password security?  
   A: Passwords are hashed with bcrypt before DB save.
10. Q: What does `ProtectedRoute` do?  
    A: Prevents unauthenticated users from opening private pages.
11. Q: How do reports move in lifecycle?  
    A: Open -> review -> progress -> resolved/closed/escalated.
12. Q: How does admin see all reports?  
    A: Through `/api/reports` protected admin endpoint.
13. Q: Can user track own reports?  
    A: Yes, with `/api/reports/my-reports` and status UI.
14. Q: What is notification feature?  
    A: Users receive alerts for report/status/messages.
15. Q: What is stories module?  
    A: Community sharing module with admin moderation.
16. Q: How does chat work?  
    A: Report-linked message threads stored in `messages` collection.
17. Q: What is authenticity module?  
    A: Admin can verify/flag suspicious reports and set risk.
18. Q: What is analytics module?  
    A: Aggregates counts by risk, status, department.
19. Q: How is CORS handled?  
    A: Backend allows configured frontend origins.
20. Q: What happens if route is invalid?  
    A: Backend returns 404 JSON.
21. Q: How do you handle server errors?  
    A: Global error middleware sends controlled response.
22. Q: Why service files in frontend?  
    A: Keeps API code reusable and clean.
23. Q: How are environment secrets managed?  
    A: Through `.env` files (JWT secret, DB URI, etc.).
24. Q: How does escalation work?  
    A: Escalation endpoint updates report and provides PDF download path.
25. Q: What is activity log?  
    A: Tracks key user actions for history/audit.
26. Q: Can system support more roles later?  
    A: Yes, role checks are centralized and extendable.
27. Q: Which page is central in frontend?  
    A: `App.jsx` because it defines all routes.
28. Q: Which backend file is entry point?  
    A: `backend/server.js`.
29. Q: If DB fails, what happens?  
    A: Backend exits with error to avoid unstable state.
30. Q: One future improvement?  
    A: Add real-time sockets and file cloud storage.

---

## 11) Likely live modifications examiners may ask

1. Add new report status (e.g., "Under Legal Review")
- Update enum in `backend/models/Report.js`.
- Update admin status dropdown UI.
- Update any filter logic in frontend.

2. Add a new role (e.g., "counsellor")
- Add role in `User` model enum.
- Update auth/authorize checks.
- Add route/page access as needed.

3. Add search by report ID on admin page
- Frontend: add search input in admin dashboard/table.
- Backend: add query filter for reportId.

4. Add mandatory field in report form (e.g., witness info)
- Frontend: add input in wizard step and validation.
- Backend: store in report schema and createReport logic.

5. Make risk auto-calculation stricter
- Update report authenticity controller logic.

6. Add email notification when status changes
- In `updateReportStatus` controller, call email utility.

7. Add pagination in report list
- Backend: `limit/skip` in query.
- Frontend: page controls and calls with query params.

8. Add dark mode toggle
- Use appearance settings in user profile + Tailwind class switching.

9. Add attachment size/type validation
- Validate in report wizard and backend before save.

10. Add "export reports CSV" for admin
- New backend endpoint to generate CSV + frontend button.

---

## 12) If asked to design similar project from scratch

Simple answer structure:

1. Understand problem and users.
2. Write core features (auth, report, status, admin, notifications).
3. Draw simple architecture (frontend, backend, DB).
4. Design DB collections and fields.
5. Build backend APIs first.
6. Add auth and role security.
7. Build frontend pages and connect APIs.
8. Add validations and error handling.
9. Test module by module.
10. Deploy frontend and backend.
11. Monitor logs and improve.

---

## Module-wise explanation (you can speak in viva)

- Authentication module: register/login/anonymous login and JWT token.
- Report module: submit incident, track status, appeal/escalate.
- Admin module: view/filter reports, update statuses, review stories.
- Messaging module: secure conversation on report thread.
- Stories module: post and moderation workflow.
- Notification module: user alerts for important updates.
- Analytics module: visual counts for decisions.
- User settings module: profile, consent, onboarding, preferences.

---

## Technology-wise explanation (with alternatives + one disadvantage)

1. React
- What: UI library.
- Why used: reusable components.
- Alternative: Angular/Vue.
- Disadvantage: state handling can get complex.

2. Vite
- What: frontend build/dev tool.
- Why used: very fast dev server.
- Alternative: Webpack.
- Disadvantage: some legacy plugins may not be available.

3. Tailwind CSS
- What: utility class CSS framework.
- Why used: fast UI creation.
- Alternative: Bootstrap / plain CSS.
- Disadvantage: class names can look long.

4. Node.js
- What: server runtime.
- Why used: JS on backend too.
- Alternative: Python/Django, Java/Spring.
- Disadvantage: CPU-heavy work is less ideal.

5. Express
- What: backend API framework.
- Why used: lightweight and simple routes.
- Alternative: Fastify/NestJS.
- Disadvantage: needs manual structure for big apps.

6. MongoDB
- What: document database.
- Why used: flexible schema.
- Alternative: PostgreSQL/MySQL.
- Disadvantage: complex joins are harder than SQL.

7. Mongoose
- What: MongoDB object modeling tool.
- Why used: schema and validation.
- Alternative: native MongoDB driver.
- Disadvantage: some performance overhead.

8. JWT
- What: auth token.
- Why used: stateless session.
- Alternative: server session/cookies.
- Disadvantage: token revoke is harder without extra logic.

9. bcryptjs
- What: password hashing.
- Why used: secure password storage.
- Alternative: argon2.
- Disadvantage: hashing adds computation time.

10. Nodemailer/SendGrid
- What: email sender tools.
- Why used: send code/notifications.
- Alternative: Mailgun/AWS SES.
- Disadvantage: deliverability setup can be tricky.

---

## File-wise viva prep (main files)

For each file below:
- what it does,
- connection,
- tech used,
- common viva question,
- simple answer,
- likely modification.

### Backend core files

### `backend/server.js`
- Does: starts backend app and routes.
- Connects: db config + all route files.
- Tech: Express, CORS, dotenv.
- Viva Q: Why this is entry file?
- Simple A: It is the first file that builds and starts backend.
- Modify ask: add new route prefix.

### `backend/config/db.js`
- Does: connects to MongoDB.
- Connects: called by server.js.
- Tech: mongoose.
- Viva Q: What if DB fails?
- Simple A: app exits to avoid running in broken mode.
- Modify ask: change DB URI for cloud.

### `backend/middleware/auth.js`
- Does: checks JWT and role.
- Connects: used in protected routes.
- Tech: jsonwebtoken.
- Viva Q: How protected route works?
- Simple A: token is validated before controller runs.
- Modify ask: allow more roles in authorize.

### `backend/controllers/authController.js`
- Does: register/login/forgot code/anonymous login.
- Connects: auth routes + User model + email service.
- Tech: jwt, mongoose, email utility.
- Viva Q: How anonymous login works?
- Simple A: user enters anonymous code; backend finds matching user.
- Modify ask: enforce stronger password rules.

### `backend/controllers/reportController.js`
- Does: report CRUD/status/escalation.
- Connects: report routes + Report/User/Notification models.
- Tech: mongoose queries, business logic.
- Viva Q: How report ID generated?
- Simple A: it uses year + increasing number format.
- Modify ask: add new filter parameter.

### `backend/controllers/userController.js`
- Does: profile/settings/consent/onboarding/admin user reads.
- Connects: user routes + User and ActivityLog models.
- Tech: mongoose.
- Viva Q: Why preferences are here?
- Simple A: this module handles all user-level settings.
- Modify ask: add profile field.

### `backend/controllers/messageController.js`
- Does: conversation and messages per report.
- Connects: message routes + Message and Report models.
- Tech: aggregate queries.
- Viva Q: Why linked to report?
- Simple A: each case has separate secure conversation thread.
- Modify ask: add message attachment support.

### `backend/controllers/storyController.js`
- Does: stories submission and moderation flow.
- Connects: story routes + Story/User/Notification models.
- Tech: mongoose.
- Viva Q: How moderation is done?
- Simple A: admin changes story from pending to approved/rejected.
- Modify ask: add story category.

### `backend/controllers/notificationController.js`
- Does: read/unread/list/delete notifications.
- Connects: notification routes + Notification model.
- Tech: mongoose.
- Viva Q: Why separate notification collection?
- Simple A: to keep alerts searchable and manageable.
- Modify ask: add priority filter.

### `backend/controllers/analyticsController.js`
- Does: summary counts and grouped chart data.
- Connects: analytics route + Report/User model.
- Tech: MongoDB aggregation.
- Viva Q: What analytics gives?
- Simple A: total/open/resolved reports and risk/status/department splits.
- Modify ask: add monthly trend graph data.

### `backend/controllers/reportAuthenticityController.js`
- Does: verification and suspicious flag logic.
- Connects: authenticity routes + Report model.
- Tech: update/aggregate operations.
- Viva Q: Why authenticity needed?
- Simple A: helps admins detect suspicious or weak reports fairly.
- Modify ask: add new flag reason.

### Backend model files (`User`, `Report`, `Story`, `Message`, `Notification`, `ActivityLog`)
- Do: define data structure for each module.
- Connect: used by controllers for DB operations.
- Tech: mongoose schemas.
- Viva Q: What is schema?
- Simple A: schema is blueprint of what fields each record must have.
- Modify ask: add new field and default value.

### Frontend core files

### `frontend/src/main.jsx`
- Does: boots React app.
- Connects: loads `App.jsx`.
- Tech: ReactDOM.
- Q: Why needed?
- A: browser needs one root entry file to render app.
- Modify: wrap with global provider.

### `frontend/src/App.jsx`
- Does: route map + layout + protected pages.
- Connects: pages, navbar/footer, ProtectedRoute.
- Tech: react-router-dom.
- Q: Why central file?
- A: all navigation rules are defined here.
- Modify: add a new route.

### `frontend/src/components/ProtectedRoute.jsx`
- Does: checks login and role before entering page.
- Connects: uses authService and router navigation.
- Tech: React hooks.
- Q: What if user not logged in?
- A: redirects to login.
- Modify: add loader timeout/error message.

### `frontend/src/services/authService.js`
- Does: base API helper + auth API calls.
- Connects: called by login/register pages and others.
- Tech: fetch API.
- Q: Why service layer?
- A: keeps API logic in one place.
- Modify: add refresh-token function.

### `frontend/src/services/reportService.js`
- Does: report APIs (create, list, status update, escalate).
- Connects: NewReport, ReportStatus, Admin pages.
- Tech: fetch via makeRequest.
- Q: Why separate from auth service?
- A: each module has its own clear API file.
- Modify: add new endpoint call.

### Main pages

### `pages/LoginPage.jsx` and `RegisterPage.jsx`
- Do: user auth UI and submit forms.
- Connect: call authService.
- Tech: React forms.
- Q: Where token comes from?
- A: backend login response.
- Modify: add remember me option.

### `pages/UserDashboard.jsx`
- Does: user home with quick actions, stories, stats.
- Connects: reportService, storyService, userService.
- Tech: React state/effects.
- Q: How stats shown?
- A: fetch user reports and count statuses.
- Modify: add new dashboard card.

### `pages/NewReport.jsx`
- Does: 4-step report wizard and submission.
- Connects: step components + reportService.
- Tech: React state and form validation.
- Q: Why wizard?
- A: easy, less overwhelming input process.
- Modify: add one more step/field.

### `pages/ReportStatus.jsx` and `pages/UserReportDetail.jsx`
- Do: show report list/detail for user.
- Connect: reportService + status components.
- Tech: API + UI rendering.
- Q: How user sees only own reports?
- A: backend `/my-reports` uses logged-in user id.
- Modify: add sorting by date.

### `pages/Messages.jsx`
- Does: secure message page.
- Connects: messageService + chat components.
- Tech: React state + API calls.
- Q: How conversation is separated?
- A: by reportId thread.
- Modify: add unread badge.

### `pages/StoriesPage.jsx`
- Does: read and interact with approved stories.
- Connects: storyService + story components.
- Tech: React lists/modals.
- Q: Who approves stories?
- A: admin via story review panel.
- Modify: add story search filter.

### `pages/AdminDashboard.jsx`
- Does: admin report list, filters, stats, story review tab.
- Connects: reportService + admin components.
- Tech: React + table/filter logic.
- Q: Why filter panel?
- A: helps admin focus urgent cases quickly.
- Modify: add date range filter.

### `pages/Admin/*` (users, analytics, messages, settings, report detail)
- Do: admin management screens.
- Connect: userService, analyticsService, messageService.
- Tech: React + API.
- Q: How admin-only protection done?
- A: route uses `requiredRole="admin"`.
- Modify: add bulk actions.

### UI/common components

- Navbar/Footer/Header/Sidebar: navigation layout.
- DashboardCard/StatCard/ReportTable: reusable display blocks.
- ReportWizard steps: collect report data stage-by-stage.
- NotificationBell/Toast: user feedback.

Common viva answer for components:
- Q: Why make reusable components?
- A: less repeated code and easier updates.

---

## Quick speaking script for examiner (very simple)

"My project is SafeSpeak+, an anonymous incident reporting platform. Users can register and get an anonymous code. They can report incidents using a step-by-step form, track report status, and chat securely with admin without exposing identity. Admins can review reports, update status, mark risk and authenticity, and view analytics. The system is built with React frontend, Node/Express backend, and MongoDB database. Security is done using JWT token authentication, role-based access, and hashed passwords. The architecture is modular with routes, controllers, and models, so it is easy to maintain and extend." 

---

## Final viva tip

If you forget technical details, always explain:
- what user does,
- what backend does,
- what database stores,
- what result user sees.

This keeps your answer clear and confident.
