# AstraForensics - Spark-Enhanced Cybersecurity Learning Platform

A modern, AI-powered cybersecurity learning platform built with React, TypeScript, and Spark Technology. Features responsive design, interactive learning modules, AI assistants, and beautiful animated certificates.

## ✨ What Makes This Special

### 🚀 Spark-Powered Enhancements
- **Spark Animations**: Custom electric, neon, plasma, and energy color schemes
- **Enhanced Certificates**: Professional, print-ready certificates with holographic effects
- **Responsive Design**: Perfect across all devices from mobile to ultra-wide screens
- **AI Integration**: Built-in LLM capabilities for personalized learning

### 🎯 Key Features
- Interactive cybersecurity learning modules
- AI-powered quizzes and assessments
- Professional certificate generation
- Career path recommendations
- Offline learning capabilities
- Real-time progress tracking

## 🏗️ Project Structure

```
/workspaces/spark-template/
├── index.html                 # Main HTML entry point
├── src/
│   ├── App.tsx               # Main React application
│   ├── index.css             # Enhanced Spark theme & animations
│   ├── main.tsx              # React entry point (DO NOT EDIT)
│   ├── main.css              # Core CSS (DO NOT EDIT)
│   ├── components/
│   │   ├── ui/               # Shadcn components (pre-installed)
│   │   ├── Dashboard.tsx     # Main dashboard component
│   │   ├── SparkEnhancedCertificate.tsx  # Enhanced certificate component
│   │   ├── WelcomeTour.tsx   # Onboarding experience
│   │   ├── RegistrationForm.tsx  # User registration
│   │   ├── ModuleContentViewer.tsx  # Learning content
│   │   ├── AIQuizGenerator.tsx  # AI-powered quizzes
│   │   ├── EnhancedAIAssistant.tsx  # AI learning assistant
│   │   └── [other components...]
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   └── assets/
│       ├── images/           # Image assets
│       ├── video/            # Video assets
│       ├── audio/            # Audio assets
│       └── documents/        # Document assets
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

## 🎨 Enhanced UI & Animations

### Spark Color Palette
- **Electric**: `oklch(0.68 0.25 190)` - Bright cyan for energy
- **Neon**: `oklch(0.72 0.22 340)` - Vibrant pink for highlights
- **Plasma**: `oklch(0.70 0.24 285)` - Deep purple for depth
- **Energy**: `oklch(0.75 0.20 85)` - Bright yellow for success

### Animation Classes
```css
/* Spark Effects */
.spark-glow          /* Electric glow animation */
.electric-trail      /* Moving electric effect */
.plasma-pulse        /* Pulsing plasma effect */
.energy-burst        /* Achievement burst */
.holographic         /* Holographic shimmer */
.quantum-particle    /* Floating particle effect */

/* Certificate Effects */
.certificate-sparkle /* Certificate star animation */
.gradient-text       /* Animated gradient text */
.spark-float-1/2/3   /* Floating variations */
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Single column, large touch targets
- **Tablet**: `768px - 1024px` - Two columns, optimized spacing
- **Desktop**: `1024px - 1280px` - Full layout
- **Wide**: `1280px - 1536px` - Enhanced spacing
- **Ultra-wide**: `> 1536px` - Maximum content width

### Viewport Handling
- Dynamic viewport height (`dvh`) support
- Visual viewport API integration
- Orientation change handling
- Safe area insets for modern devices

## 🧩 Building Your Own Project

### 1. Component Structure
```tsx
// Import required dependencies
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'

// Use Spark animations
<motion.div className="spark-glow">
  <Button className="spark-button">
    Click me!
  </Button>
</motion.div>
```

### 2. Data Persistence
```tsx
// Use useKV for data that should persist
const [userData, setUserData] = useKV('user-data', null)
const [progress, setProgress] = useKV('learning-progress', 0)

// Use useState for temporary state
const [isLoading, setIsLoading] = useState(false)
```

### 3. Asset Imports
```tsx
// Always import assets explicitly
import myImage from '@/assets/images/hero.png'
import myVideo from '@/assets/video/intro.mp4'

// Use in JSX
<img src={myImage} alt="Hero" />
<video src={myVideo} controls />
```

### 4. AI Integration
```tsx
// Create prompts with spark.llmPrompt
const prompt = spark.llmPrompt`Analyze this topic: ${topic}`
const response = await spark.llm(prompt)

// JSON mode for structured data
const jsonPrompt = spark.llmPrompt`Generate user data as JSON`
const result = await spark.llm(jsonPrompt, "gpt-4o", true)
const data = JSON.parse(result)
```

## 🎓 Certificate System

### Features
- **Professional Design**: Print-ready with proper dimensions
- **Dynamic Content**: Personalized with user data and achievements
- **Multiple Formats**: PNG download, print, and share options
- **Grade-based Styling**: Platinum, Gold, and standard variants
- **Spark Animations**: Floating particles and electric effects

### Usage
```tsx
<SparkEnhancedCertificate
  isOpen={showCertificate}
  onClose={() => setShowCertificate(false)}
  certificateData={{
    id: "unique-id",
    studentName: "John Doe",
    courseName: "Cybersecurity Fundamentals",
    completionDate: new Date(),
    score: 95,
    grade: "A+",
    moduleId: "cyber-101",
    skills: ["Risk Assessment", "Security Frameworks"],
    duration: "6 weeks",
    certificateType: "mastery"
  }}
/>
```

## 🚀 Development Guide

### Adding New Components
1. Create in `/src/components/`
2. Follow naming convention: `PascalCase.tsx`
3. Import and use Shadcn components
4. Add Spark animations for enhanced UX

### Styling Best Practices
1. Use Tailwind utility classes
2. Leverage CSS custom properties for theming
3. Add Spark animation classes for special effects
4. Follow responsive design patterns

### State Management
- **Persistent Data**: Use `useKV` hook
- **Temporary State**: Use `useState`
- **Global State**: Props drilling or context

## 📦 Export & Deployment

### Local Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

### Mobile App (Capacitor)
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Initialize
npx cap init

# Build and sync
npm run build
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

### Desktop App (Electron)
```bash
# Install Electron
npm install --save-dev electron

# Add build script
npm install --save-dev electron-builder

# Build
npm run build
npm run electron-pack
```

## 🎯 Example Project Structure

```
my-spark-app/
├── src/
│   ├── App.tsx               # Main app logic
│   ├── index.css             # Custom Spark theme
│   ├── components/
│   │   ├── HomePage.tsx      # Landing page
│   │   ├── Dashboard.tsx     # User dashboard
│   │   ├── Settings.tsx      # App settings
│   │   └── ui/              # Shadcn components
│   ├── lib/
│   │   └── utils.ts         # Helper functions
│   └── assets/
│       ├── images/
│       │   ├── logo.png
│       │   └── hero.jpg
│       ├── video/
│       │   └── demo.mp4
│       └── audio/
│           └── success.mp3
├── index.html               # HTML entry point
└── README.md               # Project documentation
```

## 🔧 Configuration Files

### Important Files to Keep
- `src/main.tsx` - **DO NOT EDIT** (Spark integration)
- `src/main.css` - **DO NOT EDIT** (Core styling)
- `tailwind.config.js` - Extend for custom themes
- `tsconfig.json` - TypeScript configuration

### Customizable Files
- `src/index.css` - Add your custom styles and themes
- `src/App.tsx` - Your main application logic
- `index.html` - HTML meta tags and external resources

## 🌟 Best Practices

### Performance
- Lazy load components with `React.lazy()`
- Optimize images with proper formats
- Use `useMemo` and `useCallback` for expensive operations
- Implement proper loading states

### Accessibility
- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios

### Mobile Optimization
- Touch-friendly button sizes (48px minimum)
- Proper viewport handling
- Optimized font sizes
- Gesture support

## 🐛 Troubleshooting

### Common Issues
1. **Viewport height issues**: Use CSS custom properties `--vh` or `--dvh`
2. **Animation performance**: Use `transform` and `opacity` for smooth animations
3. **Asset loading**: Always import assets, don't use string paths
4. **State persistence**: Use `useKV` for data that should survive page refresh

### Performance Tips
- Use `motion.div` sparingly for animations
- Implement proper image optimization
- Add loading states for better UX
- Use proper TypeScript types

## 📄 License

This project is built on the Spark Template framework and includes enhanced UI, animations, and cybersecurity-focused features. See individual component licenses for specific details.

---

**Built with ⚡ Spark Technology** - Enhancing web applications with beautiful animations and responsive design.