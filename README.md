# CiteCraft Pro

**AI-Powered Legal Citation & Research Management Tool**

CiteCraft Pro is a comprehensive legal research and writing platform that combines citation management, legal case scraping, and advanced AI-powered analysis to streamline legal research workflows.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-18.3-blue)

## 🚀 Features

### 📚 Citation Management
- **6 Citation Styles**: APA, MLA, Chicago, Harvard, Bluebook, ALWD
- **Manual Entry**: Add citations with complete metadata
- **Auto-Import**: Extract citations from documents
- **Live Preview**: Real-time formatted document preview
- **Drag & Drop Reordering**: Organize citations easily

### 🔍 Legal Research Scraper
- **Multi-Source Search**: CourtListener, Google Scholar, Justia
- **Advanced Filters**: Jurisdiction, court, date range
- **Rate Limiting**: Respectful scraping with configurable delays
- **Rich Metadata**: Case numbers, judges, parties, citations
- **One-Click Import**: Add cases directly to citation library

### 🤖 AI-Powered Analysis ⭐ NEW
- **Comprehensive Case Analysis**
  - Automatic summarization (brief & detailed)
  - Legal holdings extraction
  - Precedent analysis
  - Key facts identification

- **Legal Writing Analysis**
  - Overall assessment and feedback
  - Citation quality scoring (0-100)
  - Legal reasoning evaluation (0-100)
  - Specific improvement suggestions

- **Smart Citation Recommendations**
  - AI-suggested cases to strengthen arguments
  - Relevance scoring (0-100)
  - Placement guidance
  - Missing topic identification

- **Batch Processing**
  - Analyze multiple cases simultaneously
  - Progress tracking and cost estimation
  - Export results as JSON

- **Cost Tracking**
  - Real-time cost monitoring
  - Detailed analysis history
  - Per-operation breakdown
  - Export capability

### ✍️ Writing Tools
- **Document Upload**: Single or split-mode (paper + bibliography)
- **Auto-Detection**: Recognize bibliography sections
- **Citation Validation**: Detect orphaned and missing citations
- **Pattern Recognition**: Support for [1], [2] and (Author, Year) formats
- **Real-time Grading**: Live feedback on citation quality

## 🛠️ Technologies

- **Frontend**: React 18.3 + TypeScript 5.8
- **Build Tool**: Vite 5.4
- **UI Framework**: shadcn-ui + Radix UI
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios 1.13
- **Scraping**: Cheerio 1.1
- **AI**: Anthropic Claude (Sonnet 4.5)
- **CLI**: Commander.js 14.0

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Anthropic API key (for AI features)

### Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd cite-craft-pro

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your Anthropic API key

# Start development server
npm run dev

# Open http://localhost:8081
```

## 🔑 API Key Setup

### For AI Features

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Create a new API key
4. Add to `.env`:
   ```
   VITE_ANTHROPIC_API_KEY="sk-ant-your-key-here"
   ```

See [AI_QUICK_START.md](./AI_QUICK_START.md) for detailed setup instructions.

## 📖 Documentation

- **[AI Analysis Guide](./AI_ANALYSIS_GUIDE.md)** - Comprehensive guide to AI features
- **[Quick Start Guide](./AI_QUICK_START.md)** - Get started in 5 minutes
- **[API Examples](./examples/ai-analysis-example.ts)** - Programmatic usage examples

## 🎯 Usage

### Basic Workflow

1. **Upload Your Paper**
   - Go to "Upload & Edit" tab
   - Upload your document or paste text
   - Citations are automatically extracted

2. **Research Cases**
   - Go to "Legal Research" tab
   - Search for relevant cases
   - Add cases to your citation library

3. **AI Analysis** ⭐
   - Go to "AI Analysis" tab
   - Analyze cases for comprehensive insights
   - Get writing feedback and citation suggestions

4. **Preview & Export**
   - Go to "Preview" tab
   - Select citation style
   - Export formatted document

### AI Analysis Workflow

```bash
# Research Phase
1. Search and import 10 cases → Legal Research tab
2. Batch analyze all cases → AI Analysis tab ($1.50-2.50)
3. Review case summaries, holdings, precedents

# Writing Phase
4. Upload your draft paper → Upload & Edit tab
5. Get AI writing feedback → AI Analysis tab ($0.30-0.50)
6. Review citation recommendations
7. Identify missing topics

# Revision Phase
8. Update paper based on AI suggestions
9. Add recommended citations
10. Re-analyze for verification ($0.30)
```

**Total estimated cost for complete research session**: $2-4

## 💰 AI Pricing

The AI features use Anthropic's Claude API with transparent, token-based pricing:

- **Input tokens**: $3.00 per million tokens
- **Output tokens**: $15.00 per million tokens

**Typical Costs**:
- Single case analysis: $0.15-0.25
- Batch (10 cases): $1.50-2.50
- Writing analysis: $0.10-0.20
- Citation recommendations: $0.08-0.15
- Complete paper analysis: $0.30-0.50

All costs are tracked in real-time and displayed in the application.

## 🧪 Development

### Available Scripts

```bash
npm run dev              # Start dev server (port 8081)
npm run build            # Production build
npm run lint             # Run ESLint
npm run preview          # Preview production build

# Legal Research CLI
npm run scraper          # Run scraper CLI
npm run scraper:search   # Quick search
npm run scraper:sources  # List sources
npm run scraper:examples # Show examples
```

### Project Structure

```
cite-craft-pro/
├── src/
│   ├── components/          # React components
│   │   ├── AIAnalysisPanel.tsx
│   │   ├── CaseAnalysisView.tsx
│   │   ├── WritingAnalysisView.tsx
│   │   └── ...
│   ├── services/
│   │   ├── ai/              # AI analysis services
│   │   │   ├── AIService.ts
│   │   │   ├── AnalysisManager.ts
│   │   │   └── types.ts
│   │   └── documentProcessor.ts
│   ├── scraper/
│   │   ├── sources/         # Legal data sources
│   │   ├── ScraperManager.ts
│   │   └── cli/
│   └── pages/
│       └── Index.tsx        # Main application
├── examples/
│   └── ai-analysis-example.ts
├── AI_ANALYSIS_GUIDE.md     # Comprehensive AI guide
├── AI_QUICK_START.md        # Quick start guide
└── README.md                # This file
```

## 🚀 Deployment

### One-Click Deployment

CiteCraft Pro is pre-configured for:

- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**

Simply push to the main branch, and GitHub Actions will automatically deploy.

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Anthropic** - Claude AI API
- **CourtListener** - Free legal opinions database
- **Google Scholar** - Comprehensive case law coverage
- **Justia** - Free legal information
- **shadcn-ui** - Beautiful UI components
- **Lovable** - Development platform

## 📞 Support

- **Documentation**: See guides in `/docs` folder
- **Issues**: Submit via GitHub Issues
- **API Support**: [console.anthropic.com](https://console.anthropic.com)

## 🔐 Security

- Never commit API keys to version control
- Use environment variables for sensitive data
- Rotate API keys regularly
- Review the [Security Guide](./SECURITY.md) for best practices

## 🎓 Use Cases

CiteCraft Pro is ideal for:

- **Law Students**: Writing legal briefs and research papers
- **Legal Researchers**: Analyzing case law and precedents
- **Academics**: Publishing legal scholarship
- **Paralegals**: Citation management and case research
- **Legal Writers**: Professional legal writing with AI assistance

---

**Built with ❤️ using React, TypeScript, and Claude AI**

**Version**: 1.0.0
**Last Updated**: 2025-11-16
**AI Model**: Claude Sonnet 4.5

For detailed AI analysis documentation, see [AI_ANALYSIS_GUIDE.md](./AI_ANALYSIS_GUIDE.md)

For a quick start with AI features, see [AI_QUICK_START.md](./AI_QUICK_START.md)
