# SquadUp Backend
Node.js + Express + MongoDB backend for SquadUp.

## Run locally
```bash
cd squadup-backend
npm install
cp .env.example .env
npm run dev
```

## APIs
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- GET `/api/posts`
- POST `/api/posts`
- POST `/api/posts/:id/calls`
- PATCH `/api/posts/:postId/calls/:callId`
- DELETE `/api/posts/:id`
