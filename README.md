# URL Shortener API

Node.js REST API for URL shortening with JWT authentication, PostgreSQL (Prisma), rate limiting, and Swagger documentation.

## Stack

- Express.js
- PostgreSQL + Prisma ORM
- JWT authentication
- Swagger UI at `/api-docs`

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/urls` | Yes | List user's URLs |
| POST | `/api/urls` | Yes | Create short URL |
| GET | `/:code` | No | Redirect to original URL |
| GET | `/api-docs` | No | Swagger UI |

## Local Development

```bash
cp .env.example .env
docker compose up -d
npm install
npx prisma db push
npm run dev
```

Visit http://localhost:3000/api-docs

## Deploy to Render

1. Push this repo to GitHub
2. Create a new **Blueprint** on Render using `render.yaml`
3. Render will provision PostgreSQL and the web service automatically

## Author

[Nimesh Subedi](https://subedi-nimesh.github.io)
