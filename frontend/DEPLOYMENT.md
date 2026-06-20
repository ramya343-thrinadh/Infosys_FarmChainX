# Vercel Deployment Guide

This file explains how to deploy the `frontend` folder to Vercel.

## Prerequisites

1. Create a Vercel account at https://vercel.com/signup
2. Connect your GitHub account to Vercel
3. Ensure your repository is pushed to GitHub: `https://github.com/ramya343-thrinadh/Infosys_FarmChainX`

## Frontend deployment settings

Use these settings when creating the Vercel project:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: Vite

## Environment variable

Add this environment variable in Vercel project settings:

- `VITE_API_BASE_URL` = `https://<your-backend-domain>/api`

The frontend will use this value to call backend APIs. Replace `<your-backend-domain>` with your actual deployed backend URL.

## Recommended Vercel deploy steps

### Option A: Web UI
1. Open Vercel dashboard
2. Click **New Project**
3. Select your GitHub repository `ramya343-thrinadh/Infosys_FarmChainX`
4. Set the root directory to `frontend`
5. Set build command to `npm run build`
6. Set output directory to `dist`
7. Add the environment variable `VITE_API_BASE_URL`
8. Deploy

### Option B: Vercel CLI
```bash
npm install -g vercel
cd c:\Users\HP\Desktop\FarmChainX_Group-main\frontend
vercel login
vercel --prod
vercel env add VITE_API_BASE_URL production
```

## Local verification

Before deployment, verify the frontend build locally:

```bash
cd frontend
npm install
npm run build
```

A successful build indicates the frontend is ready for Vercel.

## Important note

- If you do not have a backend deployed yet, you can still deploy the frontend, but API calls will fail until `VITE_API_BASE_URL` points to a working backend.
- Once the backend is live, update `VITE_API_BASE_URL` in Vercel to the backend `/api` URL.
