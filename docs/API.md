# REST API Specification (v1)

Base URL: `/api/v1`

## Standard Envelopes

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Optional descriptive status"
}
```

### Error Response
```json
{
  "error": "Error description message",
  "code": "ERROR_CODE",
  "requestId": "req_unique_id"
}
```

## Endpoints

### Authentication
- `POST /api/v1/auth/register`
  - Body: `{ email, password, name, targetRole }`
  - Returns: `{ user, token }` with HttpOnly cookie.
- `POST /api/v1/auth/login`
  - Body: `{ email, password, isDemo }`
  - Returns: `{ user, token }` with HttpOnly cookie.
- `POST /api/v1/auth/firebase-sync`
  - Body: `{ idToken }`
  - Returns: Synchronized user and session.
- `GET /api/v1/auth/session`
  - Returns: Authenticated user profile or 401.
- `POST /api/v1/auth/logout`
  - Clears session cookies.

### Career & Roadmaps
- `POST /api/v1/career/roadmaps`
  - Body: `{ targetRole, currentLevel, yearsOfExperience, targetTimelineMonths }`
  - Returns: Generated 3-phase technical roadmap.
- `PATCH /api/v1/career/tasks`
  - Body: `{ roadmapId, taskId, completed }`
  - Returns: Updated roadmap and completion percentage.

### Resumes & Job Analysis
- `GET /api/v1/resumes` — List all candidate resumes.
- `POST /api/v1/resumes` — Save custom resume draft.
- `POST /api/v1/resumes/tailor`
  - Body: `{ resumeId, jobDescription, targetRole }`
  - Returns: ATS score, matched keywords, missing skills, tailored markdown.

### Interviews & Assessments
- `POST /api/v1/interviews/sessions` — Start new mock interview session.
- `POST /api/v1/interviews/sessions/:id/answers` — Submit answer for real-time STAR evaluation.

### Observability
- `GET /api/v1/health` — Platform status, database connectivity, and uptime metrics.
