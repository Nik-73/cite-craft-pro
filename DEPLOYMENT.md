# 🚀 Deploy Your Legal Research Scraper Tool

This guide shows you how to deploy CiteCraft Pro with the Legal Research Scraper online so you can use it through a web browser without any terminal or CLI commands.

## 🌟 Recommended: One-Click Deployment

### Option 1: Deploy to Vercel (Easiest & Fastest)

**Step 1:** Go to [Vercel](https://vercel.com)

**Step 2:** Sign up or log in with your GitHub account

**Step 3:** Click **"Add New..."** → **"Project"**

**Step 4:** Import your repository:
- Find `cite-craft-pro` in the list
- Click **"Import"**

**Step 5:** Configure the project:
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Step 6:** Click **"Deploy"**

**Step 7:** Wait 2-3 minutes for deployment

**Step 8:** Get your URL (e.g., `https://cite-craft-pro.vercel.app`)

**✅ Done!** Your tool is now live and accessible to anyone with the URL.

---

### Option 2: Deploy to Netlify

**Step 1:** Go to [Netlify](https://netlify.com)

**Step 2:** Sign up or log in with your GitHub account

**Step 3:** Click **"Add new site"** → **"Import an existing project"**

**Step 4:** Choose GitHub and authorize

**Step 5:** Select your `cite-craft-pro` repository

**Step 6:** Configure build settings:
- Build command: `npm run build`
- Publish directory: `dist`

**Step 7:** Click **"Deploy site"**

**Step 8:** Wait for deployment to complete

**Step 9:** Get your URL (e.g., `https://cite-craft-pro.netlify.app`)

**✅ Done!** Your scraper is now online.

---

### Option 3: GitHub Pages (Free but Manual Setup)

**Step 1:** Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Source: **GitHub Actions**

**Step 2:** The deployment workflow is already set up

The file `.github/workflows/deploy.yml` is already in your repository and will automatically deploy when you push to the main branch.

**Step 3:** Merge your branch to main

After merging your scraper feature branch to main, GitHub Actions will automatically:
- Build your application
- Deploy to GitHub Pages

**Step 4:** Access your site

Your site will be available at:
```
https://[your-username].github.io/cite-craft-pro/
```

For example:
```
https://Nik-73.github.io/cite-craft-pro/
```

**Note:** This URL might need to be updated in the repository settings under Pages.

---

## 📱 Using Your Deployed Tool

Once deployed, anyone can access your Legal Research Scraper by:

### Web Interface Usage:

1. **Open the URL** in any browser
   - Chrome, Firefox, Safari, Edge all work

2. **Navigate to Legal Research**
   - Look for the "Legal Research" tab on the left side
   - Click it to open the scraper interface

3. **Search for Legal Cases**
   - Enter case name or legal topic
   - Select source (All Sources, CourtListener, Google Scholar, or Justia)
   - Add filters (jurisdiction, dates)
   - Click "Search"

4. **Use the Results**
   - View case details
   - Click "View Source" to see full case
   - Click "Add to Citations" to import into your paper
   - Click "Export Results" to download as JSON

### Share the Tool:

Simply share your deployment URL with:
- Classmates
- Research partners
- Legal professionals
- Anyone who needs legal research tools

**Example URLs:**
```
Vercel: https://cite-craft-pro-nik73.vercel.app
Netlify: https://cite-craft-pro-nik73.netlify.app
GitHub Pages: https://Nik-73.github.io/cite-craft-pro/
```

---

## 🔄 Automatic Updates

### Vercel & Netlify:
- Automatically redeploy on every push to main branch
- No manual intervention needed
- See deployment status in their dashboards

### GitHub Pages:
- Automatically deploys when you push to main
- Check deployment status in the "Actions" tab
- Usually takes 2-3 minutes

---

## ⚙️ Configuration Files Included

Your repository now includes:

1. **`vercel.json`** - Vercel deployment config
2. **`netlify.toml`** - Netlify deployment config
3. **`.github/workflows/deploy.yml`** - GitHub Pages workflow

These files are already configured and ready to use. No modifications needed!

---

## 🌐 Custom Domain (Optional)

### For Vercel:
1. Go to your project dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

### For Netlify:
1. Go to site settings
2. Click **Domain Management**
3. Add custom domain
4. Update DNS records as instructed

### For GitHub Pages:
1. Go to repository **Settings** → **Pages**
2. Add custom domain in the **Custom domain** field
3. Configure DNS with your domain provider

---

## 🔍 What Gets Deployed

When you deploy, the following features are available online:

✅ **Full Web Interface**
- Legal Research tab with scraper
- Upload & Edit tab for citations
- Preview tab for formatted documents
- Grading tab for citation analysis

✅ **Legal Research Scraper**
- Search CourtListener, Google Scholar, Justia
- Filter by jurisdiction, date, court
- Export results to JSON
- Add cases directly to citations

✅ **Citation Management**
- Add, edit, delete citations
- Support for 6 citation styles (APA, MLA, Chicago, Harvard, Bluebook, ALWD)
- Real-time document preview
- Citation quality analysis

---

## 🚨 Troubleshooting

### Build Fails:
- Check the build logs in Vercel/Netlify/GitHub Actions
- Ensure all dependencies are in `package.json`
- Make sure Node version is 18 or higher

### Page Shows 404:
- For Vercel/Netlify: Check base URL configuration
- For GitHub Pages: Ensure Pages is enabled in settings
- Wait a few minutes after deployment

### Scraper Not Working:
- Open browser console (F12) to check for errors
- Ensure internet connection is working
- Try a different legal source

### Styles Look Broken:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check if assets are loading in Network tab

---

## 💡 Pro Tips

1. **Use Vercel for best experience**
   - Fastest deployment
   - Best developer experience
   - Automatic HTTPS
   - Great performance

2. **Keep dependencies updated**
   - Regularly update npm packages
   - Monitor security vulnerabilities
   - Test after updates

3. **Monitor usage**
   - Check deployment analytics
   - Track search patterns
   - Monitor for errors

4. **Share responsibly**
   - Don't overload legal databases
   - Respect rate limits
   - Use for educational/research purposes

---

## 📊 Deployment Status

Check deployment status:

- **Vercel**: Dashboard → Your Project → Deployments
- **Netlify**: Site Dashboard → Deploys
- **GitHub Pages**: Repository → Actions tab

---

## 🎉 Success!

Once deployed, you can:
- Access from any device with internet
- Share with anyone via URL
- No installation required for users
- Works on mobile, tablet, desktop
- Always up-to-date with latest changes

**Your legal research tool is now accessible through GitHub without any terminal usage!** 🚀

---

## Need Help?

If you encounter issues:
1. Check the platform's documentation (Vercel/Netlify/GitHub)
2. Look at build logs for error messages
3. Ensure all configuration files are committed
4. Try redeploying

**Recommended Platform:** Vercel (easiest setup, best performance)
