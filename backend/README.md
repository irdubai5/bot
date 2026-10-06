# Backend

Express API for the Dprj application.

## Run

```bash
npm ci
npm start
```

The server binds to `0.0.0.0` and uses the platform-provided `PORT` when available (default: `3000`).

## Health check

`GET /api/health`

## Environment

Copy `.env.example` to `.env` for local development. Never commit real credentials or secrets.
