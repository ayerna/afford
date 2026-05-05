# Campus Notifications Systems

A responsive React + TypeScript application for displaying campus notifications with priority ranking and filtering. This repository contains the **Stage 2 Frontend Implementation** of the Campus Notifications microservice.

---

## 📋 Project Overview

### Stage 1: Backend API & Logging Middleware
**✓ Implemented** - Production-ready Express.js API and centralized logging

**[notification_app_be/](notification_app_be/)**:
- Express.js REST API server on port 3001
- JWT Bearer token authentication
- Paginated notifications endpoints with filtering
- Mock data (12 sample notifications)
- Error handling and CORS support
- `GET /notifications` - List all notifications
- `POST /auth/token` - Generate JWT token
- Full API documentation in [notification_app_be/README.md](notification_app_be/README.md)

**[logging_middleware/](logging_middleware/)**:
- Centralized request/response logging library
- Multi-transport support (Console, File)
- Color-coded log levels (DEBUG, INFO, WARN, ERROR)
- Automatic file rotation with backup management
- Structured log records with metadata
- Express middleware integration ready
- Full documentation in [logging_middleware/README.md](logging_middleware/README.md)

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

## 📷 Screenshots & Demo

### Application Views

**Main Dashboard**
![Dashboard](screenshots/Dashboard.png)

**All Notifications - 10 Per Page**
![10 Per Page](screenshots/10%20page.png)

**All Notifications - 5 Per Page**
![5 Per Page](screenshots/5%20page.png)

**Loading State - Fetching Notifications**
![Loading State](screenshots/fetching%20notification.png)

**Filter Controls & Options**
![Filter Controls](screenshots/filtering%20options.png)

**Marking Notification as Viewed**
![Mark as Viewed](screenshots/marking%20as%20viewed.png)

**Priority View - Top 10 Notifications**
![Priority Top 10](screenshots/priority%20notification%2010.png)

**Priority View - Top 5 Notifications**
![Priority Top 5](screenshots/priority%20notification%205.png)

**Filters in Action**
![Filters in Action](screenshots/working%20of%20filters.png)

---

## 🏗️ Repository Structure

```
afford/
├── notification_app_fe/          # Stage 2: Frontend React Application
│   ├── src/
│   │   ├── App.tsx              # Main component (443 lines)
│   │   ├── types.ts             # TypeScript domain model
│   │   ├── theme.ts             # Material UI customization
│   │   ├── api/
│   │   │   └── notifications.ts # API client (bearer token auth)
│   │   ├── components/
│   │   │   ├── NotificationCard.tsx
│   │   │   ├── FeedSkeleton.tsx
│   │   │   └── EmptyState.tsx
│   │   └── utils/
│   │       └── notifications.ts # Priority ranking algorithm
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── notification_app_be/          # Stage 1: Backend Express API
│   ├── src/
│   │   ├── index.ts             # Express server
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── routes/
│   │   │   ├── notifications.ts # Notification endpoints
│   │   │   └── auth.ts          # Authentication endpoints
│   │   ├── middleware/
│   │   │   ├── auth.ts          # JWT verification
│   │   │   └── errorHandler.ts  # Error handling
│   │   └── data/
│   │       └── mock.ts          # Mock notifications
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── logging_middleware/           # Stage 1: Centralized Logging
│   ├── src/
│   │   ├── index.ts             # Logger factory
│   │   ├── types.ts             # Logger interfaces
│   │   └── transports/
│   │       ├── ConsoleTransport.ts
│   │       └── FileTransport.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── notification_system_design.md # Complete system documentation
├── README.md                      # This file
├── BUILD_VERIFICATION.md          # Build metrics and testing
├── screenshots/                   # Application screenshots
│   ├── README.md
│   ├── desktop-all-notifications.png
│   └── mobile-all-notifications.png
└── .gitignore
```

---

## 🚀 Getting Started

### Option 1: Frontend Only (Stage 2)

```bash
cd notification_app_fe
npm install
npm run dev
# Opens at http://localhost:3000
```

Requires `.env.local`:
```
VITE_NOTIFICATION_API_BASE=http://20.207.122.201/evaluation-service/notifications
VITE_NOTIFICATION_API_TOKEN=eyJhbGci...
```

### Option 2: Full Stack (Stage 1 + Stage 2)

**Terminal 1 - Start Backend**:
```bash
cd notification_app_be
npm install
npm run dev
# Server running at http://localhost:3001
```

**Terminal 2 - Start Frontend**:
```bash
cd notification_app_fe
npm install
cp .env.example .env.local
# Edit .env.local to point to http://localhost:3001/notifications
npm run dev
# Opens at http://localhost:3000
```

### Option 3: Backend Only (Stage 1)

```bash
cd notification_app_be
npm install
npm run dev
# API available at http://localhost:3001
```

Example requests:
```bash
# Get token
curl -X POST http://localhost:3001/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "student"}'

# Fetch notifications
curl http://localhost:3001/notifications?page=1&limit=10
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [notification_system_design.md](notification_system_design.md) | Complete architecture, implementation status, tech stack, data flow |
| [notification_app_fe/README.md](notification_app_fe/README.md) | Frontend setup, features, API integration (Stage 2) |
| [notification_app_be/README.md](notification_app_be/README.md) | Backend API setup, endpoints, authentication (Stage 1) |
| [logging_middleware/README.md](logging_middleware/README.md) | Logging library usage, transports, configuration |
| [BUILD_VERIFICATION.md](BUILD_VERIFICATION.md) | Build metrics, bundle size, performance results |
| [screenshots/README.md](screenshots/README.md) | Screenshot guide, capture instructions, demo workflows |

---

## 📋 Prerequisites & Setup

### Prerequisites

- **Node.js 18+** and **npm 9+**
- For external API: Valid evaluation service credentials
- Modern browser (Chrome, Firefox, Safari, Edge)

### Frontend Configuration

To use the external evaluation service API:

```bash
cd notification_app_fe

# Register with evaluation service
curl -X POST http://20.207.122.201/evaluation-service/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your_email",
    "name":"Your Name",
    "rollNo":"YOUR_ROLL_NO",
    "accessCode":"ACCESS_CODE"
  }'

# Get authorization token
curl -X POST http://20.207.122.201/evaluation-service/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your_email",
    "rollNo":"YOUR_ROLL_NO",
    "accessCode":"ACCESS_CODE"
  }'
```

Then configure `.env.local`:

```env
VITE_NOTIFICATION_API_BASE=http://20.207.122.201/evaluation-service/notifications
VITE_NOTIFICATION_API_TOKEN=your_bearer_token
```

### Development Workflow

#### Terminal 1: Backend (Optional)

```bash
cd notification_app_be
npm install
npm run dev
# Backend running at http://localhost:3001
```

#### Terminal 2: Frontend

```bash
cd notification_app_fe
npm install
cp .env.example .env.local
# Edit .env.local with your API configuration
npm run dev
# Frontend running at http://localhost:3000
```

### Production Build

**Frontend:**
```bash
cd notification_app_fe
npm run build    # Outputs to dist/
npm run preview  # Test production build locally
```

**Backend:**
```bash
cd notification_app_be
npm run build    # Outputs to dist/
npm run start    # Start production server
```

Build Output (Frontend):
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
