# Campus Notifications Backend API

Stage 1: Backend API implementation for the Campus Notifications System.

## Overview

Express.js REST API server that provides:
- Paginated notification endpoints
- Bearer token authentication (JWT)
- Mock data for development and testing
- Centralized error handling
- CORS support for frontend integration

## Features

### Endpoints

#### Public (No Authentication)

- **GET `/health`** - Server health check
- **POST `/auth/token`** - Generate JWT Bearer token
- **GET `/auth/verify`** - Verify token validity
- **GET `/notifications`** - List all notifications (paginated)
  - Query params: `page` (default: 1), `limit` (default: 10), `notification_type` (Placement|Result|Event|All)
- **GET `/notifications/:id`** - Get specific notification by ID
- **GET `/notifications/type/:type`** - Get all notifications of a type

#### Protected (Bearer Token Required)

- **GET `/api/status`** - Check API status (requires Bearer token)

### Technology Stack

- **Express.js**: 4.18.2 - Web framework
- **TypeScript**: 5.8.3 - Type safety
- **JWT**: 9.0.0 - Token authentication
- **CORS**: 2.8.5 - Cross-origin support
- **dotenv**: 16.3.1 - Environment configuration

### Project Structure

```
notification_app_be/
├── src/
│   ├── index.ts              # Express server entry point
│   ├── types.ts              # TypeScript type definitions
│   ├── middleware/
│   │   ├── auth.ts           # Bearer token authentication
│   │   └── errorHandler.ts   # Error handling middleware
│   ├── routes/
│   │   ├── notifications.ts  # Notification endpoints
│   │   └── auth.ts           # Authentication endpoints
│   └── data/
│       └── mock.ts           # Mock notification data
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── .env.example              # Environment template
└── README.md                 # This file
```

## Setup

### Prerequisites

- Node.js 18+ (npm 9+)

### Installation

```bash
# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# (Optional) Update .env with custom configuration
```

### Configuration

Edit `.env` to configure:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
LOG_LEVEL=debug
```

## Development

### Run in Watch Mode

```bash
npm run dev
```

Server starts at `http://localhost:3001`

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## Usage Examples

### Get JWT Token

```bash
curl -X POST http://localhost:3001/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "student@campus.edu"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "username": "student@campus.edu",
    "role": "user"
  }
}
```

### Fetch All Notifications

```bash
curl http://localhost:3001/notifications?page=1&limit=10
```

### Fetch Specific Type

```bash
curl http://localhost:3001/notifications?notification_type=Placement&limit=5
```

### Fetch with Authentication

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/status
```

### Get Specific Notification

```bash
curl http://localhost:3001/notifications/618c4ee3-76e1-4efd-a487-fb65fc56b3fd
```

## API Response Format

### Success Response

```json
{
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 42,
  "hasMore": true
}
```

### Error Response

```json
{
  "error": "Bad Request",
  "message": "Invalid page number",
  "statusCode": 400,
  "timestamp": "2026-05-02T10:30:00.000Z"
}
```

## Mock Data

The API includes 12 pre-configured notifications:

- **Placement**: 4 hiring announcements
  - Meta Platforms Inc.
  - Broadcom Inc.
  - Nvidia Corporation
  - Amazon Web Services

- **Result**: 4 academic results
  - Mid-semester exams
  - Internal assessments
  - End-semester results

- **Event**: 4 campus events
  - Tech fest
  - Induction
  - Hackathon
  - Web development workshop

Generate additional mock data using `generateMockNotifications(count)` function.

## Authentication Flow

1. **Get Token**: POST to `/auth/token` with username
2. **Receive JWT**: Token includes user info and 24-hour expiration
3. **Use Token**: Include in `Authorization: Bearer <token>` header
4. **Verify**: Middleware validates token signature and expiration

## Error Handling

All errors follow standardized format with:
- `error`: Error category
- `message`: Human-readable description
- `statusCode`: HTTP status code
- `timestamp`: ISO 8601 timestamp

Common error codes:
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## CORS Configuration

Configure allowed origins in `.env`:

```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,https://yourdomain.com
```

## Logging

Request/response logging outputs to console:

```
[2026-05-02T10:30:00.000Z] GET /notifications
[2026-05-02T10:30:00.100Z] POST /auth/token
```

For advanced logging, integrate with `logging_middleware` package.

## Future Enhancements

### Stage 1 Roadmap

- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] Persistent authentication (user database)
- [ ] Advanced filtering and search
- [ ] Notification creation/update/delete endpoints
- [ ] Rate limiting
- [ ] Request validation (JSON Schema)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] Logging integration (centralized logging)
- [ ] Monitoring and metrics
- [ ] Docker containerization
- [ ] CI/CD pipeline

### Integration with Frontend (Stage 2)

The backend API is designed to work with the frontend:

1. Frontend fetches notifications from `/notifications` endpoint
2. Frontend uses token from `/auth/token` for authentication
3. Backend supports pagination and filtering as required by frontend

Frontend environment setup:

```env
VITE_NOTIFICATION_API_BASE=http://localhost:3001/notifications
VITE_NOTIFICATION_API_TOKEN=<token-from-/auth/token>
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change PORT in .env
PORT=3002
```

### CORS Errors

- Check `CORS_ORIGIN` in `.env` includes your frontend URL
- Ensure `Authorization` and `Content-Type` are in `allowedHeaders`

### Authentication Failures

- Verify JWT_SECRET matches between server and token generation
- Check token hasn't expired (24-hour validity)
- Ensure Bearer token format: `Authorization: Bearer <token>`

## Contributing

When adding new endpoints:

1. Define types in `src/types.ts`
2. Create route handlers in `src/routes/`
3. Export router from route file
4. Mount router in `src/index.ts`
5. Add error handling with `APIError` class
6. Document in this README

## License

MIT
