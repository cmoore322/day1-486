# Connor Blog SPA

This is a small Single Page Application (SPA) demonstrating CRUD operations with Node.js, Express, and MongoDB.

Stack:
- Node.js + Express
- MongoDB (mongodb driver)
- RESTful API
- Frontend: Bootstrap 5, normalize.css, jQuery

Features:
- Create / Read / Update / Delete posts
- Uses environment variables for secrets (dotenv)
- Development convenience: nodemon

Getting started
1. Copy `.env.example` to `.env` and set `MONGODB_URI` and other values.
2. Install dependencies: `npm install`
3. Start the app: `npm start` (nodemon will watch changes)
4. Open http://localhost:3000

API endpoints
- POST /api/posts
- GET /api/posts
- GET /api/posts/:id
- PUT /api/posts/:id
- DELETE /api/posts/:id

Notes
- This repo contains a `.env.example`. Never commit your real `.env` to source control.
- Author: cmoore322
