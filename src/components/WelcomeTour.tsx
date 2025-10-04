import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  ShieldCheck, 
  Brain, 
  Trophy, 
  Sparkle, 
  BookOpen, 
  TrendUp,
  ChatCircle,
  Download,
  WifiHigh,
  ArrowRight,
  Star,
  Lightning
} from '@phosphor-icons/react'

interface WelcomeTourProps {
  onComplete: () => void
}

const features = [
  {
    icon: ShieldCheck,
    title: "Advanced Cybersecurity Learning",
    description: "Master cybersecurity with interactive modules, real-world scenarios, and hands-on labs designed by industry experts.",
    color: "from-blue-500 to-cyan-500",
    highlights: ["Interactive Labs", "Real Scenarios", "Expert Content"]
  },
  {
    icon: Brain,
    title: "AI-Powered Learning Assistant",
    description: "Get personalized learning recommendations, instant help, and adaptive content based on your progress and learning style.",
    color: "from-purple-500 to-pink-500",
    highlights: ["Personalized AI", "Instant Help", "Adaptive Learning"]
  },
  {
    icon: TrendUp,
    title: "Career Path Recommendations",
    description: "Discover your ideal cybersecurity career path with AI-driven assessments and industry-aligned skill development.",
    color: "from-green-500 to-emerald-500",
    highlights: ["Career Guidance", "Skill Assessment", "Industry Aligned"]
  },
  {
    icon: Trophy,
    title: "Professional Certifications",
    description: "Earn industry-recognized certificates with beautiful, downloadable designs that showcase your cybersecurity expertise.",
    color: "from-yellow-500 to-orange-500",
    highlights: ["Industry Recognized", "Downloadable", "Professional Design"]
  },
  {
    icon: WifiHigh,
    title: "Offline Learning Capabilities",
    description: "Continue learning anywhere with offline mode. Download courses, take quizzes, and track progress without internet.",
    color: "from-indigo-500 to-blue-500",
    highlights: ["Offline Mode", "Download Content", "Sync Progress"]
  },
  {
    icon: ChatCircle,
    title: "AI Chat Assistant",
    description: "24/7 AI chatbot for instant answers, explanations, and guidance throughout your cybersecurity learning journey.",
    color: "from-rose-500 to-pink-500",
    highlights: ["24/7 Support", "Instant Answers", "Learning Guidance"]
  }
]

export function WelcomeTour({ onComplete }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <ShieldCheck size={32} className="text-white" weight="fill" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Welcome to AstraForensics
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The most advanced AI-powered cybersecurity learning platform
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="anime-glow">
              <Sparkle size={14} className="mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="anime-glow">
              <Trophy size={14} className="mr-1" />
              Certified
            </Badge>
            <Badge variant="secondary" className="anime-glow">
              <Lightning size={14} className="mr-1" />
              Interactive
            </Badge>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Feature {currentStep + 1} of {features.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / features.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / features.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Feature Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: isAnimating ? 0 : 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Main Feature Card */}
            <Card className="relative overflow-hidden card-hover border-2">
              <div className={`absolute inset-0 bg-gradient-to-br ${features[currentStep].color} opacity-10`} />
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-br ${features[currentStep].color}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {(() => {
                      const IconComponent = features[currentStep].icon;
                      return <IconComponent size={32} className="text-white" weight="fill" />;
                    })()}
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl mb-2">{features[currentStep].title}</CardTitle>
                    <CardDescription className="text-base">
                      {features[currentStep].description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative">
                <div className="space-y-3">
                  {features[currentStep].highlights.map((highlight, index) => (
                    <motion.div
                      key={highlight}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <Star size={16} className="text-accent" weight="fill" />
                      <span className="text-foreground">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  className="mt-6 p-4 bg-secondary/50 rounded-lg border"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-sm text-muted-foreground">
                    ✨ This feature will help you become a cybersecurity expert faster and more effectively!
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={20} className="text-primary" />
                  Quick Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentStep === 0 && (
                    <div className="space-y-2">
                      <div className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-3/4"></div>
                      <div className="h-3 bg-secondary rounded-full w-1/2"></div>
                      <div className="h-3 bg-secondary rounded-full w-2/3"></div>
                    </div>
                  )}
                  
                  {currentStep === 1 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded-lg">
                        <Brain size={16} className="text-purple-500" />
                        <span className="text-sm">AI analyzing your progress...</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg">
                        <Sparkle size={16} className="text-green-500" />
                        <span className="text-sm">Recommendation ready!</span>
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 2 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                        <span className="text-sm">Security Analyst</span>
                        <span className="text-xs text-green-600">95% match</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
                        <span className="text-sm">Penetration Tester</span>
                        <span className="text-xs text-blue-600">88% match</span>
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 3 && (
                    <motion.div
                      className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Trophy size={24} className="text-yellow-600 mx-auto mb-2" weight="fill" />
                      <div className="text-center text-sm font-medium">
                        Professional Certificate
                      </div>
                    </motion.div>
                  )}
                  
                  {currentStep === 4 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded">
                        <Download size={16} className="text-blue-500" />
                        <span className="text-sm">Course downloaded</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                        <WifiHigh size={16} className="text-green-500" />
                        <span className="text-sm">Available offline</span>
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 5 && (
                    <div className="space-y-2">
                      <div className="p-2 bg-rose-500/10 rounded-lg">
                        <ChatCircle size={16} className="text-rose-500 mb-1" />
                        <div className="text-xs">
                          "How do I secure a network against DDoS attacks?"
                        </div>
                      </div>
                      <div className="p-2 bg-secondary rounded-lg ml-4">
                        <div className="text-xs">
                          "Here are the best practices for DDoS protection..."
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip Tour
          </Button>

          <div className="flex gap-2">
            {features.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-secondary'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-primary to-accent text-white anime-glow"
          >
            {currentStep === features.length - 1 ? 'Start Learning' : 'Next'}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Ready to become a cybersecurity expert? Let's begin your journey!
        </motion.div>
      </div>
    </div>
  )
}