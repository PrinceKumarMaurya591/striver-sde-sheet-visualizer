# Striver SDE Sheet Visualizer

An interactive visualizer for the **Striver SDE Sheet** (191 DSA problems) + **System Design** (20 Design Patterns + 5 HLD Architectures). Features step-by-step algorithm tracing, array/matrix/graph/linked-list animation, and AI-powered code analysis.

---

## 🚀 Deploy to Render (Free)

### Prerequisites
- A [Render](https://render.com) account (GitHub login)
- Your code pushed to a **GitHub repository**

### Method 1: One-click Deploy (render.yaml)

This repo includes a [`render.yaml`](render.yaml) for automatic deployment.

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/striver-sde-visualizer.git
   git push -u origin main
   ```

2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**

3. Connect your GitHub repo → Render auto-detects [`render.yaml`](render.yaml) → Click **Apply**

4. Done! Your app will be live at `https://striver-sde-visualizer.onrender.com`

### Method 2: Manual Setup

1. Push code to GitHub (same as step 1 above)

2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**

3. Connect your GitHub repository

4. Configure:
   | Setting | Value |
   |---------|-------|
   | **Name** | `striver-sde-visualizer` |
   | **Runtime** | `Node` |
   | **Region** | `Singapore` (closest to India) |
   | **Branch** | `main` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |
   | **Plan** | `Free` |

5. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `USE_LOCAL_TRACER` | `true` |
   | `GEMINI_API_KEY` | *(optional — only if you want AI features)* |

6. Click **Create Web Service** → Wait 2-3 minutes for build + deploy

7. 🎉 Your app is live! Render gives you a URL like: `https://striver-sde-visualizer.onrender.com`

---

## 🧪 Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server (no API key needed)
USE_LOCAL_TRACER=true npm run dev

# 3. Open http://localhost:3000
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `USE_LOCAL_TRACER` | No | Set to `true` to use local trace engine (no API key) |
| `GEMINI_API_KEY` | No | Only needed for AI-generated traces |
| `PORT` | No | Server port (default: 3000) |

---

## ✨ Features

### DSA Visualizer
- **191 Striver SDE Sheet problems** across 13 categories
- **Step-by-step tracing** with animated array/matrix/graph/linked-list rendering
- **Pre-built traces** for 7 algorithms (Sort Colors, Kadane's, Binary Search, etc.)
- **Local trace engine** — works 100% offline, no API key needed

### AI Co-Pilot
- **Custom code sandbox** — paste any algorithm and visualize it
- **Fallback architecture** — tries Gemini API first, falls back to local tracer on failure
- Works fully with `USE_LOCAL_TRACER=true` (recommended for deployment)

### System Design 🆕
- **LLD — 20 Design Patterns** with interactive SVG class diagrams
  - Creational (5): Singleton, Factory, Builder, Abstract Factory, Prototype
  - Structural (7): Adapter, Decorator, Proxy, Facade, Composite, Bridge, Flyweight
  - Behavioral (8): Observer, Strategy, Command, State, Template Method, Iterator, Mediator, Chain of Responsibility
- **HLD — 5 System Architectures** with color-coded component diagrams
  - URL Shortener, Chat System (WhatsApp), Video Streaming (Netflix), Ride Hailing (Uber), Social Feed (Twitter)

---

## 🏗️ Project Structure

```
├── server.ts                  # Express server + API routes
├── vite.config.ts             # Vite build config
├── render.yaml                # Render deployment config
├── src/
│   ├── App.tsx                # Main app with routing
│   ├── types.ts               # TypeScript types
│   ├── utils/
│   │   └── localTraceEngine.ts  # Local trace generator (no API key)
│   ├── data/
│   │   ├── striverData.ts     # 191 DSA problems + trace generators
│   │   ├── systemDesignData.ts # 20 patterns + 5 HLD problems
│   │   └── systemDesignColors.ts
│   └── components/
│       ├── Sidebar.tsx        # Navigation sidebar
│       ├── VisualizerWorkspace.tsx  # DSA visualizer
│       ├── AiCoPilot.tsx      # AI code sandbox
│       ├── SystemDesignWorkspace.tsx # System design viewer
│       ├── DesignPatternVisualizer.tsx # SVG class diagrams
│       ├── SystemArchitectureVisualizer.tsx # SVG architecture diagrams
│       ├── ArrayVisualizer.tsx
│       ├── MatrixVisualizer.tsx
│       ├── LinkedListVisualizer.tsx
│       └── GraphVisualizer.tsx
```

---

## 🔧 Production Build

```bash
# Build for production
npm run build

# Output:
# - dist/assets/        (React frontend)
# - dist/server.cjs     (Express server)

# Run production server
NODE_ENV=production USE_LOCAL_TRACER=true npm start
```

The server serves the built frontend from `dist/` and handles API routes.

---

## 📝 Notes

- **Free Render tier**: The app goes to sleep after 15 min of inactivity. First request after idle takes ~30s to wake up.
- **Local tracer**: Set `USE_LOCAL_TRACER=true` to skip Gemini API entirely — the app works 100% offline.
- **Gemini API**: If you want AI-powered traces, get a free API key from [Google AI Studio](https://aistudio.google.com/apikey) and set `GEMINI_API_KEY`.
