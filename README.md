# SQL Newsletter Backend

Backend service for handling newsletter subscriptions, CSV storage, and email notifications.

## Quick Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure your email settings
4. Run: `npm run dev` (development) or `npm start` (production)

## Environment Setup

### Gmail Configuration (Recommended)
1. Enable 2-factor authentication in Gmail
2. Generate an App Password in Gmail Settings
3. Set these in your `.env`:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   ```

### Render Deployment
1. Push this code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repo
4. Add environment variables in Render dashboard
5. Deploy!

## API Endpoints

- `POST /api/subscribers/subscribe` - Subscribe to newsletter
- `GET /api/subscribers/all` - Get all subscribers
- `GET /api/subscribers/export` - Download CSV
- `GET /api/health` - Health check

## Features

✅ CSV storage with automatic file creation
✅ Beautiful welcome emails
✅ Duplicate email prevention
✅ Rate limiting and security
✅ CORS configured for frontend
✅ Error handling and logging
