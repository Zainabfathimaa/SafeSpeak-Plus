## 🔧 INTEGRATION GUIDE - Adding Components to Existing Pages

### 1️⃣ USER DASHBOARD - Add Stories Section

**File:** `frontend/src/pages/UserDashboard.jsx`

Add these imports at the top:
```jsx
import { StorySubmissionModal } from '../components/Stories/StorySubmissionModal';
import { UserStoriesList } from '../components/Stories/UserStoriesList';
import { PublishedStoriesList } from '../components/Stories/PublishedStoriesList';
import storyService from '../services/storyService';
```

Add to state:
```jsx
const [showStoryModal, setShowStoryModal] = useState(false);
const [userStories, setUserStories] = useState([]);
const [publishedStories, setPublishedStories] = useState([]);
const [storiesLoading, setStoriesLoading] = useState(false);
```

Add useEffect to fetch stories:
```jsx
useEffect(() => {
  fetchStories();
}, []);

const fetchStories = async () => {
  setStoriesLoading(true);
  try {
    const userRes = await storyService.getUserStories();
    const pubRes = await storyService.getPublishedStories();
    setUserStories(userRes.stories || []);
    setPublishedStories(pubRes.stories || []);
  } catch (error) {
    console.error('Error fetching stories', error);
  } finally {
    setStoriesLoading(false);
  }
};
```

Add to JSX (replace placeholder stories section):
```jsx
{/* Stories Section */}
<div className="mt-8">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-900">Stories</h2>
    <button
      onClick={() => setShowStoryModal(true)}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      + Share Your Story
    </button>
  </div>

  {/* My Stories */}
  <div className="mb-8">
    <h3 className="text-lg font-bold text-gray-900 mb-4">My Stories</h3>
    <UserStoriesList
      stories={userStories || []}
      onDelete={(storyId) => setUserStories(prev => prev.filter(s => s._id !== storyId))}
      isLoading={storiesLoading}
    />
  </div>

  {/* Published Stories */}
  <div>
    <h3 className="text-lg font-bold text-gray-900 mb-4">Published Stories 📖</h3>
    <PublishedStoriesList
      stories={publishedStories || []}
      isLoading={storiesLoading}
    />
  </div>

  {/* Story Submission Modal */}
  <StorySubmissionModal
    isOpen={showStoryModal}
    onClose={() => setShowStoryModal(false)}
    onSuccess={fetchStories}
  />
</div>
```

---

### 2️⃣ NAVBAR - Add Notification Bell

**File:** `frontend/src/components/Navbar.jsx`

Add import:
```jsx
import NotificationBell from './Notifications/NotificationBell';
```

Add to navbar JSX (in the right side near user menu):
```jsx
{/* Before user menu icon */}
<NotificationBell />
```

---

### 3️⃣ USER MENU - Add Settings Link

**File:** `frontend/src/components/Navbar.jsx` (or HeaderMenu)

Add Settings option in dropdown menu:
```jsx
<Link
  to="/settings"
  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
>
  ⚙️ Settings
</Link>
```

---

### 4️⃣ ROUTER - Add Settings Page Route

**File:** `frontend/src/App.jsx` (or Router config)

Add import:
```jsx
import UserSettingsPage from './pages/UserSettingsPage';
```

Add route:
```jsx
<Route path="/settings" element={<ProtectedRoute><UserSettingsPage /></ProtectedRoute>} />
```

---

### 5️⃣ ADMIN DASHBOARD - Add Story Review

**File:** `frontend/src/pages/AdminDashboard.jsx`

Add imports:
```jsx
import AdminStoryReview from '../components/Admin/AdminStoryReview';
import storyService from '../services/storyService';
```

Add state:
```jsx
const [adminTab, setAdminTab] = useState('overview');
const [pendingStories, setPendingStories] = useState([]);
const [storiesLoading, setStoriesLoading] = useState(false);
```

Add fetch function:
```jsx
const fetchPendingStories = async () => {
  setStoriesLoading(true);
  try {
    const res = await storyService.getPendingStories();
    setPendingStories(res.stories || []);
  } catch (error) {
    console.error('Error fetching stories', error);
  } finally {
    setStoriesLoading(false);
  }
};
```

Add tab button to admin dashboard:
```jsx
<button
  onClick={() => {
    setAdminTab('stories');
    fetchPendingStories();
  }}
  className={`px-4 py-2 rounded-lg font-medium transition ${
    adminTab === 'stories'
      ? 'bg-blue-600 text-white'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
  }`}
>
  📖 Story Review ({pendingStories.length})
</button>
```

Add tab content:
```jsx
{adminTab === 'stories' && (
  <AdminStoryReview
    stories={pendingStories}
    onRefresh={fetchPendingStories}
  />
)}
```

---

### 6️⃣ ADMIN REPORT TABLE - Add Audit Component

**File:** `frontend/src/components/Admin/ReportTable.jsx` (or wherever report row is shown)

Add import:
```jsx
import AdminReportAudit from './AdminReportAudit';
```

Add state for expanded report:
```jsx
const [expandedReportId, setExpandedReportId] = useState(null);
```

In the report row JSX, add:
```jsx
{expandedReportId === report._id && (
  <tr>
    <td colSpan="100%">
      <AdminReportAudit
        report={report}
        onUpdate={() => {
          // Refresh report data
          // Call parent's refetch function
        }}
      />
    </td>
  </tr>
)}
```

Or add a "Details" button:
```jsx
<button
  onClick={() => setExpandedReportId(expandedReportId === report._id ? null : report._id)}
  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
>
  {expandedReportId === report._id ? 'Hide' : 'Audit'} →
</button>
```

---

### 7️⃣ ACTIVE REPORTS FILTER FIX

**File:** `frontend/src/pages/UserDashboard.jsx` (ActiveReports section)

The filter dropdown likely has the options but isn't actually filtering. Add this:

```jsx
const handleFilterChange = (newStatus) => {
  setSelectedStatus(newStatus);
  // Filter the reports
  if (newStatus === 'All') {
    setFilteredReports(activeReports);
  } else {
    setFilteredReports(activeReports.filter(report => report.status === newStatus));
  }
};
```

Make sure the filter dropdown calls this:
```jsx
<select
  value={selectedStatus}
  onChange={(e) => handleFilterChange(e.target.value)}
  className="..."
>
  <option value="All">All Reports</option>
  <option value="Open">Open</option>
  <option value="In-Review">In Review</option>
  <option value="In-Progress">In Progress</option>
  <option value="Resolved">Resolved</option>
  <option value="Escalated">Escalated</option>
  <option value="Closed">Closed</option>
</select>
```

---

### 8️⃣ MAKE DASHBOARD CARDS CLICKABLE

Add this component to show modal/details:

```jsx
const [selectedCardType, setSelectedCardType] = useState(null);

// In stat cards:
<div
  onClick={() => setSelectedCardType('high-risk')}
  className="cursor-pointer hover:shadow-lg transition"
>
  {/* Card content */}
</div>

// Then show filtered modal:
{selectedCardType === 'high-risk' && (
  <ReportFilterModal
    status="All"
    riskLevel="High"
    onClose={() => setSelectedCardType(null)}
  />
)}
```

---

## 📋 INTEGRATION CHECKLIST

- [ ] Import all new components
- [ ] Add story state to UserDashboard
- [ ] Add NotificationBell to Navbar
- [ ] Add Settings link to user menu
- [ ] Add Settings route to App.jsx
- [ ] Add story review tab to AdminDashboard
- [ ] Add AdminReportAudit to report details
- [ ] Fix active reports filter
- [ ] Add click handlers to stat cards
- [ ] Test all features
- [ ] Run linting

---

## 🧪 QUICK TEST

After integration, test these flows:

1. **User Story Submission:**
   - Dashboard → Share Story → Modal → Submit → See toast
   - Should appear in "My Stories" as "Pending Review"

2. **Admin Story Review:**
   - Admin Dashboard → Story Review tab
   - Click Approve/Reject
   - User gets notification

3. **Notifications:**
   - Click bell icon in navbar
   - See unread count badge
   - Click mark all read

4. **Settings:**
   - User menu → Settings → Update preferences → Save
   - Should see success toast

5. **Report Audit:**
   - Admin Dashboard → Click report → Details button
   - Set risk level and flag if needed

---

## 🛠️ TROUBLESHOOTING

If components don't render:
1. Check imports are correct
2. Verify service methods exist
3. Check console for errors
4. Ensure routes are protected with ProtectedRoute
5. Verify backend services have correct API_BASE_URL

If API calls fail:
1. Check backend server is running on port 5000
2. Verify VITE_BACKEND_URL is set correctly
3. Check auth token is being sent (should be automatic)
4. Review server logs for errors

If styles look off:
1. Ensure Tailwind CSS is compiled
2. Check parent styling doesn't override
3. Verify no CSS conflicts

---

