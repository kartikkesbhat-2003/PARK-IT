# Render Deployment Guide for PARK-IT Backend

## Quick Fix for Current Deployment

The deployment is failing because of the build command. Here's how to fix it:

### 1. In Render Dashboard:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `server` (if your backend is in a subdirectory)

### 2. Environment Variables Required:
Set these in your Render dashboard under Environment Variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FROM_EMAIL=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

## Step-by-Step Deployment

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with your GitHub account

### 2. Connect Repository
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the PARK-IT repository

### 3. Configure Service
- **Name**: `park-it-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `server` (since backend is in server folder)

### 4. Build & Deploy Settings
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 5. Environment Variables
Add all the environment variables listed above in the Render dashboard.

### 6. Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Note your backend URL (e.g., `https://your-app.onrender.com`)

## Troubleshooting

### Build Failures
- **Issue**: TypeScript compilation errors
- **Solution**: The missing methods have been added to authentication service

### Runtime Errors
- **Issue**: Missing environment variables
- **Solution**: Ensure all required environment variables are set in Render dashboard

### CORS Issues
- **Issue**: Frontend can't connect to backend
- **Solution**: Update CORS configuration in `server/src/index.ts` with your actual frontend domain

## Testing Deployment

1. **Health Check**: Visit `https://your-backend.onrender.com/health`
2. **API Test**: Test your API endpoints
3. **Database**: Ensure MongoDB connection works

## Next Steps

After successful backend deployment:
1. Note your backend URL
2. Update frontend environment variables with backend URL
3. Deploy frontend to Netlify
4. Update CORS with actual frontend domain 