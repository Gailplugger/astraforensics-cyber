import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { formatTime } from '@/lib/utils'
import { 
  PaperPlaneTilt, 
  Robot, 
  User, 
  Brain, 
  Sparkle,
  X,
  Lightning,
  Microphone,
  Image as ImageIcon,
  FileText,
  Lightbulb
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date | string
  category?: 'general' | 'learning' | 'career' | 'technical'
  suggestions?: string[]
}

interface AIChatAssistantProps {
  isOpen: boolean
  onClose: () => void
  userData: any
  context?: string
}

const quickActions = [
  { icon: Brain, label: "Explain Concept", prompt: "Can you explain the concept of " },
  { icon: Lightbulb, label: "Study Tips", prompt: "Give me study tips for " },
  { icon: FileText, label: "Create Quiz", prompt: "Create a quiz about " },
  { icon: Lightning, label: "Career Advice", prompt: "What career path should I consider for " }
]

const aiPersonalities = [
  { name: "Professor Astra", specialty: "Cybersecurity Expert", emoji: "🎓" },
  { name: "Coach Cyber", specialty: "Career Advisor", emoji: "💼" },
  { name: "Tutor Nova", specialty: "Learning Assistant", emoji: "📚" },
  { name: "Mentor Pixel", specialty: "Technical Guide", emoji: "⚡" }
]

export function AIChatAssistant({ isOpen, onClose, userData, context }: AIChatAssistantProps) {
  const [messages, setMessages] = useKV<Message[]>('ai-chat-history', [])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPersonality, setSelectedPersonality] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Ensure messages is always an array
  const messagesList = messages || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messagesList])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const generateAIResponse = async (userMessage: string, messageType: string = 'general') => {
    const personality = aiPersonalities[selectedPersonality]
    const userContext = userData ? `User: ${userData.name}, studying cybersecurity` : 'Anonymous user'
    
    const promptText = `You are ${personality.name}, a ${personality.specialty} for AstraForensics cybersecurity learning platform.

User Context: ${userContext}
Current Learning Context: ${context || 'general'}
Message Type: ${messageType}

User Message: "${userMessage}"

Respond as ${personality.name} would - be helpful, encouraging, and educational. Keep responses concise but informative (2-3 paragraphs max). Include practical advice when relevant.

If the user asks about cybersecurity concepts, provide clear explanations with real-world examples.
If they ask for career advice, give specific, actionable guidance.
If they need study help, suggest effective learning strategies.

Always maintain an encouraging, expert tone that motivates learning.`

    try {
      const response = await window.spark.llm(promptText, 'gpt-4o', false)
      return response.trim()
    } catch (error) {
      console.error('AI response error:', error)
      return `I apologize, but I'm having trouble connecting right now. As ${personality.name}, I'd love to help you with your cybersecurity learning journey. Please try your question again in a moment!`
    }
  }

  const generateSuggestions = async (topic: string) => {
    const promptText = `Based on the cybersecurity topic "${topic}", generate 3 short, actionable follow-up questions a student might ask. Format as a JSON array of strings. Keep each question under 50 characters.`
    
    try {
      const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const parsed = JSON.parse(response)
      return Array.isArray(parsed) ? parsed.slice(0, 3) : []
    } catch {
      return []
    }
  }

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim()
    if (!content || isLoading) return

    setIsLoading(true)
    setInputValue('')
    setShowSuggestions(false)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      category: 'general'
    }

    setMessages(prev => [...(prev || []), userMessage])

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(content)
      const suggestions = await generateSuggestions(content)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        category: 'general',
        suggestions
      }

      setMessages(prev => [...(prev || []), aiMessage])
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInputValue(action.prompt)
    inputRef.current?.focus()
  }

  const clearHistory = () => {
    setMessages([])
    setShowSuggestions(true)
    toast.success('Chat history cleared!')
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-4xl h-[85vh] max-h-[600px] sm:h-[80vh] sm:max-h-[700px] bg-background/95 backdrop-blur-xl rounded-2xl border shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center"
                >
                  <Robot size={20} className="text-white" weight="fill" />
                </motion.div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    AI Learning Assistant
                    <Badge variant="secondary" className="anime-glow">
                      <Sparkle size={12} className="mr-1" />
                      Smart
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Powered by {aiPersonalities[selectedPersonality].name} {aiPersonalities[selectedPersonality].emoji}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* AI Personality Selector */}
            <div className="flex gap-2 mt-3">
              {aiPersonalities.map((personality, index) => (
                <motion.button
                  key={personality.name}
                  onClick={() => setSelectedPersonality(index)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedPersonality === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {personality.emoji} {personality.name}
                </motion.button>
              ))}
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="flex-1 p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messagesList.length === 0 && showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                  >
                    <div className="text-muted-foreground">
                      <Brain size={48} className="mx-auto mb-3 text-primary/50" />
                      <h3 className="text-lg font-semibold mb-2">Welcome to AI Learning Assistant!</h3>
                      <p>Ask me anything about cybersecurity, get study tips, or request career advice.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={action.label}
                          onClick={() => handleQuickAction(action)}
                          className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors text-left"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <action.icon size={20} className="text-primary mb-2" />
                          <div className="text-sm font-medium">{action.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messagesList.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <Robot size={16} className="text-white" weight="fill" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                      <motion.div
                        className={`p-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-secondary/50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </motion.div>
                      
                      {message.suggestions && message.suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-2 space-y-1"
                        >
                          <p className="text-xs text-muted-foreground mb-1">Suggested follow-ups:</p>
                          {message.suggestions.map((suggestion, i) => (
                            <motion.button
                              key={i}
                              onClick={() => sendMessage(suggestion)}
                              className="block w-full text-left text-xs p-2 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              💡 {suggestion}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-white" weight="fill" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <Robot size={16} className="text-white" weight="fill" />
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                        />
                        <span className="text-sm text-muted-foreground">
                          {aiPersonalities[selectedPersonality].name} is thinking...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4 bg-card/50">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Ask anything about cybersecurity..."
                    className="pr-12"
                    disabled={isLoading}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled
                    >
                      <Microphone size={14} className="text-muted-foreground" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled
                    >
                      <ImageIcon size={14} className="text-muted-foreground" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <PaperPlaneTilt size={16} weight="fill" />
                </Button>
              </div>
              
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {quickActions.map((action, index) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    className="flex-shrink-0 text-xs"
                    disabled={isLoading}
                  >
                    <action.icon size={12} className="mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}