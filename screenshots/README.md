# Campus Notifications Frontend - Screenshots & Demo Guide

This folder contains screenshots of the Campus Notifications application showing key features and workflows.

## Screenshots Overview

### Desktop Views (1024px+ width)

#### 1. All Notifications View
- **File**: `desktop-all-notifications.png`
- **Shows**: 
  - Header with app title and refresh button
  - Tab navigation (All Notifications | Priority Notifications)
  - Filter controls (Type, Page Size, Top N)
  - Notification cards in 2-column grid layout
  - Pagination controls (Previous/Next)
  - Color-coded chips by notification type

#### 2. Filter & Control Panel
- **File**: `desktop-controls.png`
- **Shows**:
  - Tab selection and switching
  - Type filter dropdown (All, Placement, Result, Event)
  - Page size selector (5, 8, 10, 15)
  - Top N selector (5, 10, 15, 20)
  - Current filter display
  - Viewed items counter

#### 3. Hero Section
- **File**: `desktop-hero.png`
- **Shows**:
  - Application branding and description
  - Statistics panel (Active filter, Page size, Top N, Viewed count)
  - Gradient background design

### Mobile Views (390px width)

#### 4. Mobile All Notifications
- **File**: `mobile-all-notifications.png`
- **Shows**:
  - Responsive single-column layout
  - Stacked filter controls
  - Touch-friendly button sizing
  - Notification cards optimized for mobile

## How to Capture Your Own Screenshots

### Prerequisites
- Application running at `http://localhost:3000`
- Modern browser (Chrome, Firefox, Safari, Edge)
- Valid API credentials in `.env.local`

### Step 1: Start the Development Server

```bash
cd notification_app_fe
npm run dev
```

The app will be available at `http://localhost:3000`.

### Step 2: Capture Desktop Screenshots

#### Using Browser DevTools

**Chrome/Edge:**
1. Open DevTools (`F12` or `Cmd+Option+I`)
2. Go to the **Console** tab
3. Run: `document.documentElement.scrollTop = 0`
4. Use **Ctrl+Shift+S** or **Command+Shift+4** to capture
5. Screenshot the viewport

**Firefox:**
1. Right-click anywhere on page → **Take Screenshot**
2. Click **Save** to save to downloads
3. Or use **Cmd+Shift+S** on macOS

#### Full Page Capture

**Chrome/Edge:**
1. Open DevTools
2. Click the three dots menu (⋮)
3. Select **Capture full page screenshot**

**Firefox:**
1. Right-click on page
2. Select **Take Screenshot**
3. Choose **Save full page**

### Step 3: Capture Mobile Screenshots

#### Using Browser DevTools Responsive Mode

**Chrome/Edge:**
1. Open DevTools (`F12`)
2. Click **Device Toolbar** icon or press `Ctrl+Shift+M`
3. Select **iPhone 12** or **Pixel 5** preset
4. Navigate to the view you want to capture
5. Use **Ctrl+Shift+S** to take screenshot

**Firefox:**
1. Open DevTools
2. Click **Responsive Design Mode** (Ctrl+Shift+M)
3. Set width to `390px` and height to `844px`
4. Right-click → **Take Screenshot**

### Step 4: Organize Screenshots

Create the following structure in `/screenshots/`:

```
screenshots/
├── desktop/
│   ├── all-notifications.png
│   ├── priority-notifications.png
│   ├── filters-and-controls.png
│   ├── hero-section.png
│   └── pagination-example.png
├── mobile/
│   ├── all-notifications.png
│   ├── priority-notifications.png
│   ├── filter-dropdown.png
│   └── mark-as-viewed.png
└── README.md
```

## Workflow Screenshots - Step-by-Step

### Initial Load
1. App loads with hero section showing statistics
2. Skeleton cards appear while data fetches
3. Notifications populate in grid layout

### Filtering Notifications
1. Click **Type** dropdown
2. Select **Placement** (or Result/Event)
3. Notifications refilter automatically
4. Page resets to page 1
5. Count updates in statistics panel

### Pagination
1. Browse first page (default: 8 items)
2. Click **Next** button
3. Page 2 notifications load
4. **Previous** button becomes enabled
5. Click **Next** again for page 3, etc.

### Marking as Viewed
1. Hover over notification card
2. Click checkmark icon in top-right
3. Card status changes from "New" to "Viewed"
4. Viewed counter in hero section increments
5. State persists in localStorage (reload page - stays marked)

### Changing Page Size
1. Click **Page size** dropdown
2. Select **10** (or 5, 15)
3. Notifications re-fetch with new limit
4. Grid adjusts to show new count per page
5. Pagination resets

### Switching to Priority View
1. Click **Priority Notifications** tab
2. Loading skeleton appears
3. Top N notifications display (default: 10)
4. Cards sorted by priority (Placement > Result > Event)
5. Click **Top N** dropdown to change window size (5, 15, 20)

### Refreshing Data
1. Click **Refresh** button (circular arrow icon in header)
2. Loader spins during fetch
3. Data re-fetches from API
4. Viewed state preserved (localStorage)
5. New notifications appear at top if available

## Tips for Better Screenshots

- **Maximize contrast**: Use desktop view at 1024px+ width for clarity
- **Show data variety**: Include mixed notification types (Placement, Result, Event)
- **Capture state changes**: Before/after filter, before/after mark as viewed
- **Include UI elements**: Ensure tabs, filters, buttons are visible
- **Test on multiple devices**: Desktop, tablet, mobile viewports
- **Highlight key features**: 
  - Priority color-coding (green > orange > blue)
  - "New" vs "Viewed" status
  - Priority scores (1, 2, 3)

## Browser DevTools Keyboard Shortcuts

| Action | Chrome/Edge | Firefox | Safari |
|--------|------------|---------|--------|
| DevTools | F12 / Ctrl+Shift+I | F12 / Ctrl+Shift+I | Cmd+Option+I |
| Responsive Mode | Ctrl+Shift+M | Ctrl+Shift+M | - |
| Screenshot | Ctrl+Shift+S | Cmd+Shift+S | - |
| Element Inspector | Ctrl+Shift+C | Ctrl+Shift+C | Cmd+Option+C |

## Video Capture (Optional)

For dynamic demonstrations, record a video of your workflow:

**Windows (Built-in)**
- Press `Windows + G` to open Game Bar
- Click **Record** to capture screen
- Save MP4 to `screenshots/demo-video.mp4`

**macOS (Built-in)**
- Press `Cmd+Shift+5`
- Select area or window
- Save to Desktop or Documents

**Cross-platform (OBS Studio)**
- Download: https://obsproject.com
- Set up scene with browser window
- Record at 1080p, 30fps for clear playback

## Accessibility Checklist

When capturing screenshots, verify:
- [ ] Text is readable and not cropped
- [ ] Color-coding is distinguishable (not relying only on color)
- [ ] Interactive elements (buttons, dropdowns) are visible
- [ ] Loading states are clear (skeleton cards, spinners)
- [ ] Error messages are legible
- [ ] Responsive design shows at both desktop and mobile sizes
