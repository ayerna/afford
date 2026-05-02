# Campus Notifications System

A responsive React + TypeScript application for displaying campus notifications with priority ranking and filtering.

## Features

- **All Notifications Tab**: Browse paginated list of notifications with filters
- **Priority Notifications Tab**: View top N notifications ranked by importance
- **Type Filtering**: Filter by Placement, Result, or Event
- **Priority Ranking**: Automatic sorting by notification type and recency
- **Viewed Tracking**: Local storage-based tracking of viewed notifications
- **Responsive Design**: Mobile-friendly Material UI interface
- **Real-time Refresh**: Refresh button to fetch latest notifications

## Priority Rules

Notifications are ranked by type (highest to lowest):
1. **Placement** (priority: 3)
2. **Result** (priority: 2)
3. **Event** (priority: 1)

Within the same priority, newer notifications appear first.

## Setup

### Prerequisites

- Node.js 16+ and npm
- Valid evaluation service credentials

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

2. Register with the evaluation service and obtain your token:
```bash
# Register to get clientID and clientSecret
curl -X POST http://20.207.122.201/evaluation-service/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your_email","name":"Your Name","mobileNo":"...","githubUsername":"...","rollNo":"...","accessCode":"..."}'

# Get authorization token
curl -X POST http://20.207.122.201/evaluation-service/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"...","name":"...","rollNo":"...","accessCode":"...","clientID":"...","clientSecret":"..."}'
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

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Architecture

```
src/
├── api/              # API client functions
├── components/       # Reusable React components
├── utils/            # Utility functions (sorting, formatting)
├── types.ts          # TypeScript type definitions
├── theme.ts          # Material UI theme configuration
├── App.tsx           # Main application component
└── main.tsx          # React entry point
```

## State Management

- **Server State**: Fetched notifications and loading/error states managed per view
- **UI State**: Tab selection, filter choice, pagination, top N size
- **Local State**: Viewed notification IDs persisted in localStorage

## Key Decisions

- **No Database**: All data flows through the evaluation service API
- **Viewed Tracking**: Stored locally to distinguish new from previously seen notifications
- **Top N Efficiency**: Derived from sorted list; can be optimized to min-heap for continuous streams
- **Error Handling**: Inline errors with retry capability and empty states

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

Academic use for evaluation purposes.
