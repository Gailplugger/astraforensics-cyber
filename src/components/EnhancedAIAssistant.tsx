import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useKV } from '@github/spark/hooks'
import { formatDate, formatTime } from '@/lib/utils'
import { createPrompt, callLLM, sparkError } from '@/lib/spark-api'
import { 
  Robot, 
  X, 
  Sparkle, 
  Brain, 
  Lightning, 
  BookOpen, 
  Target, 
  Gear,
  ChartLine,
  Shield,
  List,
  Play,
  PaperPlaneTilt
} from '@phosphor-icons/react'

interface UserData {
  name: string
  class: string
  email: string
  phone: string
  registeredAt: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date | string
  type?: 'text' | 'recommendation' | 'quiz' | 'progress'
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  userData: UserData | null
  currentModule?: string
  context?: string
}

const AI_FEATURES = [
  {
    id: 'study-help',
    name: 'Study Help',
    icon: BookOpen,
    description: 'Get explanations and clarifications',
    prompt: 'Help me understand cybersecurity concepts'
  },
  {
    id: 'quiz-generation',
    name: 'Quiz Me',
    icon: Target,
    description: 'Generate practice questions',
    prompt: 'Create a quiz about'
  },
  {
    id: 'progress-analysis',
    name: 'Progress Review',
    icon: ChartLine,
    description: 'Analyze my learning progress',
    prompt: 'Analyze my learning progress and suggest improvements'
  },
  {
    id: 'career-guidance',
    name: 'Career Advice',
    icon: Shield,
    description: 'Cybersecurity career guidance',
    prompt: 'Give me cybersecurity career advice'
  },
  {
    id: 'study-plan',
    name: 'Study Plan',
    icon: List,
    description: 'Create personalized study plans',
    prompt: 'Create a personalized cybersecurity study plan for me'
  },
  {
    id: 'concepts-explained',
    name: 'Explain Concepts',
    icon: Lightning,
    description: 'Break down complex topics',
    prompt: 'Explain this cybersecurity concept in simple terms:'
  }
]

export function EnhancedAIAssistant({ isOpen, onClose, userData, currentModule, context }: AIAssistantProps) {
  const [messages, setMessages] = useKV<Message[]>('ai-chat-history', [])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ((!messages || messages.length === 0) && userData) {
      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hello ${userData.name}! 👋 I'm your AI cybersecurity learning assistant. I can help you with:\n\n• Explaining complex concepts\n• Creating practice quizzes\n• Analyzing your progress\n• Career guidance\n• Study planning\n\nHow can I help you today?`,
        timestamp: new Date(),
        type: 'text'
      }
      setMessages([welcomeMessage])
    }
  }, [userData, messages?.length, setMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputValue.trim()
    if (!messageToSend || isLoading) return

    setIsLoading(true)
    setInputValue('')

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    }

    setMessages(currentMessages => [...(currentMessages || []), userMessage])

    try {
      // Create AI prompt with context
      const contextInfo = userData ? `
User: ${userData.name} (${userData.class})
Current Module: ${currentModule || 'Dashboard'}
Context: ${context || 'General assistance'}
Chat History: ${(messages || []).slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}
` : ''

      const prompt = createPrompt`You are an advanced AI cybersecurity learning assistant for AstraForensics platform. You are helpful, knowledgeable, and encouraging.

Context:
${contextInfo}

User Question: ${messageToSend}

Please provide a helpful, accurate, and encouraging response about cybersecurity. Keep responses concise but informative. Use emojis sparingly but appropriately. If the user asks for quizzes, create relevant cybersecurity questions. If they need explanations, break down complex concepts into digestible parts.`

      const response = await callLLM(prompt)

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(currentMessages => [...(currentMessages || []), aiMessage])
    } catch (error) {
      sparkError('AI response error', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment! 🤖",
        timestamp: new Date()
      }
      setMessages(currentMessages => [...(currentMessages || []), errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeatureSelect = (feature: typeof AI_FEATURES[0]) => {
    setSelectedFeature(feature.id)
    setInputValue(feature.prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-4xl h-[85vh] max-h-[600px] sm:h-[90vh] sm:max-h-[700px] bg-card rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="p-2 bg-primary/10 rounded-full"
                >
                  <Robot size={24} className="text-primary" weight="fill" />
                </motion.div>
                <div>
                  <CardTitle className="text-lg sm:text-xl flex items-center space-x-2">
                    <span>AI Learning Assistant</span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkle size={16} className="text-accent" weight="fill" />
                    </motion.div>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Powered by advanced AI • {userData?.name ? `Helping ${userData.name}` : 'Ready to help'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>

          <div className="flex flex-col lg:flex-row h-[50vh] sm:h-[60vh] lg:h-[65vh]">
            {/* AI Features Sidebar */}
            <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r p-4 lg:p-6 bg-muted/30">
              <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Brain size={16} className="text-primary" />
                <span>AI Features</span>
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {AI_FEATURES.map((feature) => (
                  <motion.div
                    key={feature.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={selectedFeature === feature.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleFeatureSelect(feature)}
                      className="w-full justify-start text-left h-auto p-3 space-x-2"
                    >
                      <feature.icon size={16} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs lg:text-sm truncate">{feature.name}</div>
                        <div className="text-xs text-muted-foreground hidden lg:block">{feature.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-4 lg:mt-6 space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Quick Stats</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Messages today:</span>
                    <Badge variant="secondary" className="text-xs">
                      {(() => {
                        try {
                          return (messages || []).filter(m => {
                            return formatDate(m.timestamp) === formatDate(new Date())
                          }).length
                        } catch (error) {
                          console.warn('Error filtering messages by date:', error)
                          return 0
                        }
                      })()}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>AI responses:</span>
                    <Badge variant="secondary" className="text-xs">
                      {(messages || []).filter(m => m.role === 'assistant').length}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4 lg:p-6">
                <div className="space-y-4">
                  {(messages || []).map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        <div
                          className={`text-xs mt-1 opacity-70 ${
                            message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted p-3 rounded-2xl">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Gear size={16} className="text-primary" />
                          </motion.div>
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4 lg:p-6">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about cybersecurity..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isLoading}
                      size="sm"
                      className="px-3"
                    >
                      <PaperPlaneTilt size={16} />
                    </Button>
                  </motion.div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Try asking: "Explain SQL injection" or "Create a network security quiz"
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}