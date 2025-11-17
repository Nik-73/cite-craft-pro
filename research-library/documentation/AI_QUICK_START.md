# AI Analysis - Quick Start Guide

Get started with AI-powered legal analysis in 5 minutes!

## Step 1: Get Your API Key (2 minutes)

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create Key"
5. Copy your key (starts with `sk-ant-...`)

## Step 2: Configure CiteCraft Pro (1 minute)

### Method A: Environment Variable (Recommended)

Open `.env` and add:
```
VITE_ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

### Method B: In-App Configuration

1. Start the application: `npm run dev`
2. Navigate to "AI Analysis" tab
3. Paste your API key
4. Click "Configure AI Service"

## Step 3: Your First Analysis (2 minutes)

### Option 1: Analyze a Legal Case

```bash
# Search for a case
1. Go to "Legal Research" tab
2. Search: "Brown v. Board of Education"
3. Click search and select a result
4. Click "Add Citation"

# Analyze it
5. Go to "AI Analysis" tab
6. Click "Analyze All Cases"
7. Wait ~10 seconds
8. View comprehensive analysis!
```

**Cost**: ~$0.15-0.25 per case

### Option 2: Analyze Your Paper

```bash
# Upload your paper
1. Go to "Upload & Edit" tab
2. Click "Upload File" and select your paper
3. Or paste text directly

# Get AI feedback
4. Go to "AI Analysis" tab
5. Click "Analyze Paper"
6. Wait ~15 seconds
7. Review results in "Writing" and "Citations" tabs!
```

**Cost**: ~$0.30-0.50 for complete paper analysis

## Step 4: Explore Results

### Case Analysis Shows:
- ✅ Brief & detailed summaries
- ✅ Legal holdings and principles
- ✅ Cited cases and precedents
- ✅ Legal topics and jurisdiction info

### Writing Analysis Shows:
- ✅ Overall assessment (what's working)
- ✅ Citation quality score (0-100)
- ✅ Legal reasoning score (0-100)
- ✅ Specific suggestions for improvement
- ✅ Strengths and weaknesses

### Citation Recommendations Show:
- ✅ Suggested cases to cite
- ✅ Relevance scores (0-100)
- ✅ Where to cite each case
- ✅ Missing legal topics

## Cost Tracking

Monitor your spending:
1. Check the **cost badge** in the panel header (shows total)
2. Click **"History"** tab for detailed breakdown
3. Click **"Estimate Cost"** before batch operations
4. Export history anytime for record-keeping

## Tips for Getting Started

### 💡 Start Small
- Analyze 1-2 cases first to understand the output
- Check costs in History tab
- Then scale up to batch operations

### 💡 Iterative Improvement
- Analyze your paper
- Review AI suggestions
- Make edits
- Re-analyze to see improvement

### 💡 Use Estimates
- Always click "Estimate Cost" for batch operations
- Typical costs:
  - 1 case: $0.15-0.25
  - 10 cases: $1.50-2.50
  - Paper analysis: $0.30-0.50

### 💡 Export Everything
- Export analysis results (JSON format)
- Share with colleagues
- Keep records for billing

## Common First-Time Questions

**Q: How much will this cost me?**
A: Very little for testing! A single case analysis is ~$0.20. You can analyze 50+ cases for ~$10.

**Q: Is my data secure?**
A: Yes! Anthropic has strong privacy policies. Your data is processed securely and not used for training.

**Q: What if I make a mistake?**
A: No worries! You can clear history, and you only pay for completed analyses. Failed attempts don't cost anything.

**Q: Can I analyze cases in bulk?**
A: Yes! Use "Analyze All Cases" to process multiple cases. Cost estimate shown before you proceed.

**Q: How accurate is the AI?**
A: Claude Sonnet 4.5 is highly accurate for legal analysis. However, always verify critical information. The AI provides a confidence score with each analysis.

## Next Steps

Once you're comfortable:

1. **Read the full guide**: `AI_ANALYSIS_GUIDE.md`
2. **Explore all features**: Try writing analysis, citation recommendations
3. **Integrate into workflow**: Use regularly while researching and writing
4. **Monitor costs**: Check History tab weekly
5. **Export results**: Keep records of all analyses

## Example Workflow

Here's a complete research workflow:

```
Day 1: Research Phase
- Search 10 relevant cases (Legal Research tab)
- Batch analyze all cases (AI Analysis tab) - Cost: ~$2
- Review case summaries and holdings
- Export analysis results for reference

Day 2: Writing Phase
- Draft paper with case citations
- Upload draft (Upload & Edit tab)
- Get writing feedback (AI Analysis tab) - Cost: ~$0.30
- Review citation recommendations
- Identify missing topics

Day 3: Revision Phase
- Update paper based on AI feedback
- Add recommended citations
- Re-analyze for improvement verification - Cost: ~$0.30
- Final export of all analyses

Total Session Cost: ~$3
```

## Troubleshooting

**"API Key Required" Error**
→ Double-check your `.env` file or re-enter key in UI

**Analysis Takes Too Long**
→ Large cases (15,000+ words) take 20-30 seconds. This is normal.

**Unexpected High Costs**
→ Check History tab to see what ran. Each analysis is logged.

**Poor Quality Results**
→ Ensure you're providing complete case text, not just citations or abstracts.

## Support

Need help?
- Review the **full guide**: `AI_ANALYSIS_GUIDE.md`
- Check **browser console** for errors
- Verify **API key** at console.anthropic.com
- Submit **issues** via GitHub

---

**Ready to start?** Open the app and go to "AI Analysis" tab! 🚀

**Budget conscious?** Start with 1-2 case analyses (~$0.50 total) to verify everything works before scaling up.

**Questions?** Everything is documented in `AI_ANALYSIS_GUIDE.md`.
