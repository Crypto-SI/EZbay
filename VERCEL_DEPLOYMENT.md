# Deploying EZbay to Vercel

This guide explains how to deploy EZbay on Vercel, separating the frontend and backend into two different Vercel projects.

## Prerequisites

1. A GitHub account with the EZbay repository
2. A Vercel account linked to your GitHub account
3. A Hyperbolic API key

## Step 1: Deploy the Backend API

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Configure as follows:
   - **Project Name**: `ezbay-api` (or your preferred name)
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (uses Vercel's auto-detection)
   - **Output Directory**: Leave empty
   - **Install Command**: `pip install -r requirements.txt`

5. Add the following Environment Variables:
   - `HYPERBOLIC_API_KEY`: Your Hyperbolic API key
   - `ALLOWED_ORIGINS`: `https://ezbay-front.vercel.app,http://localhost:5173` (adjust to match your frontend URL)
   - `DEFAULT_MODEL`: `meta-llama/Meta-Llama-3.1-8B-Instruct`
   - `LARGE_MODEL`: `meta-llama/Llama-3.3-70B-Instruct`

6. Click "Deploy"

## Step 2: Deploy the Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository again
4. Configure as follows:
   - **Project Name**: `ezbay-front` (or your preferred name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: `.` (project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add the following Environment Variables:
   - `VITE_API_URL`: The URL of your deployed backend API (e.g., `https://ezbay-api.vercel.app`)

6. Click "Deploy"

## Step 3: Testing the Deployment

1. After both deployments are complete, visit your frontend URL (e.g., `https://ezbay-front.vercel.app`)
2. Test the application by generating a listing
3. If there are CORS errors, check that the ALLOWED_ORIGINS in the backend environment variables includes your frontend URL

## Troubleshooting

- **CORS Issues**: Make sure your backend's `ALLOWED_ORIGINS` includes your frontend's Vercel URL
- **API Connection Errors**: Check that the `VITE_API_URL` is correctly pointing to your backend
- **Timeout Errors**: If you encounter timeout errors during listing generation, you might need to adjust your Vercel plan for longer function execution times

## Continuous Deployment

Both projects will automatically deploy when you push changes to the `vercel` branch of your repository. To ensure this works properly:

1. Make changes to your code
2. Commit to the `vercel` branch
3. Push to GitHub
4. Vercel will automatically deploy the updates

Remember that your frontend and backend are separate projects in Vercel, so you'll need to check both deployments when making changes. 