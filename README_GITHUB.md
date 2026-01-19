# 🚀 Virality Analyzer

> AI-powered content virality analysis tool with real-time predictions, machine learning backend, and premium dark UI.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-purple?logo=prisma)](https://www.prisma.io/)

## ✨ Features

- 🤖 **Real ML Predictions** - Trained model with scikit-learn for accurate virality scoring
- 🎨 **Premium Dark UI** - Apple-inspired design with glassmorphism and smooth animations
- 🔐 **Google OAuth** - Secure authentication with NextAuth.js and Prisma adapter
- 💾 **Full Database** - SQLite for development, easily upgradeable to PostgreSQL
- 📊 **Analysis History** - Search, filter, and track all previous analyses
- ⚡ **Real-time Analysis** - Instant feedback with detailed metrics and insights
- 🎯 **6 Core Metrics** - Overall score, emotional impact, shareability, timing, uniqueness, engagement
- 🌓 **Dark/Light Mode** - Seamless theme switching with next-themes
- 📱 **Fully Responsive** - Works beautifully on desktop, tablet, and mobile

## 🎯 Tech Stack

### Frontend
- **Next.js 15.1.4** - App Router, Server Components, API Routes
- **TypeScript 5+** - Type-safe development
- **Tailwind CSS 3.4** - Utility-first styling with custom dark theme
- **Framer Motion 11** - Smooth animations and transitions
- **shadcn/ui** - Customized accessible components
- **Lucide React** - Beautiful icon library

### Backend
- **FastAPI 0.104** - High-performance Python API
- **scikit-learn 1.8** - Machine learning models
- **joblib** - Model serialization
- **Uvicorn** - ASGI server

### Database & Auth
- **Prisma 5.22** - Type-safe ORM
- **SQLite** - Development database (production-ready for PostgreSQL)
- **NextAuth.js 4.24** - Authentication with Google OAuth

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Python 3.12+** and pip
- **Git** (for cloning)
- **Google OAuth credentials** ([Get them here](https://console.cloud.google.com/))

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/virality-analyzer.git
cd virality-analyzer
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd ml-backend
pip install -r requirements.txt
cd ..
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32

GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
```

### 4. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) View database
npx prisma studio
```

### 5. Start Development Servers

**Terminal 1** - Next.js frontend:
```bash
npm run dev
```

**Terminal 2** - ML backend:
```bash
cd ml-backend
python main.py
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
virality-analyzer/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages (login, register)
│   │   ├── api/               # API routes (analyze, history, auth)
│   │   ├── dashboard/         # Main analyzer interface
│   │   ├── history/           # Analysis history page
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui base components
│   │   └── theme-toggle.tsx  # Dark mode toggle
│   ├── lib/                   # Utilities
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── prisma.ts         # Prisma client
│   │   └── utils.ts          # Helper functions
│   └── types/                 # TypeScript definitions
├── ml-backend/
│   ├── main.py               # FastAPI application
│   ├── tfidf_vectorizer.pkl  # TF-IDF vectorizer (5000 features)
│   ├── virality_model.pkl    # Trained LogisticRegression model
│   └── requirements.txt      # Python dependencies
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Create **OAuth 2.0 Client ID**
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### Database Configuration

**Development** (SQLite):
```env
DATABASE_URL="file:./prisma/dev.db"
```

**Production** (PostgreSQL):
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

After changing database, run:
```bash
npx prisma migrate deploy
npx prisma generate
```

### ML Backend Configuration

The FastAPI server uses pre-trained models:
- **tfidf_vectorizer.pkl** - Text feature extraction (5000 features)
- **virality_model.pkl** - Virality prediction (LogisticRegression)

Models were trained with scikit-learn 1.6.1 and work with scikit-learn 1.8+.

## 📊 API Endpoints

### Next.js API Routes

- `POST /api/analyze` - Analyze content and get virality score
- `GET /api/history` - Get user's analysis history (paginated)
- `/api/auth/*` - NextAuth authentication endpoints

### ML Backend (FastAPI)

- `POST /analyze` - ML prediction endpoint
  ```json
  {
    "text": "Your content here",
    "num_comments": 0
  }
  ```
  Response:
  ```json
  {
    "virality_probability": 0.856,
    "verdict": "High"
  }
  ```

- `GET /health` - Health check endpoint

## 🎨 UI Components

### Dashboard Features
- **Bento Layout** - Modern 3-column grid with glassmorphism
- **Gradient Mesh Background** - Animated radial gradients
- **Circular Progress Gauge** - Visual score representation
- **Metric Cards** - 4 key metrics with smooth animations
- **Recent Analyses** - Sidebar with last 5 analyses
- **AI Insights** - Contextual recommendations

### History Page
- **Search & Filters** - Find analyses by content or score range
- **Statistics Cards** - Total analyses, average score, best score
- **Pagination** - Efficient loading of large datasets
- **Responsive Grid** - Adapts to screen size

## 🧪 Testing

```bash
# Build for production (tests compilation)
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Check Prisma schema
npx prisma validate

# Test ML backend
cd ml-backend
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"Amazing content!","num_comments":0}'
```

## 🚢 Deployment

### Vercel (Recommended for Next.js)

1. Push to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy 🚀

### ML Backend Deployment

Options:
- **Railway** - Easy Python deployment
- **Render** - Free tier available
- **AWS Lambda** - Serverless option
- **DigitalOcean** - VPS with Python

Don't forget to update `ML_BACKEND_URL` in your Next.js environment variables!

### Database (Production)

Upgrade to PostgreSQL for production:

1. **Railway**: Instant PostgreSQL provisioning
2. **Supabase**: Free PostgreSQL with great UI
3. **PlanetScale**: Serverless MySQL alternative
4. **Neon**: Serverless PostgreSQL

Update `DATABASE_URL` and run migrations:
```bash
npx prisma migrate deploy
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | ✅ Yes |
| `NEXTAUTH_URL` | Your app URL | ✅ Yes |
| `NEXTAUTH_SECRET` | Secret for JWT signing | ✅ Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | ✅ Yes |
| `ML_BACKEND_URL` | FastAPI backend URL | ⚠️ Default: localhost:8000 |

## 📖 Documentation

- [Quick Start Guide](QUICKSTART.md) - Get running in 5 minutes
- [Database Documentation](DATABASE.md) - Schema and operations
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [GitHub Setup](GITHUB_SETUP.md) - Repository management
- [Build Summary](BUILD_SUMMARY.md) - Complete build details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Hosting and deployment
- **Prisma** - Excellent ORM
- **FastAPI** - High-performance Python framework
- **shadcn** - Beautiful UI components
- **Tailwind Labs** - Utility-first CSS

## 🐛 Known Issues

- None currently! Report issues on GitHub.

## 🔮 Roadmap

- [ ] Add more content types (video, images)
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Export reports (PDF, CSV)
- [ ] API rate limiting
- [ ] Webhook integrations
- [ ] Multi-language support
- [ ] Real-time collaboration

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/virality-analyzer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/virality-analyzer/discussions)

---

**Built with ❤️ using Next.js, FastAPI, and Machine Learning**

⭐ Star this repo if you find it useful!
