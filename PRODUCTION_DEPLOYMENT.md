# Production Deployment Guide for API URL

This guide will help you deploy your Next.js app to production and get the API URL for your Vapi workflow.

## Option 1: Deploy to Vercel (Recommended - Easiest)

Vercel is the company behind Next.js and offers seamless deployment.

### Step 1: Prepare Your Project

1. **Make sure your code is committed to Git**:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Create a `.gitignore`** if you don't have one (make sure `.env.local` is ignored):
   ```
   .env.local
   .env*.local
   node_modules
   .next
   ```

### Step 2: Deploy to Vercel

1. **Go to [https://vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository**:
   - Select your GitHub repository
   - Click "Import"

5. **Configure Project Settings**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (if project is in root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

6. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add ALL your variables from `.env.local`:
     ```
     NEXT_PUBLIC_VAPI_WEB_TOKEN=your-token
     NEXT_PUBLIC_VAPI_WORKFLOW_ID=your-workflow-id
     GOOGLE_GENERATIVE_AI_API_KEY=your-key
     NEXT_PUBLIC_FIREBASE_API_KEY=your-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-id
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_CLIENT_EMAIL=your-email
     FIREBASE_PRIVATE_KEY=your-private-key
     ```
   - **Important**: For `FIREBASE_PRIVATE_KEY`, paste the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   - Set environment to **Production**, **Preview**, and **Development**

7. **Click "Deploy"**

### Step 3: Get Your Production URL

1. **Wait for deployment to complete** (usually 2-3 minutes)
2. **Once deployed**, you'll see:
   - **Production URL**: `https://your-project-name.vercel.app`
   - **Example**: `https://ai-interviewer.vercel.app`

3. **Your API endpoint will be**:
   ```
   https://your-project-name.vercel.app/api/vapi/generate
   ```

### Step 4: Update Vapi Workflow

1. Go to your Vapi dashboard
2. Open your workflow
3. Edit the `generate_interview` API Request node
4. **Update the URL** to:
   ```
   https://your-project-name.vercel.app/api/vapi/generate
   ```
5. **Save** the workflow

### Step 5: Test the API Endpoint

Test your API endpoint directly:

```bash
curl -X POST https://your-project-name.vercel.app/api/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Technical",
    "role": "Frontend Developer",
    "level": "Mid",
    "techstack": "React,TypeScript",
    "amount": "5",
    "userid": "test-user-123"
  }'
```

You should get a response like:
```json
{
  "success": true,
  "interviewId": "some-id"
}
```

---

## Option 2: Deploy to Netlify

### Step 1: Prepare Your Project

1. Create a `netlify.toml` file in your project root:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. Commit and push your code

### Step 2: Deploy to Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Sign up/Login
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. **Add environment variables** (same as Vercel)
7. Click "Deploy site"

### Step 3: Get Your URL

Your site will be available at:
```
https://your-site-name.netlify.app
```

API endpoint:
```
https://your-site-name.netlify.app/api/vapi/generate
```

---

## Option 3: Deploy to Railway

### Step 1: Deploy to Railway

1. Go to [https://railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Next.js

### Step 2: Configure

1. Add environment variables in Railway dashboard
2. Railway will provide a URL automatically
3. Your API endpoint will be:
   ```
   https://your-project.up.railway.app/api/vapi/generate
   ```

---

## Option 4: Deploy to Your Own Server

### Requirements

- Server with Node.js 18+ installed
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt is free)

### Step 1: Build Your Application

```bash
npm run build
```

### Step 2: Deploy Files

Upload your entire project to your server (excluding `node_modules`)

### Step 3: Set Environment Variables

Create a `.env.production` file on your server with all variables

### Step 4: Install Dependencies and Start

```bash
npm install --production
npm start
```

### Step 5: Use Your Domain

If you have a domain:
```
https://yourdomain.com/api/vapi/generate
```

If using IP:
```
http://your-server-ip:3000/api/vapi/generate
```

**Note**: For production, always use HTTPS. Set up SSL with Let's Encrypt.

---

## Option 5: Local Testing with Ngrok (Before Production)

For testing before deploying, use ngrok:

### Step 1: Install Ngrok

Download from [https://ngrok.com](https://ngrok.com) or use npm:
```bash
npm install -g ngrok
```

### Step 2: Start Your Local Server

```bash
npm run dev
```

Your app runs on `http://localhost:3000`

### Step 3: Expose with Ngrok

```bash
ngrok http 3000
```

### Step 4: Get Your Ngrok URL

Ngrok will show you a URL like:
```
https://abc123.ngrok.io
```

### Step 5: Use in Vapi Workflow

Update your API Request node URL to:
```
https://abc123.ngrok.io/api/vapi/generate
```

**Note**: 
- Free ngrok URLs change every time you restart
- Use ngrok for testing only
- For production, deploy to Vercel/Netlify

---

## Updating Environment Variables in Production

### Vercel

1. Go to your project dashboard
2. Settings → Environment Variables
3. Add/Update variables
4. Redeploy (automatic or manual)

### Netlify

1. Site settings → Environment variables
2. Add/Update variables
3. Trigger new deploy

---

## Important Security Considerations

### 1. CORS Configuration (if needed)

If Vapi requests are blocked by CORS, add to your API route:

```typescript
// app/api/vapi/generate/route.ts
export async function POST(request: Request) {
  // Handle CORS
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://dashboard.vapi.ai',
    'https://api.vapi.ai',
    // Add your Vapi domains
  ];

  // Your existing code...
  
  return Response.json({ success: true, interviewId: docRef.id }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? origin || '*' : '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
```

### 2. API Authentication (Recommended)

Add authentication to your API endpoint:

```typescript
// app/api/vapi/generate/route.ts
export async function POST(request: Request) {
  // Verify request comes from Vapi
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.VAPI_API_SECRET;
  
  if (authHeader !== `Bearer ${expectedToken}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Your existing code...
}
```

Then in Vapi workflow, add Authorization header:
```
Authorization: Bearer your-secret-token
```

### 3. Rate Limiting

Consider adding rate limiting to prevent abuse:

```typescript
// Simple rate limiting example
const rateLimit = new Map();

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10;

  if (rateLimit.has(ip)) {
    const userLimit = rateLimit.get(ip);
    if (now - userLimit.firstRequest < windowMs) {
      if (userLimit.count >= maxRequests) {
        return Response.json({ error: 'Too many requests' }, { status: 429 });
      }
      userLimit.count++;
    } else {
      rateLimit.set(ip, { firstRequest: now, count: 1 });
    }
  } else {
    rateLimit.set(ip, { firstRequest: now, count: 1 });
  }

  // Your existing code...
}
```

---

## Testing Your Production API

### Test 1: Direct API Call

```bash
curl -X POST https://your-production-url.com/api/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Technical",
    "role": "Frontend Developer",
    "level": "Mid",
    "techstack": "React,TypeScript",
    "amount": "5",
    "userid": "test-user"
  }'
```

### Test 2: From Vapi Workflow

1. Go to Vapi dashboard
2. Test your workflow
3. Check if API call succeeds
4. Verify interview is created in Firestore

### Test 3: Check Logs

- **Vercel**: Go to your project → Deployments → Click on deployment → View Function Logs
- **Netlify**: Site → Functions → View logs
- Check for any errors

---

## Common Issues and Solutions

### Issue: API returns 404

**Solution**:
- Verify the URL is correct: `https://your-domain.com/api/vapi/generate`
- Check that the route file exists: `app/api/vapi/generate/route.ts`
- Ensure the deployment includes the API route

### Issue: CORS Error

**Solution**:
- Add CORS headers (see Security section above)
- Verify Vapi's origin is allowed

### Issue: Environment Variables Not Working

**Solution**:
- Check variables are set in hosting platform
- Ensure `NEXT_PUBLIC_*` variables are set correctly
- Redeploy after adding variables

### Issue: API Returns 500 Error

**Solution**:
- Check server logs for error details
- Verify all environment variables are set
- Check Firebase Admin SDK credentials
- Verify Google AI API key is valid

---

## Quick Checklist

Before going live:

- [ ] Deployed to production (Vercel/Netlify/etc.)
- [ ] All environment variables are set
- [ ] API endpoint is accessible: `https://your-domain.com/api/vapi/generate`
- [ ] Tested API endpoint with curl/Postman
- [ ] Updated Vapi workflow with production URL
- [ ] Tested workflow in Vapi dashboard
- [ ] Verified interviews are created in Firestore
- [ ] CORS is configured (if needed)
- [ ] API authentication is set up (recommended)
- [ ] Monitoring/logging is configured

---

## Recommended Production Setup

1. **Vercel** for hosting (easiest, free tier available)
2. **Custom domain** (optional but professional)
3. **API authentication** (security)
4. **Error monitoring** (Sentry, LogRocket, etc.)
5. **Analytics** (Vercel Analytics, Google Analytics)

---

## Next Steps

1. Deploy your app to Vercel
2. Get your production URL
3. Update Vapi workflow with the production API URL
4. Test the complete flow
5. Monitor for any issues

**Your production API URL format**:
```
https://your-project-name.vercel.app/api/vapi/generate
```

Replace `your-project-name.vercel.app` with your actual Vercel URL.

---

**Need help?** Check hosting platform documentation or ask for assistance!

