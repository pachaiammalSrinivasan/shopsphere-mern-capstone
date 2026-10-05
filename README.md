# ShopSphere — MERN Full-Stack Deployment Capstone

A submission-ready MERN e-commerce product catalog demonstrating:
- React modular frontend
- Client-side routing with React Router
- Express REST API
- MongoDB support with automatic demo-data fallback
- Responsive UI
- Search, category filtering and product details
- Production build/minification through Vite
- Deployment-ready configuration for Vercel (frontend) and Render (backend)

## Run locally

### Backend
```bash
cd backend
npm install
copy .env.example .env
npm start
```

The API runs on `http://localhost:5000`.

MongoDB is optional for the demo. If `MONGODB_URI` is empty, the API uses built-in demo products.

### Frontend
Open another terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs on the Vite URL shown in the terminal.

For local development the default API URL is `http://localhost:5000/api`.

## Production deployment

### 1. Backend — Render
Create a new Web Service from the `backend` folder:
- Build command: `npm install`
- Start command: `npm start`
- Add environment variable:
  - `MONGODB_URI` = your MongoDB Atlas connection string (optional)
  - `PORT` = `10000`

After deployment, copy the Render service URL.

### 2. Frontend — Vercel
Create a new project from the `frontend` folder:
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  - `VITE_API_URL` = `https://YOUR-RENDER-SERVICE.onrender.com/api`

The Vercel deployment URL is the public URL to submit.

## Suggested submission description

"ShopSphere is a full-stack MERN e-commerce product catalog built with React, React Router, Node.js, Express and MongoDB-ready REST APIs. The application uses modular components, client-side routing, responsive design, optimized Vite production builds and a deployed frontend/backend architecture. Users can browse products, search and filter by category, open product details and view a responsive shopping interface."
