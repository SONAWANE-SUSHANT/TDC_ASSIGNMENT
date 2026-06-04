# Deployment

Frontend on Vercel:

```env
VITE_API_BASE_URL=https://tdc-assignment.onrender.com/api
```

Backend on Render:

```env
NODE_ENV=production
MONGODB_URI=<your MongoDB connection string>
CLIENT_URL=https://tdc-assignment-32ud.vercel.app
GEMINI_API_KEY=<optional Gemini API key>
DUMMY_AUTH_EMAIL=admin@matchmaker.ai
DUMMY_AUTH_PASSWORD=admin123
```

After setting environment variables, redeploy both services. The backend exposes
both `/` and `/health` for quick checks.
