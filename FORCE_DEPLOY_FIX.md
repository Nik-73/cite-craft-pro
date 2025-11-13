# 🔧 Fix: Legal Research Tab Not Showing

Your code is correct and merged to main. Follow these steps to force a fresh deployment:

## For Vercel:

### Option 1: Redeploy from Dashboard
1. Go to https://vercel.com
2. Click on your **cite-craft-pro** project
3. Click **"Deployments"** tab at the top
4. Find the most recent deployment
5. Click the **three dots (•••)** on the right side
6. Click **"Redeploy"**
7. Make sure it says **"Use existing Build Cache: No"**
8. Click **"Redeploy"** button
9. Wait 2-3 minutes
10. **Clear your browser cache** (Ctrl+Shift+Delete or Cmd+Shift+Delete)
11. Visit your site URL again

### Option 2: Force Deploy from GitHub
1. Go to your repository settings on GitHub
2. Find the Vercel integration
3. Trigger a new deployment

## For Netlify:

### Redeploy from Dashboard
1. Go to https://app.netlify.com
2. Click on your **cite-craft-pro** site
3. Click **"Deploys"** tab
4. Click **"Trigger deploy"** dropdown button
5. Select **"Clear cache and deploy site"**
6. Wait 2-3 minutes
7. **Clear your browser cache** (Ctrl+Shift+Delete)
8. Visit your site URL again

## Important: Clear Browser Cache

After redeploying, you MUST clear your browser cache:

### Chrome:
- Press **Ctrl+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)
- Select "Cached images and files"
- Click "Clear data"
- Or just do a **Hard Refresh**: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

### Firefox:
- Press **Ctrl+Shift+Delete**
- Select "Cache"
- Click "Clear Now"

### Safari:
- Go to Safari menu → Clear History
- Select "all history"
- Click "Clear History"

## What You Should See:

After clearing cache and reloading, you should see:

```
┌─────────────────────────────────────┐
│  CiteCraft Pro                       │
├─────────────────┬───────────────────┤
│ ┌─────────────┐ │                   │
│ │Upload & Edit│ │   Preview         │
│ │Legal Research│ │                   │
│ └─────────────┘ │                   │
│                 │                   │
└─────────────────┴───────────────────┘
```

The **"Legal Research"** tab should be visible in the left panel, right below "Upload & Edit".

## Still Not Working?

### Check Build Logs:

**Vercel:**
1. Go to Deployments tab
2. Click on the latest deployment
3. Check if it says "Ready" or has errors
4. Click "View Build Logs"
5. Look for any red error messages

**Netlify:**
1. Go to Deploys tab
2. Click on the latest deploy
3. Check if status is "Published" or "Failed"
4. Scroll down to see build logs
5. Look for error messages

### Common Issues:

1. **Build failed** - Check logs for errors
2. **Old cache** - Use "Clear cache and deploy"
3. **Wrong branch** - Verify it's deploying from `main`
4. **Browser cache** - Do a hard refresh (Ctrl+Shift+R)

## Quick Test:

To confirm the code is deployed, check if these URLs work (replace with your actual domain):

- Your main URL: `https://your-site.vercel.app`
- Check this file exists: `https://your-site.vercel.app/assets/index-[hash].js`

If you see a 404 or blank page, the deployment didn't complete.

## Need More Help?

Send me:
1. Your deployment URL
2. Screenshot of what you see
3. Any error messages from browser console (F12 → Console tab)
