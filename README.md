# 🚀 GitHub Spark Template

> **A powerful, modern web development environment for building beautiful, AI-powered applications with React, TypeScript, and Tailwind CSS.**

---

## 📋 Table of Contents

- [What is GitHub Spark Template?](#what-is-github-spark-template)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🏗 Building Your Own Project](#-building-your-own-project)
- [📱 Mobile & Desktop Packaging](#-mobile--desktop-packaging)
- [🌐 Deployment Options](#-deployment-options)
- [📖 Development Guide](#-development-guide)
- [🎯 Example Projects](#-example-projects)
- [⚡ Quick Start](#-quick-start)
- [🤝 Contributing](#-contributing)

---

## What is GitHub Spark Template?

GitHub Spark Template is a cutting-edge development environment that provides a complete foundation for building modern web applications. It combines the power of **React 19**, **TypeScript**, **Tailwind CSS**, and **GitHub Spark's AI capabilities** to create a seamless development experience.

### ✨ Key Features

- **🤖 AI-Powered Development**: Built-in AI assistance with LLM integration
- **⚡ Lightning Fast**: Vite-powered development with hot reload
- **📱 Mobile-First**: Responsive design with PWA capabilities
- **🎨 Beautiful UI**: shadcn/ui components with Tailwind CSS
- **🔒 Type-Safe**: Full TypeScript support with strict typing
- **💾 Persistent Storage**: Key-value storage with React hooks
- **🌍 Ready for Production**: Built-in deployment configurations

---

## 🛠 Tech Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Next-generation frontend tooling

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible components
- **Framer Motion** - Smooth animations and transitions
- **Phosphor Icons** - Beautiful icon library

### AI & Data
- **GitHub Spark AI** - Built-in LLM integration
- **Key-Value Storage** - Persistent data with `useKV` hook
- **Real-time Updates** - Reactive state management

### Build & Deployment
- **Vite** - Fast bundling and development server
- **ESLint** - Code linting and formatting
- **PWA Support** - Progressive web app capabilities

---

## 📁 Project Structure

```
spark-template/
├── 📄 index.html                 # Main HTML entry point
├── 📦 package.json              # Dependencies and scripts
├── ⚙️ vite.config.ts            # Vite configuration
├── 🎨 tailwind.config.js        # Tailwind CSS configuration
├── 📝 tsconfig.json             # TypeScript configuration
├── 🔧 components.json           # shadcn/ui configuration
│
├── 📂 src/                      # Source code directory
│   ├── 🚀 main.tsx             # Application entry point (DO NOT EDIT)
│   ├── 🎨 main.css             # Core styles (DO NOT EDIT)
│   ├── 📱 App.tsx              # Main application component
│   ├── 🎨 index.css            # Custom theme and styles
│   │
│   ├── 📂 components/          # React components
│   │   ├── 📂 ui/              # shadcn/ui components (pre-installed)
│   │   ├── 🤖 AIAssistant.tsx  # AI-powered features
│   │   ├── 📊 Dashboard.tsx    # Main dashboard
│   │   └── ...                 # Other custom components
│   │
│   ├── 📂 lib/                 # Utility functions
│   │   └── 🔧 utils.ts         # Helper functions and class utilities
│   │
│   ├── 📂 hooks/               # Custom React hooks
│   ├── 📂 assets/              # Static assets
│   │   ├── 📷 images/          # Image files
│   │   ├── 🎵 audio/           # Audio files
│   │   ├── 📹 video/           # Video files
│   │   └── 📄 documents/       # Document files
│   │
│   └── 📂 styles/              # Additional stylesheets
│
├── 📂 packages/                # Workspace packages
├── 📂 .devcontainer/           # Development container config
├── 📂 .github/                 # GitHub workflows and templates
└── 📋 README.md                # This file
```

### 🔍 Key Files Explained

| File/Folder | Purpose | Can Edit? |
|-------------|---------|-----------|
| `index.html` | Main HTML template with meta tags and imports | ✅ Yes |
| `src/App.tsx` | Main React component - your app starts here | ✅ Yes |
| `src/index.css` | Custom theme, colors, and animations | ✅ Yes |
| `src/main.tsx` | Application entry point and Spark integration | ❌ **NO** |
| `src/main.css` | Core structural styles | ❌ **NO** |
| `src/components/ui/` | Pre-installed shadcn/ui components | ✅ Limited |
| `src/lib/utils.ts` | Utility functions and helpers | ✅ Yes |
| `package.json` | Dependencies and build scripts | ✅ Limited |
| `vite.config.ts` | Vite build configuration | ✅ Limited |

---

## 🏗 Building Your Own Project

### 1. **Getting Started**

The Spark Template provides a complete React application foundation. Your main development happens in:

- **`src/App.tsx`** - Your main application logic
- **`src/index.css`** - Custom styling and themes  
- **`src/components/`** - Your custom components

### 2. **Adding New Components**

Create new React components in the `src/components/` directory:

```tsx
// src/components/MyComponent.tsx
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function MyComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Count: {count}</h1>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </div>
  )
}
```

### 3. **Using AI Features**

Leverage built-in AI capabilities with the Spark API:

```tsx
// Example: AI-powered content generation
const generateContent = async () => {
  const prompt = spark.llmPrompt`Generate a tutorial about ${topic}`
  const result = await spark.llm(prompt)
  setContent(result)
}
```

### 4. **Persistent Data Storage**

Use the `useKV` hook for data that should persist between sessions:

```tsx
import { useKV } from '@github/spark/hooks'

function MyApp() {
  // ✅ For persistent data (survives page refresh)
  const [userData, setUserData] = useKV('user-data', null)
  const [settings, setSettings] = useKV('app-settings', {})
  
  // ✅ For temporary state (doesn't persist)
  const [loading, setLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState('home')
}
```

### 5. **Styling Your App**

#### **Using Tailwind CSS**
```tsx
<div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
  <h1 className="text-xl font-semibold">Beautiful Card</h1>
</div>
```

#### **Custom CSS Variables**
Edit `src/index.css` to customize your theme:

```css
:root {
  --primary: oklch(0.52 0.22 235);     /* Your brand color */
  --background: oklch(0.99 0.005 240);  /* Page background */
  --foreground: oklch(0.08 0.015 240);  /* Text color */
  /* ... other theme variables */
}
```

### 6. **Adding Assets**

Store all assets in the `src/assets/` directory and import them:

```tsx
// ✅ Correct way to use assets
import myImage from '@/assets/images/logo.png'
import heroVideo from '@/assets/video/hero.mp4'

function Header() {
  return (
    <div>
      <img src={myImage} alt="Logo" />
      <video src={heroVideo} autoPlay muted />
    </div>
  )
}
```

---

## 📱 Mobile & Desktop Packaging

### Android APK (Using Capacitor)

1. **Install Capacitor**
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

2. **Initialize Capacitor**
```bash
npx cap init YourAppName com.yourcompany.yourapp
```

3. **Build and Add Android Platform**
```bash
npm run build
npx cap add android
npx cap copy
npx cap open android
```

4. **Build APK in Android Studio**
- Open the project in Android Studio
- Build → Generate Signed Bundle/APK
- Follow the signing process

### Windows EXE (Using Tauri)

1. **Install Tauri**
```bash
npm install @tauri-apps/cli @tauri-apps/api
```

2. **Initialize Tauri**
```bash
npx tauri init
```

3. **Configure tauri.conf.json**
```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  }
}
```

4. **Build EXE**
```bash
npx tauri build
```

### macOS App (Using Tauri)

Follow the same Tauri setup as Windows, but build on macOS:
```bash
npx tauri build --target aarch64-apple-darwin  # For Apple Silicon
npx tauri build --target x86_64-apple-darwin   # For Intel Macs
```

---

## 🌐 Deployment Options

### 1. **Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

### 2. **Netlify**
```bash
npm run build
# Upload dist/ folder to Netlify
```

### 3. **GitHub Pages**
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

### 4. **Self-Hosted**
```bash
npm run build
# Upload dist/ folder to your web server
```

### 5. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 📖 Development Guide

### Local Development

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

3. **Build for Production**
```bash
npm run build
```

4. **Preview Production Build**
```bash
npm run preview
```

### Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run optimize` | Optimize dependencies |

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_APP_NAME=Your App Name
VITE_API_URL=https://your-api.com
VITE_ANALYTICS_ID=your-analytics-id
```

Access in your code:
```tsx
const appName = import.meta.env.VITE_APP_NAME
```

---

## 🎯 Example Projects

### Simple Todo App
```tsx
// src/components/TodoApp.tsx
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function TodoApp() {
  const [todos, setTodos] = useKV('todos', [])
  const [input, setInput] = useState('')
  
  const addTodo = () => {
    setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }])
    setInput('')
  }
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex gap-2 mb-4">
        <Input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
        />
        <Button onClick={addTodo}>Add</Button>
      </div>
      
      {todos.map(todo => (
        <div key={todo.id} className="flex items-center gap-2 p-2">
          <input 
            type="checkbox" 
            checked={todo.done}
            onChange={(e) => setTodos(prev => 
              prev.map(t => t.id === todo.id ? {...t, done: e.target.checked} : t)
            )}
          />
          <span className={todo.done ? 'line-through' : ''}>{todo.text}</span>
        </div>
      ))}
    </div>
  )
}
```

### AI Chat Component
```tsx
// src/components/AIChat.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  
  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    
    try {
      const prompt = spark.llmPrompt`Respond to this message: ${input}`
      const response = await spark.llm(prompt)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('AI response failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4 mb-4 h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-3 rounded-lg ${
            msg.role === 'user' 
              ? 'bg-primary text-primary-foreground ml-8' 
              : 'bg-muted mr-8'
          }`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-center">AI is thinking...</div>}
      </div>
      
      <div className="flex gap-2">
        <Textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="resize-none"
        />
        <Button onClick={sendMessage} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  )
}
```

---

## ⚡ Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/spark-template.git
cd spark-template
npm install
```

### 2. Start Development
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:5173`

### 4. Start Building
- Edit `src/App.tsx` for your main app logic
- Customize `src/index.css` for styling
- Add components in `src/components/`

### 5. Deploy
```bash
npm run build
# Deploy dist/ folder to your hosting platform
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🔗 Resources

- [GitHub Spark Documentation](https://github.com/github/spark)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Vite Documentation](https://vitejs.dev)

---

<div align="center">

**Made with ❤️ using GitHub Spark Template**

*Build beautiful, AI-powered applications with ease*

[⭐ Star on GitHub](https://github.com/your-username/spark-template) | [📖 Documentation](https://github.com/your-username/spark-template/wiki) | [🐛 Report Bug](https://github.com/your-username/spark-template/issues)

</div>