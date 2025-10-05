# 🚀 GitHub Spark Template

**A powerful, modern web development environment for building beautiful, interactive applications with React, TypeScript, and AI integration.**

![GitHub Spark Template](https://img.shields.io/badge/Spark-Template-blue?style=for-the-badge&logo=github)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 📋 Table of Contents

1. [What is Spark Template?](#what-is-spark-template)
2. [How Spark Template Works](#how-spark-template-works)
3. [Building Your Own Project](#building-your-own-project)
4. [File & Folder Structure](#file--folder-structure)
5. [Adding Frontend Files](#adding-frontend-files)
6. [Export & Packaging](#export--packaging)
7. [Example Project Structure](#example-project-structure)
8. [Deployment Guide](#deployment-guide)
9. [Tech Stack](#tech-stack)
10. [Getting Started](#getting-started)
11. [AI Features](#ai-features)
12. [Best Practices](#best-practices)

---

## 🎯 What is Spark Template?

**GitHub Spark Template** is a comprehensive, production-ready development environment that combines the power of modern web technologies with AI-driven features. It's designed to help developers quickly build, prototype, and deploy sophisticated web applications without the complexity of setting up build tools and configurations.

### Key Features:
- 🤖 **AI Integration**: Built-in AI assistant with LLM capabilities
- 📱 **Mobile-First**: Responsive design with PWA support
- 🎨 **Modern UI**: Shadcn/ui components with Tailwind CSS
- 🔒 **Type Safety**: Full TypeScript support
- 🚀 **Fast Development**: Hot reload with Vite
- 📊 **Data Persistence**: Key-value storage system
- 🎭 **Animation**: Framer Motion integration
- 🔧 **Developer Tools**: ESLint, TypeScript checking

---

## ⚡ How Spark Template Works

Spark Template operates as a **micro-app environment** where you build complete applications within the `src` directory. The system provides:

### 🏗️ Core Architecture
```
┌─────────────────────────────────┐
│         GitHub Spark            │
├─────────────────────────────────┤
│    Your Application (src/)      │
│  ┌─────────────────────────────┐ │
│  │        App.tsx              │ │
│  │    (Your Main Component)    │ │
│  └─────────────────────────────┘ │
├─────────────────────────────────┤
│    Runtime Environment          │
│  • AI Services                  │
│  • Storage (useKV)              │
│  • User Management              │
│  • Build System (Vite)          │
└─────────────────────────────────┘
```

### 🔄 Development Flow
1. **Write Code**: Create components in `src/`
2. **Hot Reload**: Changes appear instantly
3. **AI Assistance**: Use built-in AI features
4. **Data Storage**: Persist data with `useKV`
5. **Build & Deploy**: Export as web app or mobile app

---

## 🛠️ Building Your Own Project

### Option 1: React/TypeScript Application (Recommended)
This is the current setup - perfect for modern web applications.

```typescript
// src/App.tsx - Your main component
import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useKV('counter', 0)
  
  return (
    <div className="p-4">
      <h1>My Spark App</h1>
      <Button onClick={() => setCount(count + 1)}>
        Count: {count}
      </Button>
    </div>
  )
}

export default App
```

### Option 2: Vanilla HTML/CSS/JS
For simpler projects, you can create a basic HTML structure:

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
    <link href="/src/styles/custom.css" rel="stylesheet">
</head>
<body>
    <div id="app">
        <h1>Hello World</h1>
    </div>
    <script src="/src/scripts/main.js"></script>
</body>
</html>
```

### Option 3: Hybrid Approach
Combine React components with traditional web technologies:

```typescript
// src/components/MyWidget.tsx
export function MyWidget() {
  return <div className="widget">Custom React Widget</div>
}

// Then use in HTML or other React components
```

> **Note**: Python-based projects are not directly supported in this environment. Spark Template is designed for frontend web applications using JavaScript/TypeScript.

---

## 📁 File & Folder Structure

### 🗂️ Current Project Structure
```
spark-template/
├── 📄 index.html              # Main HTML entry point
├── 📄 package.json            # Dependencies and scripts
├── 📄 vite.config.ts          # Vite build configuration
├── 📄 tailwind.config.js      # Tailwind CSS configuration
├── 📄 components.json         # Shadcn/ui configuration
├── 📄 tsconfig.json          # TypeScript configuration
│
├── 📁 src/                    # 🎯 YOUR MAIN WORKSPACE
│   ├── 📄 App.tsx            # Main React component (EDIT THIS)
│   ├── 📄 main.tsx           # App bootstrap (DO NOT EDIT)
│   ├── 📄 main.css           # Core styles (DO NOT EDIT)
│   ├── 📄 index.css          # Custom theme & styles (EDIT THIS)
│   │
│   ├── 📁 components/        # React components
│   │   ├── 📁 ui/           # Shadcn/ui components (pre-built)
│   │   └── 📄 *.tsx         # Your custom components
│   │
│   ├── 📁 lib/              # Utility functions
│   │   └── 📄 utils.ts      # Helper functions
│   │
│   ├── 📁 hooks/            # Custom React hooks
│   ├── 📁 assets/           # Static files
│   │   ├── 📁 images/       # Images
│   │   ├── 📁 video/        # Videos
│   │   ├── 📁 audio/        # Audio files
│   │   └── 📁 documents/    # Documents
│   │
│   └── 📁 styles/           # Additional CSS files
│
├── 📁 .github/              # GitHub workflows
├── 📁 .devcontainer/        # Development container config
└── 📁 node_modules/         # Dependencies (auto-generated)
```

### 🎯 Key Files Explained

| File | Purpose | Can Edit? |
|------|---------|-----------|
| `src/App.tsx` | **Your main application component** | ✅ YES |
| `src/index.css` | **Custom styles and theme** | ✅ YES |
| `src/components/` | **Your custom components** | ✅ YES |
| `src/assets/` | **Images, videos, documents** | ✅ YES |
| `index.html` | **HTML entry point** | ✅ YES |
| `src/main.tsx` | Runtime bootstrap | ❌ NO |
| `src/main.css` | Core system styles | ❌ NO |

---

## 🔗 Adding Frontend Files

### 1. CSS Files
```css
/* src/styles/custom.css */
.my-custom-class {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  padding: 1rem;
  border-radius: 8px;
}
```

```typescript
// Import in App.tsx or component
import './styles/custom.css'
```

### 2. JavaScript/TypeScript Files
```typescript
// src/lib/helpers.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

// src/components/DateDisplay.tsx
import { formatDate } from '@/lib/helpers'

export function DateDisplay() {
  return <div>{formatDate(new Date())}</div>
}
```

### 3. Images and Assets
```typescript
// Always import assets explicitly
import logoImg from '@/assets/images/logo.png'
import heroVideo from '@/assets/video/hero.mp4'

function Header() {
  return (
    <header>
      <img src={logoImg} alt="Logo" />
      <video src={heroVideo} autoPlay muted />
    </header>
  )
}
```

### 4. External Libraries
```bash
# Use npm to add libraries
npm install axios
npm install chart.js
npm install date-fns
```

```typescript
// Then import and use
import axios from 'axios'
import { format } from 'date-fns'
```

### 5. Google Fonts
```html
<!-- Add to index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
```

```css
/* Use in index.css */
:root {
  --font-primary: 'Roboto', sans-serif;
}

body {
  font-family: var(--font-primary);
}
```

---

## 📦 Export & Packaging

### 🌐 Web Application
```bash
# Build for web deployment
npm run build

# Creates 'dist/' folder with:
# ├── index.html
# ├── assets/
# │   ├── app-[hash].js
# │   └── app-[hash].css
# └── manifest.json (if PWA enabled)
```

### 📱 Mobile App (PWA)
The template includes PWA support. To enhance mobile capabilities:

```json
// Add to package.json
{
  "scripts": {
    "build:mobile": "npm run build && npm run generate-icons"
  }
}
```

```html
<!-- Already included in index.html -->
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
```

### 🖥️ Desktop App (Electron - Optional)
```bash
# Install Electron wrapper
npm install --save-dev electron electron-builder

# Add to package.json scripts
{
  "electron": "electron .",
  "build:electron": "npm run build && electron-builder"
}
```

### 📲 Android APK (Capacitor - Advanced)
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Initialize
npx cap init
npx cap add android
npx cap run android
```

### 💻 Windows EXE (Tauri - Advanced)
```bash
# Install Tauri CLI
npm install --save-dev @tauri-apps/cli

# Add to package.json
{
  "scripts": {
    "tauri": "tauri",
    "build:desktop": "tauri build"
  }
}
```

> **Note**: Mobile and desktop packaging requires additional setup and dependencies. The built-in PWA support provides the easiest path to mobile deployment.

---

## 📋 Example Project Structure

### 🎮 Example: Todo App
```
src/
├── App.tsx                 # Main app component
├── components/
│   ├── TodoList.tsx        # List of todos
│   ├── TodoItem.tsx        # Individual todo
│   ├── AddTodoForm.tsx     # Add new todo
│   └── ui/                 # Shadcn components
├── lib/
│   ├── todo-utils.ts       # Todo helper functions
│   └── validation.ts       # Form validation
├── hooks/
│   └── useTodos.ts         # Custom todo hook
├── styles/
│   └── todo.css           # Todo-specific styles
└── assets/
    └── images/
        └── todo-icon.svg
```

### 🛒 Example: E-commerce Store
```
src/
├── App.tsx                 # Main app with routing
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   └── ProductDetail.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   └── ui/                 # Shadcn components
├── lib/
│   ├── api.ts             # API functions
│   ├── cart-utils.ts      # Cart logic
│   └── currency.ts        # Price formatting
├── hooks/
│   ├── useCart.ts         # Cart state management
│   └── useProducts.ts     # Product data
└── assets/
    ├── images/
    │   ├── products/
    │   └── icons/
    └── styles/
        └── ecommerce.css
```

### 🎨 Example: Portfolio Website
```
src/
├── App.tsx                 # Main portfolio app
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── Contact.tsx
│   ├── ui/                 # Shadcn components
│   └── animations/
│       └── ScrollReveal.tsx
├── lib/
│   ├── projects-data.ts   # Project information
│   └── animations.ts      # Animation utilities
├── hooks/
│   └── useScrollAnimation.ts
└── assets/
    ├── images/
    │   ├── projects/
    │   ├── profile/
    │   └── icons/
    ├── documents/
    │   └── resume.pdf
    └── video/
        └── demo-reel.mp4
```

---

## 🚀 Deployment Guide

### 1. 🌍 Cloud Deployment (Vercel - Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repository for auto-deploy
```

**Steps:**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Automatic deployments on every push
4. Custom domain support available

### 2. 🏠 Local Development
```bash
# Development server
npm run dev
# Runs on http://localhost:5173

# Production preview
npm run build
npm run preview
# Runs on http://localhost:4173
```

### 3. 📡 Other Deployment Options

#### Netlify
```bash
# Build and deploy
npm run build
# Upload 'dist' folder to Netlify
```

#### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy
npm run build
firebase deploy
```

#### AWS S3 + CloudFront
```bash
# Build project
npm run build

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## 🧰 Tech Stack

### 🎯 Core Technologies
- **⚛️ React 19.0.0** - Modern UI library with latest features
- **🔷 TypeScript 5.7.2** - Type-safe JavaScript
- **⚡ Vite 6.3.5** - Fast build tool and dev server
- **🎨 Tailwind CSS 4.1.11** - Utility-first CSS framework

### 🎨 UI & Design
- **🧩 Shadcn/ui** - Pre-built accessible components
- **📐 Radix UI** - Primitive components
- **🎭 Framer Motion 12.6.2** - Animation library
- **🎨 Phosphor Icons** - Icon library
- **🎯 Lucide React** - Additional icons

### 🤖 AI & Advanced Features
- **🧠 @github/spark** - AI integration and runtime
- **💾 useKV Hook** - Persistent key-value storage
- **👤 User Management** - GitHub user integration
- **🔍 LLM Integration** - GPT-4 and GPT-4o-mini support

### 🔧 Development Tools
- **📋 ESLint** - Code linting
- **🏗️ TypeScript** - Type checking
- **📦 npm/yarn** - Package management
- **🔄 Hot Reload** - Instant updates

### 📊 Data & State
- **🗃️ Spark KV** - Built-in storage system
- **⚛️ React State** - Component state management
- **🔄 React Query** - Server state management
- **📝 React Hook Form** - Form handling

### 🎛️ Additional Libraries
- **📈 Recharts** - Chart components
- **📅 date-fns** - Date utilities
- **🎨 D3.js** - Data visualization
- **🎮 Three.js** - 3D graphics
- **🔊 Web Audio API** - Audio processing

---

## 🏁 Getting Started

### 1. 🔧 Prerequisites
- **Node.js 18+** (included in environment)
- **npm or yarn** (included)
- **Git** (included)

### 2. 🚀 Quick Start
```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### 3. 🎯 Create Your First Component
```typescript
// src/components/Welcome.tsx
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Welcome() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Spark! 🚀
      </h1>
      <Button 
        onClick={() => setCount(count + 1)}
        className="mb-4"
      >
        Clicked {count} times
      </Button>
      <p className="text-muted-foreground">
        Start building something amazing!
      </p>
    </div>
  )
}
```

```typescript
// src/App.tsx
import { Welcome } from '@/components/Welcome'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Welcome />
    </div>
  )
}

export default App
```

### 4. 💾 Add Persistent Data
```typescript
// src/components/Counter.tsx
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'

export function Counter() {
  const [count, setCount] = useKV('my-counter', 0)
  
  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setCount(count - 1)}>-</Button>
      <span className="text-2xl font-bold">{count}</span>
      <Button onClick={() => setCount(count + 1)}>+</Button>
    </div>
  )
}
```

### 5. 🎨 Customize Theme
```css
/* src/index.css */
:root {
  --primary: oklch(0.62 0.18 250);      /* Blue */
  --secondary: oklch(0.95 0.01 250);    /* Light gray */
  --accent: oklch(0.68 0.16 310);       /* Purple */
  --background: oklch(0.99 0.005 240);  /* White */
  --foreground: oklch(0.08 0.015 240);  /* Dark */
}
```

---

## 🤖 AI Features

### 💬 LLM Integration
```typescript
// Use AI in your components
import { useState } from 'react'

function AIChat() {
  const [response, setResponse] = useState('')
  
  const askAI = async () => {
    const prompt = spark.llmPrompt`What is React?`
    const answer = await spark.llm(prompt)
    setResponse(answer)
  }
  
  return (
    <div>
      <button onClick={askAI}>Ask AI</button>
      <p>{response}</p>
    </div>
  )
}
```

### 👤 User Context
```typescript
// Access current user
import { useEffect, useState } from 'react'

function UserProfile() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    spark.user().then(setUser)
  }, [])
  
  return (
    <div>
      {user && (
        <div>
          <img src={user.avatarUrl} alt="Avatar" />
          <p>Hello, {user.login}!</p>
        </div>
      )}
    </div>
  )
}
```

### 💾 Persistent Storage
```typescript
// Store data that persists between sessions
import { useKV } from '@github/spark/hooks'

function Settings() {
  const [theme, setTheme] = useKV('user-theme', 'light')
  const [notifications, setNotifications] = useKV('notifications', true)
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      
      <label>
        <input 
          type="checkbox" 
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        Enable notifications
      </label>
    </div>
  )
}
```

---

## 💡 Best Practices

### 🏗️ Component Organization
```typescript
// ✅ Good: Small, focused components
function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ✅ Good: Separate concerns
function UserCard({ user }) {
  return (
    <div className="user-card">
      <Avatar src={user.avatar} />
      <UserInfo name={user.name} email={user.email} />
      <UserActions userId={user.id} />
    </div>
  )
}
```

### 💾 Data Management
```typescript
// ✅ Use useKV for persistent data
const [userPreferences, setUserPreferences] = useKV('preferences', {})

// ✅ Use useState for temporary UI state
const [isLoading, setIsLoading] = useState(false)
const [currentTab, setCurrentTab] = useState('overview')

// ✅ Use functional updates to avoid stale closures
setTodos(currentTodos => [...currentTodos, newTodo])
```

### 🎨 Styling Guidelines
```css
/* ✅ Use CSS custom properties for theme values */
:root {
  --primary-color: oklch(0.62 0.18 250);
  --border-radius: 0.5rem;
}

/* ✅ Use Tailwind utility classes */
.card {
  @apply bg-card border rounded-lg p-6 shadow-sm;
}

/* ✅ Responsive design with mobile-first approach */
.grid {
  @apply grid grid-cols-1 gap-4;
  @apply md:grid-cols-2 lg:grid-cols-3;
}
```

### 🚀 Performance Tips
```typescript
// ✅ Lazy load components
const LazyChart = lazy(() => import('./Chart'))

// ✅ Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return processLargeDataset(data)
}, [data])

// ✅ Use proper asset imports
import heroImage from '@/assets/images/hero.jpg'
// ❌ Don't use string paths
// <img src="/src/assets/images/hero.jpg" />
```

### 🔒 Security Best Practices
```typescript
// ✅ Validate user input
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(120)
})

// ✅ Sanitize data before storage
const sanitizedData = sanitize(userInput)
await spark.kv.set('user-data', sanitizedData)

// ✅ Use environment variables for sensitive data
// (Note: Be careful with client-side code)
```

---

## 🔧 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run lint
```

#### Import Issues
```typescript
// ✅ Use alias imports
import { Button } from '@/components/ui/button'

// ❌ Avoid relative imports from deep paths
// import { Button } from '../../../components/ui/button'
```

#### Asset Loading
```typescript
// ✅ Import assets explicitly
import image from '@/assets/images/logo.png'
<img src={image} alt="Logo" />

// ❌ Don't use string paths
// <img src="/src/assets/images/logo.png" alt="Logo" />
```

---

## 📞 Support & Resources

### 📚 Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Vite Guide](https://vitejs.dev/guide)

### 💬 Community
- [GitHub Discussions](https://github.com/github/spark-template/discussions)
- [Discord Community](https://discord.gg/github)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/github-spark)

### 🐛 Issues & Bugs
- [Report Issues](https://github.com/github/spark-template/issues)
- [Feature Requests](https://github.com/github/spark-template/issues/new?template=feature_request.md)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ by the GitHub team and the open-source community.

- **React Team** - For the amazing React library
- **Vercel** - For Vite and amazing dev tools
- **Tailwind Labs** - For Tailwind CSS
- **Radix UI** - For accessible UI primitives
- **Shadcn** - For beautiful component designs

---

**Ready to build something amazing? Start coding in `src/App.tsx`! 🚀**