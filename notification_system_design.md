# Notification System Design

## Overview
This project is a frontend-only campus notifications dashboard built with React and TypeScript. It consumes the evaluation service notifications API, renders all notifications with filtering and pagination, and highlights the top priority notifications using the required business rules.

## Goals
- Show all notifications in a clean, responsive layout.
- Show a separate priority view for the top N notifications.
- Support filtering by notification type and pagination.
- Distinguish new and viewed notifications in the UI.
- Keep the codebase readable, modular, and easy to extend.

## API Contract
Base endpoint:

`GET http://20.207.122.201/evaluation-service/notifications`

Supported query parameters:
- `limit`
- `page`
- `notification_type`

Expected fields:
- `ID`
- `Type`
- `Message`
- `Timestamp`

## Priority Rules
Priority order:
1. Placement
2. Result
3. Event

Sorting order:
1. Priority rank
2. Latest timestamp first

The priority ranking is encoded as a simple map and used both in the top N selector and the priority tab.

## Frontend Architecture
### Structure
- `src/api` for HTTP calls and request shaping.
- `src/components` for reusable cards, chips, and skeleton states.
- `src/hooks` for data loading and local persistence.
- `src/utils` for sorting, date formatting, and notification classification.
- `src/theme` for Material UI theme setup.

### State Handling
The application keeps three categories of state:
- Server state: fetched notifications, loading, and error states.
- UI state: active tab, filter, page number, and top N selection.
- Local state: viewed notification IDs persisted in `localStorage`.

## New vs Viewed Notifications
Viewed notifications are stored locally in `localStorage` as an ID set. On first render, everything is treated as new. When a user opens a notification card, its ID is added to the viewed set and the UI updates immediately.

## Continuous Updates
Because there is no database and the data comes from a remote API, the app can use polling for near-real-time refresh.
- Default approach: polling every 30 to 60 seconds.
- Optional enhancement: WebSocket/SSE if the service later supports push updates.
- On refresh, merge new data with the viewed set so already seen items stay marked as viewed.

## Efficient Top N Maintenance
The top N list is derived from the sorted notifications.
For continuous incoming notifications, a min-heap of size N is the most efficient maintenance strategy.

### Heap Strategy
- Assign each notification a comparable priority key.
- Keep a min-heap with the weakest item at the root.
- For each new notification:
  - If heap size is below N, push it.
  - Otherwise compare against the root.
  - Replace the root if the new notification outranks it.

### Complexity
- Insert: `O(log N)`
- Compare against heap root: `O(1)`
- Full derivation from a batch: `O(M log N)` for `M` notifications

If the dataset is small or only loaded on demand, a full sort is acceptable and simpler. For continuous streams, the heap approach scales better.

## Error Handling
- Network failure: show a clear inline error state with retry.
- Empty response: show an empty-state illustration or message.
- Loading: use skeleton cards and disable stale controls while fetching.

## UX Notes
- Keep the layout compact and readable.
- Highlight Placement items more strongly than Result and Event.
- Use responsive cards and stacked filters on mobile.
- Make the priority tab visually distinct so the important notifications are obvious.

## Folder Naming
The repository keeps separate folders for frontend, backend, and middleware tracks so each stage can be developed independently without mixing concerns.
