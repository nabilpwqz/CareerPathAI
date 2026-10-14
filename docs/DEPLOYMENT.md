# Cloud Deployment Guide

## Target Platforms
CareerPath AI is designed for seamless deployment on serverless edge platforms such as **Vercel** or **AWS Amplify**, with MongoDB Atlas as the primary persistence engine.

## Environment Variables
The following variables must be configured in your deployment settings:

| Variable | Description | Required in Production |
|---|---|---|
| `NODE_ENV` | Runtime environment (`production`) | Yes |
| `JWT_SECRET` | 256-bit cryptographic secret for session tokens | Yes |
| `MONGODB_URI` | MongoDB Atlas connection string | Recommended |
| `GEMINI_API_KEY` | Google AI Studio Gemini API Key | Optional (Fallback active) |
| `NEXT_PUBLIC_FIREBASE_*` | Client Firebase web credentials | Optional |

## Deployment on Vercel
1. Connect repository on [vercel.com](https://vercel.com).
2. Set Framework Preset to **Next.js**.
3. Supply required environment variables.
4. Deploy! Next.js App Router will generate optimized serverless lambda routes and static asset bundles.
