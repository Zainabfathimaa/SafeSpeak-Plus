# 🎯 Major Feature Implementation Plan

## Phase 1: Database Schema Updates (CRITICAL)
### New Models Needed:
1. **Story Model** - User stories submitted for admin review
2. **Notification Model** - Track all notifications (email/in-app)
3. **User Preferences** - Consent to reveal ID, notification settings

### Schema Modifications:
- **User**: Add `idRevealConsent`, `notificationPreferences`, `emailNotifications`
- **Report**: Add `authenticityScore`, `verificationStatus`, `reportedBy` (track accuser)
- **Story**: New collection with title, content, images, status, admin comments

---

## Phase 2: Backend Endpoints
### Story Management:
- POST `/api/stories/submit` - User submits story
- GET `/api/stories` - User's submitted stories
- GET `/api/admin/stories/pending` - Admin reviews pending stories
- PUT `/api/admin/stories/:id/approve` - Approve story
- PUT `/api/admin/stories/:id/reject` - Reject story
- DELETE `/api/stories/:id` - User deletes own story

### Notification System:
- POST `/api/notifications/create` - Create notification
- GET `/api/notifications` - Get user notifications
- PUT `/api/notifications/:id/read` - Mark as read
- DELETE `/api/notifications/:id` - Delete notification

### User Consent:
- PUT `/api/user/consent/id-reveal` - User grants/revokes ID reveal consent
- GET `/api/user/consent/status` - Check current consent status

### Report Authenticity:
- PUT `/api/admin/reports/:id/verify` - Mark report as verified
- GET `/api/admin/reports/authenticity` - Get authenticity metrics

---

## Phase 3: Frontend Components
### User Dashboard:
- Stories section with: submit button, submitted list, admin comments
- New story submission modal with validation
- Active reports with working filters
- Notifications badge with dropdown
- Settings page

### Admin Dashboard:
- Story review panel with approve/reject
- Risk level marking on reports
- Clickable stat cards showing filtered reports
- ID reveal consent status in user table
- Notification bell with unread count

### Shared:
- Toast notifications (already have)
- Confirmation modals
- Settings/preferences page

---

## Phase 4: Features to Implement
✅ = Already have  |  🔄 = In progress  |  ❌ = Need to build

### User Dashboard:
- ✅ Remove placeholder stories
- ❌ Story submission form
- ❌ Pending stories section
- ❌ Admin-approved stories section
- ❌ Notifications badge
- 🔄 Active reports filter (fix)
- ❌ Settings page
- ❌ Email notification preferences
- ❌ ID reveal consent toggle

### Admin Dashboard:
- ❌ Story review interface
- ❌ Mark risk level on reports
- ❌ Approve/reject stories
- ❌ Clickable stat cards
- ❌ User ID visibility (based on consent)
- ❌ Notification bell (working)
- ❌ Report authenticity indicators

### Shared Features:
- ❌ Email notifications system
- ❌ In-app notifications
- ❌ Fake report detection (validation rules)
- ❌ Enhanced settings page

---

## Implementation Priority Order:
1. **HIGH PRIORITY** (required for core flow):
   - Story model + endpoints
   - Story submission UI
   - Story admin review UI
   - Notifications system

2. **MEDIUM PRIORITY** (enhance security/UX):
   - User consent system
   - Report authenticity checking
   - ID reveal mechanism
   - Email notifications

3. **LOW PRIORITY** (UI polish):
   - Settings page customization
   - Filter improvements
   - Analytics enhancements

---

## Success Criteria:
- [ ] User can submit story → Admin reviews → User sees result
- [ ] User receives email on report/story updates
- [ ] Active reports filter works by status
- [ ] Admin dashboard shows risk level options
- [ ] Admin can see user email only with consent
- [ ] Notifications bell updates in real-time
- [ ] Settings page saves user preferences
- [ ] No false reports through verification checks

