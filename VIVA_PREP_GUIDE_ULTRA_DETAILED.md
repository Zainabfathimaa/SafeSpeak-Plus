# SafeSpeak+ Ultra Detailed Viva Guide (Explain Like a Beginner)

This version is **very detailed** and includes **file-by-file explanation** for the project codebase (excluding third-party `node_modules`).

## Quick 2-minute opening you can say in viva

SafeSpeak+ is a web system where users can report incidents safely, track updates, and talk with admins. Admins can review cases, set risk, verify authenticity, and monitor analytics. Frontend is React, backend is Node/Express, and database is MongoDB. Security uses JWT login, hashed passwords, and role-based route protection.

## 1) Project aim
- Build a safe anonymous reporting platform.
- Reduce fear in reporting.
- Improve transparency for users and speed for admins.

## 2) Problem solved
- Manual complaint process is slow and unclear.
- Reporter identity fear reduces real complaints.
- No centralized analytics in old process.

## 3) End-to-end flow
1. Register -> anonymous code generated.
2. Login (anonymous code for users, email/password for admins).
3. User creates report via wizard.
4. Backend stores report and notifies admins.
5. Admin reviews, updates status/risk/authenticity.
6. User tracks report and communicates via messages.
7. Escalation and PDF path available when needed.

## 4) Architecture (simple)
Frontend (React pages/components) -> Backend API (Routes -> Controllers -> Models) -> MongoDB collections.

## 5) Technology-wise explanation (what/why/alternative/disadvantage)
- React: UI library; used for reusable screens; alternative Vue/Angular; disadvantage: state can become complex.
- Vite: fast build tool; used for quick dev startup; alternative Webpack; disadvantage: plugin differences in older setups.
- Node+Express: backend API; used for simple JS server; alternative Django/Spring; disadvantage: needs manual structure.
- MongoDB+Mongoose: document DB + schema layer; used for flexibility; alternative PostgreSQL; disadvantage: joins are harder than SQL.
- JWT: token auth; used for stateless login; alternative server session; disadvantage: revoke flow needs extra handling.
- bcryptjs: password hash; used for security; alternative argon2; disadvantage: adds compute time.

## 6) 30 probable viva questions with simple answers
1. What is SafeSpeak+? -> Anonymous incident reporting platform.
2. Why built? -> Safer complaint process with tracking.
3. Who uses it? -> Users and admins.
4. Which stack? -> React, Node, Express, MongoDB.
5. Auth type? -> JWT token authentication.
6. Password safety? -> Hashed with bcrypt.
7. Why MongoDB? -> Flexible report fields.
8. Role control? -> Middleware checks roles.
9. Route protection? -> ProtectedRoute + backend auth middleware.
10. Report lifecycle? -> Open to resolved/escalated states.
11. User report tracking? -> My reports endpoint and status page.
12. Messaging model? -> Report-based threads.
13. Story module? -> User stories with admin moderation.
14. Notification module? -> In-app updates and read/unread.
15. Analytics purpose? -> Dashboard totals and breakdowns.
16. CORS use? -> Allow frontend-backend communication.
17. Why controller layer? -> Keep business logic separate.
18. Why service layer frontend? -> Central API logic.
19. DB connection file role? -> Single place for Mongo config.
20. What if token invalid? -> 401 response.
21. How admin routes protected? -> `authorize('admin')`.
22. Why report authenticity? -> Detect suspicious/low-confidence reports.
23. What is escalation? -> Raise case to higher authority with PDF path.
24. What is activity log? -> Auditable user actions.
25. Why modular architecture? -> Easier maintenance and testing.
26. How to add new status? -> Update model enum + UI filters.
27. How to add new role? -> Update model + middleware checks + routes/UI.
28. How to add search? -> Backend query + frontend input filter.
29. One limitation? -> Real-time sockets not fully used.
30. One future enhancement? -> Cloud file storage + AI triage.

## 7) Likely live viva modifications + how
- Add status: edit `backend/models/Report.js` enum and frontend filter options.
- Add role: edit `backend/models/User.js`, auth authorize checks, protected routes.
- Add report search: query in reports controller, search box in admin page.
- Add required field in report form: add input in `NewReport` + schema field + controller save.
- Add export CSV: new backend endpoint + admin button.

---

## 8) File-by-file explanation (every project file that matters)

### `package.json`
1. **What this file does:** Dependency and script configuration.
2. **How it connects to other files:** Used by npm/build tools.
3. **Technology used here:** npm/Node config.
4. **Common viva question:** Why package.json needed?
5. **Simple answer you can say:** It tells which libraries and scripts project uses.
6. **Modification examiner may ask:** Add script or dependency version update.

### `package-lock.json`
1. **What this file does:** Dependency and script configuration.
2. **How it connects to other files:** Used by npm/build tools.
3. **Technology used here:** npm/Node config.
4. **Common viva question:** Why package.json needed?
5. **Simple answer you can say:** It tells which libraries and scripts project uses.
6. **Modification examiner may ask:** Add script or dependency version update.

### `README.md`
1. **What this file does:** Project documentation.
2. **How it connects to other files:** Read by developers/examiners.
3. **Technology used here:** Markdown.
4. **Common viva question:** Why maintain docs?
5. **Simple answer you can say:** Docs help setup, learning, and maintenance.
6. **Modification examiner may ask:** Update instructions/screenshots/examples.

### `VIVA_PREP_GUIDE_SIMPLE.md`
1. **What this file does:** Project documentation.
2. **How it connects to other files:** Read by developers/examiners.
3. **Technology used here:** Markdown.
4. **Common viva question:** Why maintain docs?
5. **Simple answer you can say:** Docs help setup, learning, and maintenance.
6. **Modification examiner may ask:** Update instructions/screenshots/examples.

### `backend/.env.example`
1. **What this file does:** Project file.
2. **How it connects to other files:** Connected to app flow.
3. **Technology used here:** Project tech stack.
4. **Common viva question:** What is this file for?
5. **Simple answer you can say:** It supports one part of the project.
6. **Modification examiner may ask:** Small enhancement as requested.

### `backend/.gitignore`
1. **What this file does:** Project file.
2. **How it connects to other files:** Connected to app flow.
3. **Technology used here:** Project tech stack.
4. **Common viva question:** What is this file for?
5. **Simple answer you can say:** It supports one part of the project.
6. **Modification examiner may ask:** Small enhancement as requested.

### `backend/config/db.js`
1. **What this file does:** Connects backend to MongoDB.
2. **How it connects to other files:** Called by server.js.
3. **Technology used here:** Mongoose.
4. **Common viva question:** What happens if DB connection fails?
5. **Simple answer you can say:** Server exits so app does not run in broken state.
6. **Modification examiner may ask:** Switch local DB URI to cloud URI.

### `backend/controllers/analyticsController.js`
1. **What this file does:** Handles analytics business logic.
2. **How it connects to other files:** Called by route files, uses models.
3. **Technology used here:** Node.js + Express + Mongoose.
4. **Common viva question:** Why separate controller from route?
5. **Simple answer you can say:** Route is URL map, controller is actual logic.
6. **Modification examiner may ask:** Add validation or one new API behavior.

### `backend/controllers/authController.js`
1. **What this file does:** Handles auth business logic.
2. **How it connects to other files:** Called by route files, uses models.
3. **Technology used here:** Node.js + Express + Mongoose.
4. **Common viva question:** Why separate controller from route?
5. **Simple answer you can say:** Route is URL map, controller is actual logic.
6. **Modification examiner may ask:** Add validation or one new API behavior.

### `backend/controllers/messageController.js`
1. **What this file does:** Handles message business logic.
2. **How it connects to other files:** Called by route files, uses models.
3. **Technology used here:** Node.js + Express + Mongoose.
4. **Common viva question:** Why separate controller from route?
5. **Simple answer you can say:** Route is URL map, controller is actual logic.
6. **Modification examiner may ask:** Add validation or one new API behavior.

### `backend/controllers/notificationController.js`
1. **What this file does:** Handles notification business logic.
2. **How it connects to other files:** Called by route files, uses models.
3. **Technology used here:** Node.js + Express + Mongoose.
4. **Common viva question:** Why separate controller from route?
5. **Simple answer you can say:** Route is URL map, controller is actual logic.
6. **Modification examiner may ask:** Add validation or one new API behavior.

### `backend/controllers/reportAuthenticityController.js`
1. **What this file does:** Handles reportAuthenticity business logic.
2. **How it connects to other files:** Called by route files, uses models.
3. **Technology used here:** Node.js + Express + Mongoose.
4. **Common viva question:** Why separate controller from route?
5. **Simple answer you can say:** Route is URL map, controller is actual logic.
6. **Modification examiner may ask:** Add validation or one new API behavior.

### `backend/controllers/reportController.js`
1. **What this file does:** Handles report business logic.
2. **How it connects to other files:** Called by route files, uses models.
3. **Technology used here:** Node.js + Express + Mongoose.
4. **Common viva question:** Why separate controller from route?
5. **Simple answer you can say:** Route is URL map, controller is actual logic.
6. **Modification examiner may ask:** Add validation or one new API behavior.

### `backend/controllers/storyController.js`
1. **What this file does:** Handles story business logic.
2. **How it connects to other files:** Called by route files, uses models.
3. **Technology used here:** Node.js + Express + Mongoose.
4. **Common viva question:** Why separate controller from route?
5. **Simple answer you can say:** Route is URL map, controller is actual logic.
6. **Modification examiner may ask:** Add validation or one new API behavior.

### `backend/controllers/userController.js`
1. **What this file does:** Handles user business logic.
2. **How it connects to other files:** Called by route files, uses models.
3. **Technology used here:** Node.js + Express + Mongoose.
4. **Common viva question:** Why separate controller from route?
5. **Simple answer you can say:** Route is URL map, controller is actual logic.
6. **Modification examiner may ask:** Add validation or one new API behavior.

### `backend/middleware/auth.js`
1. **What this file does:** Checks JWT token and user role.
2. **How it connects to other files:** Used by protected routes.
3. **Technology used here:** jsonwebtoken.
4. **Common viva question:** How do protected routes work?
5. **Simple answer you can say:** Token is verified before controller runs.
6. **Modification examiner may ask:** Add support for one more role.

### `backend/models/ActivityLog.js`
1. **What this file does:** Defines ActivityLog collection schema.
2. **How it connects to other files:** Used by related controllers.
3. **Technology used here:** Mongoose schema/model.
4. **Common viva question:** What is schema?
5. **Simple answer you can say:** Schema is a blueprint of database fields.
6. **Modification examiner may ask:** Add one field/default/index.

### `backend/models/Message.js`
1. **What this file does:** Defines Message collection schema.
2. **How it connects to other files:** Used by related controllers.
3. **Technology used here:** Mongoose schema/model.
4. **Common viva question:** What is schema?
5. **Simple answer you can say:** Schema is a blueprint of database fields.
6. **Modification examiner may ask:** Add one field/default/index.

### `backend/models/Notification.js`
1. **What this file does:** Defines Notification collection schema.
2. **How it connects to other files:** Used by related controllers.
3. **Technology used here:** Mongoose schema/model.
4. **Common viva question:** What is schema?
5. **Simple answer you can say:** Schema is a blueprint of database fields.
6. **Modification examiner may ask:** Add one field/default/index.

### `backend/models/Report.js`
1. **What this file does:** Defines incident report structure.
2. **How it connects to other files:** Used by report, analytics, authenticity controllers.
3. **Technology used here:** Mongoose.
4. **Common viva question:** How do you track report status?
5. **Simple answer you can say:** Status enum field stores lifecycle state.
6. **Modification examiner may ask:** Add new status like Under Legal Review.

### `backend/models/Story.js`
1. **What this file does:** Defines Story collection schema.
2. **How it connects to other files:** Used by related controllers.
3. **Technology used here:** Mongoose schema/model.
4. **Common viva question:** What is schema?
5. **Simple answer you can say:** Schema is a blueprint of database fields.
6. **Modification examiner may ask:** Add one field/default/index.

### `backend/models/User.js`
1. **What this file does:** Defines user data and password hashing.
2. **How it connects to other files:** Used by auth/user/report controllers.
3. **Technology used here:** Mongoose + bcryptjs.
4. **Common viva question:** How is password secured?
5. **Simple answer you can say:** Password is hashed before save.
6. **Modification examiner may ask:** Add a new user field like year/semester.

### `backend/package-lock.json`
1. **What this file does:** Dependency and script configuration.
2. **How it connects to other files:** Used by npm/build tools.
3. **Technology used here:** npm/Node config.
4. **Common viva question:** Why package.json needed?
5. **Simple answer you can say:** It tells which libraries and scripts project uses.
6. **Modification examiner may ask:** Add script or dependency version update.

### `backend/package.json`
1. **What this file does:** Dependency and script configuration.
2. **How it connects to other files:** Used by npm/build tools.
3. **Technology used here:** npm/Node config.
4. **Common viva question:** Why package.json needed?
5. **Simple answer you can say:** It tells which libraries and scripts project uses.
6. **Modification examiner may ask:** Add script or dependency version update.

### `backend/reset-admin.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

### `backend/routes/analyticsRoutes.js`
1. **What this file does:** Maps URL paths to controller functions.
2. **How it connects to other files:** Calls controller files and auth middleware.
3. **Technology used here:** Express Router.
4. **Common viva question:** What is a route file?
5. **Simple answer you can say:** It connects URL endpoints to backend functions.
6. **Modification examiner may ask:** Add new endpoint mapping.

### `backend/routes/authRoutes.js`
1. **What this file does:** Maps URL paths to controller functions.
2. **How it connects to other files:** Calls controller files and auth middleware.
3. **Technology used here:** Express Router.
4. **Common viva question:** What is a route file?
5. **Simple answer you can say:** It connects URL endpoints to backend functions.
6. **Modification examiner may ask:** Add new endpoint mapping.

### `backend/routes/messageRoutes.js`
1. **What this file does:** Maps URL paths to controller functions.
2. **How it connects to other files:** Calls controller files and auth middleware.
3. **Technology used here:** Express Router.
4. **Common viva question:** What is a route file?
5. **Simple answer you can say:** It connects URL endpoints to backend functions.
6. **Modification examiner may ask:** Add new endpoint mapping.

### `backend/routes/notificationRoutes.js`
1. **What this file does:** Maps URL paths to controller functions.
2. **How it connects to other files:** Calls controller files and auth middleware.
3. **Technology used here:** Express Router.
4. **Common viva question:** What is a route file?
5. **Simple answer you can say:** It connects URL endpoints to backend functions.
6. **Modification examiner may ask:** Add new endpoint mapping.

### `backend/routes/reportAuthenticityRoutes.js`
1. **What this file does:** Maps URL paths to controller functions.
2. **How it connects to other files:** Calls controller files and auth middleware.
3. **Technology used here:** Express Router.
4. **Common viva question:** What is a route file?
5. **Simple answer you can say:** It connects URL endpoints to backend functions.
6. **Modification examiner may ask:** Add new endpoint mapping.

### `backend/routes/reportRoutes.js`
1. **What this file does:** Maps URL paths to controller functions.
2. **How it connects to other files:** Calls controller files and auth middleware.
3. **Technology used here:** Express Router.
4. **Common viva question:** What is a route file?
5. **Simple answer you can say:** It connects URL endpoints to backend functions.
6. **Modification examiner may ask:** Add new endpoint mapping.

### `backend/routes/storyRoutes.js`
1. **What this file does:** Maps URL paths to controller functions.
2. **How it connects to other files:** Calls controller files and auth middleware.
3. **Technology used here:** Express Router.
4. **Common viva question:** What is a route file?
5. **Simple answer you can say:** It connects URL endpoints to backend functions.
6. **Modification examiner may ask:** Add new endpoint mapping.

### `backend/routes/userRoutes.js`
1. **What this file does:** Maps URL paths to controller functions.
2. **How it connects to other files:** Calls controller files and auth middleware.
3. **Technology used here:** Express Router.
4. **Common viva question:** What is a route file?
5. **Simple answer you can say:** It connects URL endpoints to backend functions.
6. **Modification examiner may ask:** Add new endpoint mapping.

### `backend/seed-roles.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

### `backend/server.js`
1. **What this file does:** Starts the backend app.
2. **How it connects to other files:** All route files + DB connection + middleware.
3. **Technology used here:** Express + CORS + dotenv.
4. **Common viva question:** Why is this the backend entry file?
5. **Simple answer you can say:** Because this file creates and starts the API server.
6. **Modification examiner may ask:** Add a new route prefix or middleware.

### `backend/test-code.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

### `backend/utils/emailService.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

### `frontend/.env.example`
1. **What this file does:** Project file.
2. **How it connects to other files:** Connected to app flow.
3. **Technology used here:** Project tech stack.
4. **Common viva question:** What is this file for?
5. **Simple answer you can say:** It supports one part of the project.
6. **Modification examiner may ask:** Small enhancement as requested.

### `frontend/.gitignore`
1. **What this file does:** Project file.
2. **How it connects to other files:** Connected to app flow.
3. **Technology used here:** Project tech stack.
4. **Common viva question:** What is this file for?
5. **Simple answer you can say:** It supports one part of the project.
6. **Modification examiner may ask:** Small enhancement as requested.

### `frontend/eslint.config.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

### `frontend/index.html`
1. **What this file does:** Base HTML shell for React app.
2. **How it connects to other files:** Vite injects React bundle here.
3. **Technology used here:** HTML.
4. **Common viva question:** Why only one HTML in SPA?
5. **Simple answer you can say:** React renders full app inside one root div.
6. **Modification examiner may ask:** Add meta tags or title.

### `frontend/package-lock.json`
1. **What this file does:** Dependency and script configuration.
2. **How it connects to other files:** Used by npm/build tools.
3. **Technology used here:** npm/Node config.
4. **Common viva question:** Why package.json needed?
5. **Simple answer you can say:** It tells which libraries and scripts project uses.
6. **Modification examiner may ask:** Add script or dependency version update.

### `frontend/package.json`
1. **What this file does:** Dependency and script configuration.
2. **How it connects to other files:** Used by npm/build tools.
3. **Technology used here:** npm/Node config.
4. **Common viva question:** Why package.json needed?
5. **Simple answer you can say:** It tells which libraries and scripts project uses.
6. **Modification examiner may ask:** Add script or dependency version update.

### `frontend/postcss.config.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

### `frontend/src/App.css`
1. **What this file does:** Contains styling rules.
2. **How it connects to other files:** Loaded by React entry/components.
3. **Technology used here:** CSS/Tailwind.
4. **Common viva question:** Why separate CSS file?
5. **Simple answer you can say:** To keep UI styles organized.
6. **Modification examiner may ask:** Update colors/spacings/responsive rules.

### `frontend/src/App.jsx`
1. **What this file does:** Defines all frontend routes.
2. **How it connects to other files:** Connects pages, navbar/footer, protected route.
3. **Technology used here:** React Router.
4. **Common viva question:** How is admin page protected?
5. **Simple answer you can say:** By ProtectedRoute with requiredRole="admin".
6. **Modification examiner may ask:** Add a new page route.

### `frontend/src/components/Admin/AdminHeader.jsx`
1. **What this file does:** Reusable UI component: AdminHeader.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Admin/AdminReportAudit.jsx`
1. **What this file does:** Reusable UI component: AdminReportAudit.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Admin/AdminSidebar.jsx`
1. **What this file does:** Reusable UI component: AdminSidebar.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Admin/AdminStoryReview.jsx`
1. **What this file does:** Reusable UI component: AdminStoryReview.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Admin/FilterPanel.jsx`
1. **What this file does:** Reusable UI component: FilterPanel.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Admin/ReportTable.jsx`
1. **What this file does:** Reusable UI component: ReportTable.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Admin/RiskBadge.jsx`
1. **What this file does:** Reusable UI component: RiskBadge.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Admin/SLATimer.jsx`
1. **What this file does:** Reusable UI component: SLATimer.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Admin/StatCard.jsx`
1. **What this file does:** Reusable UI component: StatCard.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Admin/StatusBadge.jsx`
1. **What this file does:** Reusable UI component: StatusBadge.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/DashboardCard.jsx`
1. **What this file does:** Reusable UI component: DashboardCard.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/DashboardStories.jsx`
1. **What this file does:** Reusable UI component: DashboardStories.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Escalation/EscalationForm.jsx`
1. **What this file does:** Reusable UI component: EscalationForm.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Escalation/EscalationPathCard.jsx`
1. **What this file does:** Reusable UI component: EscalationPathCard.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Footer.jsx`
1. **What this file does:** Reusable UI component: Footer.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Header.jsx`
1. **What this file does:** Reusable UI component: Header.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Messages/ChatWindow.jsx`
1. **What this file does:** Reusable UI component: ChatWindow.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Messages/ConversationList.jsx`
1. **What this file does:** Reusable UI component: ConversationList.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Messages/NewConversationModal.jsx`
1. **What this file does:** Reusable UI component: NewConversationModal.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Navbar.jsx`
1. **What this file does:** Reusable UI component: Navbar.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Notifications/NotificationBell.jsx`
1. **What this file does:** Reusable UI component: NotificationBell.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Onboarding/OnboardingGuide.jsx`
1. **What this file does:** Reusable UI component: OnboardingGuide.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/ProtectedRoute.jsx`
1. **What this file does:** Reusable UI component: ProtectedRoute.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/ReportStatus/ReportStatusCard.jsx`
1. **What this file does:** Reusable UI component: ReportStatusCard.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/ReportWizard/Step1Type.jsx`
1. **What this file does:** Reusable UI component: Step1Type.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/ReportWizard/Step2Details.jsx`
1. **What this file does:** Reusable UI component: Step2Details.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/ReportWizard/Step3Evidence.jsx`
1. **What this file does:** Reusable UI component: Step3Evidence.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/ReportWizard/Step4Review.jsx`
1. **What this file does:** Reusable UI component: Step4Review.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/ReportWizard/StepIndicator.jsx`
1. **What this file does:** Reusable UI component: StepIndicator.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Sidebar.jsx`
1. **What this file does:** Reusable UI component: Sidebar.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Stories/PublishedStoriesList.jsx`
1. **What this file does:** Reusable UI component: PublishedStoriesList.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Stories/ShareStoryModal.jsx`
1. **What this file does:** Reusable UI component: ShareStoryModal.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Stories/StoryCard.jsx`
1. **What this file does:** Reusable UI component: StoryCard.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Stories/StorySubmissionModal.jsx`
1. **What this file does:** Reusable UI component: StorySubmissionModal.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Stories/UserStoriesList.jsx`
1. **What this file does:** Reusable UI component: UserStoriesList.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/Toast.jsx`
1. **What this file does:** Reusable UI component: Toast.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/UserActivityTimeline.jsx`
1. **What this file does:** Reusable UI component: UserActivityTimeline.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/WelcomeCard.jsx`
1. **What this file does:** Reusable UI component: WelcomeCard.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/ui/Button.jsx`
1. **What this file does:** Reusable UI component: Button.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/ui/ConfirmationModal.jsx`
1. **What this file does:** Reusable UI component: ConfirmationModal.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/components/ui/Input.jsx`
1. **What this file does:** Reusable UI component: Input.
2. **How it connects to other files:** Used by pages/layouts.
3. **Technology used here:** React + Tailwind.
4. **Common viva question:** Why reusable component?
5. **Simple answer you can say:** So code is cleaner and repeat work is less.
6. **Modification examiner may ask:** Change style/props or add small feature.

### `frontend/src/data/stories.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

### `frontend/src/hooks/useToast.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

### `frontend/src/index.css`
1. **What this file does:** Contains styling rules.
2. **How it connects to other files:** Loaded by React entry/components.
3. **Technology used here:** CSS/Tailwind.
4. **Common viva question:** Why separate CSS file?
5. **Simple answer you can say:** To keep UI styles organized.
6. **Modification examiner may ask:** Update colors/spacings/responsive rules.

### `frontend/src/lib/utils.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

### `frontend/src/main.jsx`
1. **What this file does:** Project file.
2. **How it connects to other files:** Connected to app flow.
3. **Technology used here:** Project tech stack.
4. **Common viva question:** What is this file for?
5. **Simple answer you can say:** It supports one part of the project.
6. **Modification examiner may ask:** Small enhancement as requested.

### `frontend/src/pages/Admin/AdminAnalytics.jsx`
1. **What this file does:** Renders AdminAnalytics screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/Admin/AdminMessages.jsx`
1. **What this file does:** Renders AdminMessages screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/Admin/AdminSettings.jsx`
1. **What this file does:** Renders AdminSettings screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/Admin/AdminUserHistory.jsx`
1. **What this file does:** Renders AdminUserHistory screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/Admin/AdminUsers.jsx`
1. **What this file does:** Renders AdminUsers screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/Admin/ReportDetail.jsx`
1. **What this file does:** Renders ReportDetail screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/AdminDashboard.jsx`
1. **What this file does:** Renders AdminDashboard screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/ForgotCodePage.jsx`
1. **What this file does:** Renders ForgotCodePage screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/LandingPage.jsx`
1. **What this file does:** Renders LandingPage screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/LoginPage.jsx`
1. **What this file does:** Renders LoginPage screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/Messages.jsx`
1. **What this file does:** Renders Messages screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/NewReport.jsx`
1. **What this file does:** 4-step report form and submit flow.
2. **How it connects to other files:** Uses wizard components + reportService.
3. **Technology used here:** React hooks.
4. **Common viva question:** Why use wizard form?
5. **Simple answer you can say:** It reduces stress and makes form easier.
6. **Modification examiner may ask:** Add one new required field.

### `frontend/src/pages/NotFoundPage.jsx`
1. **What this file does:** Renders NotFoundPage screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/PrivacyPolicy.jsx`
1. **What this file does:** Renders PrivacyPolicy screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/RegisterPage.jsx`
1. **What this file does:** Renders RegisterPage screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/ReportStatus.jsx`
1. **What this file does:** Renders ReportStatus screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/StoriesPage.jsx`
1. **What this file does:** Renders StoriesPage screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/TermsOfUse.jsx`
1. **What this file does:** Renders TermsOfUse screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/UserDashboard.jsx`
1. **What this file does:** Renders UserDashboard screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/UserReportDetail.jsx`
1. **What this file does:** Renders UserReportDetail screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/pages/UserSettingsPage.jsx`
1. **What this file does:** Renders UserSettingsPage screen.
2. **How it connects to other files:** Uses components + services.
3. **Technology used here:** React.
4. **Common viva question:** What does this page do for user?
5. **Simple answer you can say:** It shows this module UI and calls APIs.
6. **Modification examiner may ask:** Add filter/search/button on this page.

### `frontend/src/services/analyticsService.js`
1. **What this file does:** Calls backend APIs for analytics.
2. **How it connects to other files:** Used by pages/components.
3. **Technology used here:** JavaScript fetch wrappers.
4. **Common viva question:** Why create separate service file?
5. **Simple answer you can say:** To avoid repeating API code in many pages.
6. **Modification examiner may ask:** Add one more API function.

### `frontend/src/services/authService.js`
1. **What this file does:** Central API helper and auth calls.
2. **How it connects to other files:** Used by login/register/other services.
3. **Technology used here:** Fetch API.
4. **Common viva question:** Why service layer?
5. **Simple answer you can say:** Keeps API code in one place.
6. **Modification examiner may ask:** Add refresh-token helper.

### `frontend/src/services/messageService.js`
1. **What this file does:** Calls backend APIs for message.
2. **How it connects to other files:** Used by pages/components.
3. **Technology used here:** JavaScript fetch wrappers.
4. **Common viva question:** Why create separate service file?
5. **Simple answer you can say:** To avoid repeating API code in many pages.
6. **Modification examiner may ask:** Add one more API function.

### `frontend/src/services/notificationService.js`
1. **What this file does:** Calls backend APIs for notification.
2. **How it connects to other files:** Used by pages/components.
3. **Technology used here:** JavaScript fetch wrappers.
4. **Common viva question:** Why create separate service file?
5. **Simple answer you can say:** To avoid repeating API code in many pages.
6. **Modification examiner may ask:** Add one more API function.

### `frontend/src/services/reportAuthenticityService.js`
1. **What this file does:** Calls backend APIs for reportAuthenticity.
2. **How it connects to other files:** Used by pages/components.
3. **Technology used here:** JavaScript fetch wrappers.
4. **Common viva question:** Why create separate service file?
5. **Simple answer you can say:** To avoid repeating API code in many pages.
6. **Modification examiner may ask:** Add one more API function.

### `frontend/src/services/reportService.js`
1. **What this file does:** Calls backend APIs for report.
2. **How it connects to other files:** Used by pages/components.
3. **Technology used here:** JavaScript fetch wrappers.
4. **Common viva question:** Why create separate service file?
5. **Simple answer you can say:** To avoid repeating API code in many pages.
6. **Modification examiner may ask:** Add one more API function.

### `frontend/src/services/storyService.js`
1. **What this file does:** Calls backend APIs for story.
2. **How it connects to other files:** Used by pages/components.
3. **Technology used here:** JavaScript fetch wrappers.
4. **Common viva question:** Why create separate service file?
5. **Simple answer you can say:** To avoid repeating API code in many pages.
6. **Modification examiner may ask:** Add one more API function.

### `frontend/src/services/toastService.js`
1. **What this file does:** Calls backend APIs for toast.
2. **How it connects to other files:** Used by pages/components.
3. **Technology used here:** JavaScript fetch wrappers.
4. **Common viva question:** Why create separate service file?
5. **Simple answer you can say:** To avoid repeating API code in many pages.
6. **Modification examiner may ask:** Add one more API function.

### `frontend/src/services/userService.js`
1. **What this file does:** Calls backend APIs for user.
2. **How it connects to other files:** Used by pages/components.
3. **Technology used here:** JavaScript fetch wrappers.
4. **Common viva question:** Why create separate service file?
5. **Simple answer you can say:** To avoid repeating API code in many pages.
6. **Modification examiner may ask:** Add one more API function.

### `frontend/tailwind.config.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

### `frontend/vercel.json`
1. **What this file does:** Dependency and script configuration.
2. **How it connects to other files:** Used by npm/build tools.
3. **Technology used here:** npm/Node config.
4. **Common viva question:** Why package.json needed?
5. **Simple answer you can say:** It tells which libraries and scripts project uses.
6. **Modification examiner may ask:** Add script or dependency version update.

### `frontend/vite.config.js`
1. **What this file does:** Project helper/config script.
2. **How it connects to other files:** Connected by npm or runtime imports.
3. **Technology used here:** JavaScript.
4. **Common viva question:** What is this helper used for?
5. **Simple answer you can say:** It supports the main feature flow.
6. **Modification examiner may ask:** Adjust constants or utility logic.

---

## 9) Final speaking script (use as your final answer in viva)

"My project SafeSpeak+ is an anonymous incident reporting and management system. The frontend is React and the backend is Node/Express connected to MongoDB. A user can register, get anonymous access, submit reports, track status, and chat safely with admin. Admin can review reports, set risk and authenticity, moderate stories, and monitor analytics. Security is handled with JWT authentication, password hashing, and role-based route protection. The code is modular using routes, controllers, and models, so adding new features is easy."

## 10) Last-minute memory trick
- If stuck, explain in this order: **User action -> API -> Database -> Result shown on screen**.
- Examiners mostly check understanding of flow, not memorized syntax.

---

## 11) Core code walkthrough (important files explained line-by-line style)

### A) `backend/server.js` walkthrough
- Loads environment variables using `dotenv.config()`.
- Creates Express app.
- Enables CORS so frontend can call backend.
- Adds JSON/body parser middleware.
- Calls `connectDB()` to connect MongoDB.
- Registers all route groups:
  - `/api/auth`
  - `/api/reports`
  - `/api/messages`
  - `/api/user`
  - `/api/stories`
  - `/api/notifications`
  - `/api/analytics`
- Adds health-check endpoint.
- Adds 404 route and global error handler.
- Starts server using `app.listen(PORT)`.

**Viva one-liner:** “`server.js` is the main control room of backend.”

### B) `backend/middleware/auth.js` walkthrough
- Reads `Authorization` header.
- Extracts token after `Bearer`.
- Verifies token with `JWT_SECRET`.
- Adds decoded user info to `req.user`.
- If token is invalid/expired, returns 401.
- `authorize(...roles)` checks role permission and returns 403 when role mismatches.

**Viva one-liner:** “This file is security gatekeeper for protected APIs.”

### C) `backend/controllers/authController.js` walkthrough
- `register`: creates user, generates anonymous code, stores in DB, sends email in background.
- `login`: checks email/password and returns JWT (for admin/staff login flow).
- `anonymousLogin`: finds user by anonymous code and returns JWT.
- `forgotCode`: verifies identity and regenerates anonymous code.
- `getCurrentUser`: returns logged in user info from token context.
- `changePassword`: verifies old password and updates hashed new password.

**Viva one-liner:** “This file manages full identity lifecycle.”

### D) `backend/controllers/reportController.js` walkthrough
- Generates custom report IDs (like `SR-YYYY-001`).
- `createReport`: takes incident fields, stores report, applies initial authenticity logic, and creates notifications.
- `getUserReports`: returns only logged-in user’s reports.
- `getAllReports`: admin endpoint; includes filters and identity reveal logic.
- `updateReportStatus`: changes report status and notifies users.
- `appealReport`: user can request re-check.
- `escalateReport`: moves case upward.
- `getEscalationPdf`: serves escalation PDF endpoint.

**Viva one-liner:** “This is the heart of complaint management.”

### E) `frontend/src/App.jsx` walkthrough
- Imports all pages and shared layout components.
- Uses React Router to map URL paths to pages.
- Uses `ProtectedRoute` for restricted pages.
- Shows/hides navbar/footer based on path.
- Provides global toast container for alerts.

**Viva one-liner:** “App.jsx is frontend map of all pages.”

### F) `frontend/src/services/authService.js` walkthrough
- Keeps one `makeRequest()` helper for all API calls.
- Automatically attaches JWT token from storage when present.
- Handles response parsing and error normalization.
- Exposes auth-specific functions:
  - `registerUser`
  - `loginUser`
  - `anonymousLogin`
  - `getCurrentUser`
  - `changePassword`

**Viva one-liner:** “Service layer avoids repeated API code in every page.”

### G) `frontend/src/pages/NewReport.jsx` walkthrough
- Builds 4-step report form.
- Stores form data in state.
- Validates required fields before next step.
- On submit, transforms payload and calls `createReport()` API.
- Shows success/error toasts and redirects to report status page.

**Viva one-liner:** “This page converts user form input into backend-ready incident data.”

---

## 12) If examiner asks “show code change now” (ready answers)

### 1. Add new report status “Under Legal Review”
**Files to edit:**
- `backend/models/Report.js` (status enum)
- Admin status UI components/pages
- Any report filters in admin dashboard

**What to say:**
“First I add the new status in backend schema so DB accepts it, then update frontend dropdown/filter so admin can use it.”

### 2. Add report search by report ID
**Files to edit:**
- `backend/controllers/reportController.js` (query filter)
- `frontend/src/pages/AdminDashboard.jsx` (search input and filtered list)

**What to say:**
“I add one query parameter in backend and bind search input in frontend to call filtered API.”

### 3. Add one new report field “Witness Name”
**Files to edit:**
- `frontend/src/components/ReportWizard/Step2Details.jsx`
- `frontend/src/pages/NewReport.jsx`
- `backend/models/Report.js`
- `backend/controllers/reportController.js`

**What to say:**
“I update UI input, payload mapping, schema field, and save logic end-to-end.”

### 4. Add new role “counsellor”
**Files to edit:**
- `backend/models/User.js` role enum
- `backend/middleware/auth.js` usage in authorize checks
- `frontend/src/components/ProtectedRoute.jsx`/route rules if needed

**What to say:**
“Role is added in schema first, then permission checks and route visibility are updated.”

### 5. Add dark mode toggle
**Files to edit:**
- `frontend/src/pages/UserSettingsPage.jsx`
- `frontend/src/index.css` or Tailwind theme behavior
- Save preference through `userService` and backend user profile update endpoint

**What to say:**
“I add theme state, persist preference in user profile, and apply class-based styling.”
