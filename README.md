# Campus Notifications System

A responsive React + TypeScript application for displaying campus notifications with priority ranking and filtering. This repository contains the **Stage 2 Frontend Implementation** of the Campus Notifications microservice.

---

## 📋 Project Overview

### Stage 1: Priority Inbox (Backend/Script)
*Not implemented in this repository*

The Priority Inbox stage involves fetching notifications from the evaluation API and returning the top N priority notifications based on business rules. Implementation details are in `notification_system_design.md`.

### Stage 2: Frontend (React Application)
**✓ Implemented** - Interactive web interface for browsing and managing notifications

A responsive React + TypeScript application for displaying campus notifications with priority ranking and filtering.

---

## 🎯 Stage 2 Features

### All Notifications View
- **Paginated List**: Browse notifications with configurable page size (5, 8, 10, 15 per page)
- **Type Filtering**: Filter by Placement, Result, or Event
- **Navigation**: Previous/Next pagination controls
- **Real-time Refresh**: Refresh button to fetch latest data

### Priority Notifications View
- **Top N Ranking**: Display top N notifications (configurable: 5, 10, 15, 20)
- **Smart Sorting**: Automatic ranking by type and recency
- **Priority-based Layout**: Placement items highlighted more prominently

### General Features
- **Viewed Tracking**: Mark notifications as viewed; persist state in localStorage
- **Responsive Design**: Mobile-friendly (390px) and desktop (1024px+) layouts
- **Material UI Theme**: Custom design system with teal and navy palette
- **Error Handling**: Clear error states and retry capabilities
- **Loading States**: Skeleton cards during data fetch

### Priority Rules

Notifications are ranked by type (highest to lowest):
1. **Placement** (priority: 3) - Hiring announcements, placement drives
2. **Result** (priority: 2) - Academic results, exam scores
3. **Event** (priority: 1) - Campus events, festivals, workshops

Within the same priority, newer notifications appear first (latest timestamp first).

---

## 🚀 Stage 2 Setup & Deployment

### Prerequisites

- Node.js 16+ and npm
- Valid evaluation service credentials (from Stage 1 registration)

### Installation

```bash
cd notification_app_fe
npm install
```

### Configuration

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Register with the evaluation service and obtain your token (if not already done):
```bash
# Register to get clientID and clientSecret
curl -X POST http://20.207.122.201/evaluation-service/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your_email",
    "name":"Your Name",
    "mobileNo":"...",
    "githubUsername":"...",
    "rollNo":"...",
    "accessCode":"..."
  }'

# Get authorization token
curl -X POST http://20.207.122.201/evaluation-service/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email":"...",
    "name":"...",
    "rollNo":"...",
    "accessCode":"...",
    "clientID":"...",
    "clientSecret":"..."
  }'
```

3. Update `.env.local` with your bearer token:
```env
VITE_NOTIFICATION_API_BASE=http://20.207.122.201/evaluation-service/notifications
VITE_NOTIFICATION_API_TOKEN=your_bearer_token_here
```

### Development

Start the development server on `http://localhost:3000`:
```bash
npm run dev
```

The app will auto-reload on file changes.

### Build

Create a production-optimized bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

**Build Output:**
- Size: ~465 KB (uncompressed), ~144 KB (gzipped)
- Modules: 927 transformed
- Time: ~8.5 seconds

---

## 📁 Stage 2 Architecture

### Folder Structure

```
notification_app_fe/
├── src/
│   ├── api/                    # API client and HTTP logic
│   │   └── notifications.ts    # Notification fetching with auth
│   ├── components/             # Reusable React components
│   │   ├── NotificationCard.tsx     # Individual notification display
│   │   ├── FeedSkeleton.tsx        # Loading skeleton
│   │   └── EmptyState.tsx          # Empty state messaging
│   ├── utils/                  # Utility functions
│   │   └── notifications.ts    # Sorting, filtering, formatting
│   ├── types.ts                # TypeScript type definitions
│   ├── theme.ts                # Material UI theme config
│   ├── App.tsx                 # Main application component
│   └── main.tsx                # React entry point
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite build config
└── .env.example                # Environment variable template
```

### Component Hierarchy

```
App
├── AppBar (Header with refresh button)
├── Hero Section (Stats: filter, page size, top N, viewed count)
├── Tabs (All Notifications | Priority Notifications)
│   ├── All Notifications Tab
│   │   ├── Filters (Type, Page Size)
│   │   ├── NotificationCard[] (Grid layout)
│   │   └── Pagination (Previous/Next)
│   └── Priority Notifications Tab
│       └── NotificationCard[] (Top N cards)
```

### State Management

**Server State** (React Hooks - `useState`, `useEffect`):
- `pageRows`: Notifications from paginated API
- `priorityRows`: All notifications for priority calculation
- `loadingPage`: Fetch progress indicator
- `pageError`: Error message display

**UI State**:
- `mode`: Active tab ('all' | 'priority')
- `filterChoice`: Selected type filter
- `page`: Current pagination page
- `pageSize`: Rows per page
- `topCount`: Number of top priorities to show

**Local State** (localStorage):
- `viewedIds`: Set of notification IDs marked as viewed
- Key: `campus-notifications:viewed`

### Data Flow

```
API Fetch (useEffect)
    ↓
API Response (json)
    ↓
Decorate (add rank, parse time, add viewed flag)
    ↓
Sort (by priority, then by timestamp)
    ↓
Slice (Top N for priority view)
    ↓
Render (NotificationCard components)
```

## 💡 Recommendations for Stage 1

If implementing the Priority Inbox backend/script:

1. **Language**: Suggest TypeScript/Node.js for consistency with frontend
2. **Output**: Return paginated top N notifications with priority scores
3. **Efficiency**: Use min-heap for continuous notification streams
4. **Testing**: Verify sorting with mixed notification types
5. **Documentation**: See `notification_system_design.md` for detailed requirements

---

## 🌐 Browser Compatibility

- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Mobile**: iOS Safari 12+, Chrome Mobile 90+

---

## 📚 Additional Documentation

- **Design Document**: [`notification_system_design.md`](notification_system_design.md) - System architecture and efficiency analysis
- **Build Verification**: [`BUILD_VERIFICATION.md`](BUILD_VERIFICATION.md) - Build metrics and testing results

---

## 📝 License

Academic submission for evaluation purposes.
