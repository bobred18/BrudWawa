# BrudWawa

A civic issue-reporting web application for Warsaw. Residents photograph city/environmental problems (litter, graffiti, potholes, damaged infrastructure, pollution, dangerous trees), and an AI vision model automatically classifies the issue, writes a title/description, estimates a threat level, and suggests the responsible city service. Reports are pinned on a map where the community can vote and comment, and admins moderate submissions.

> University project for the **Web Application Technologies** course.

## Features

- **AI-assisted reporting** — upload a photo and Google Gemini fills in the category, description, threat level, and suggested service.
- **Interactive map** — browse reports geolocated across the city (PostGIS + Google Maps).
- **Community engagement** — vote and comment on reports; track status (pending → approved/rejected → resolved).
- **Real-time notifications** — live updates over WebSockets.
- **Statistics dashboard** — charts of reports by category, district, and status.
- **Auth & roles** — JWT authentication with regular-user and admin roles, plus an admin moderation panel.

## Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | Angular 21, TypeScript, Tailwind CSS, Chart.js, Google Maps |
| Backend      | FastAPI (Python), SQLAlchemy, Alembic, Pydantic |
| Database     | PostgreSQL + PostGIS (geospatial) |
| Storage      | MinIO (S3-compatible) for uploaded images |
| Cache/PubSub | Redis |
| AI           | Google Gemini (vision) |
| Push         | Firebase Admin |
| Infra        | Docker Compose, Caddy reverse proxy, GitHub Actions CI/CD |

## Architecture

```
Browser ──► Caddy ──► Angular (static SPA)
                       └──► FastAPI ──► PostgreSQL + PostGIS
                                   ├──► MinIO (images)
                                   ├──► Redis (cache / pub-sub)
                                   └──► Gemini API (image analysis)
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- A Google Gemini API key (for image analysis)

### Run with Docker (recommended)

```bash
# 1. Configure environment
cp .env.example .env        # then edit the values (DB password, JWT secret, Gemini key…)

# 2. Build and start everything
docker compose up --build
```

- Frontend: served by Caddy (production), or run the dev server below for local work
- API:      http://localhost:8000
- API docs: http://localhost:8000/docs
- MinIO console: http://localhost:9001

### Frontend dev server

```bash
cd frontend
npm install
npm start          # Angular dev server at http://localhost:4200
```

### Backend (without Docker)

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head        # apply database migrations
uvicorn app.main:app --reload
```

## Environment Variables

See [`.env.example`](.env.example). Key values:

| Variable                  | Description |
|---------------------------|-------------|
| `POSTGRES_*`              | PostgreSQL database credentials |
| `MINIO_*`                 | Object storage credentials and bucket |
| `JWT_SECRET`              | Secret for signing auth tokens |
| `GEMINI_API_KEY`          | Google Gemini API key for image analysis |
| `FIREBASE_CREDENTIALS_B64`| Base64-encoded Firebase service-account JSON (push notifications) |

## Testing

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm test
```

## Project Structure

```
backend/        FastAPI app (API routes, models, services, migrations)
  app/api/      REST + WebSocket endpoints
  app/models/   SQLAlchemy models (users, reports, votes, comments)
  app/services/ Gemini, MinIO storage, Firebase, WebSocket helpers
  alembic/      Database migrations
frontend/       Angular single-page app
  src/app/      Components: home, map, add-issue, issue-view, statistics, login
docker/         DB init scripts
.github/        CI/CD workflows
```
