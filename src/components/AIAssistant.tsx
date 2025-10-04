import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Robot, 
  ChatCircle, 
  PaperPlaneRight, 
  Brain, 
  Lightbulb,
  Sparkle,
  User,
  X,
  MagicWand,
  BookOpen,
  Question
} from '@phosphor-icons/react'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  type?: 'text' | 'recommendation' | 'quiz-help' | 'explanation'
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  userData?: any
  currentModule?: string
  context?: string
}

export function AIAssistant({ isOpen, onClose, userData, currentModule, context }: AIAssistantProps) {
  const [messages, setMessages] = useKV<ChatMessage[]>('ai-chat-history', [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateResponse = async (userMessage: string) => {
    try {
      const contextInfo = `
        User: ${userData?.name || 'Student'}
        Current Module: ${currentModule || 'None'}
        Context: ${context || 'Dashboard'}
        Previous conversation: ${(messages || []).slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}
      `

      const prompt = (window as any).spark.llmPrompt`You are AstraCyber, an advanced AI cybersecurity tutor and assistant for the AstraForensics learning platform. You are helpful, encouraging, and expert in cybersecurity education.

      Context: ${contextInfo}
      
      User Question: ${userMessage}

      Provide a helpful, educational response that:
      1. Answers their question clearly and accurately
      2. Relates to cybersecurity education when relevant
      3. Encourages learning and growth
      4. Uses emojis appropriately (🚀, 🔒, ⚡, 🎯, etc.)
      5. Keeps responses concise but informative
      6. Suggests next steps or related topics when helpful

      If they ask about specific cybersecurity topics, provide detailed explanations with practical examples.
      If they need help with quizzes, guide them to think through the concepts rather than giving direct answers.
      If they ask for learning recommendations, suggest specific modules or topics based on their progress.`

      const response = await (window as any).spark.llm(prompt)
      return response
    } catch (error) {
      console.error('AI response error:', error)
      return "I apologize, but I'm having trouble connecting right now. Please try again in a moment! 🤖✨"
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...(prev || []), userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await generateResponse(input.trim())
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...(prev || []), assistantMessage])
    } catch (error) {
      toast.error('Failed to get AI response')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "What is the CIA triad in cybersecurity?",
    "How do firewalls protect networks?",
    "What's the difference between malware and viruses?",
    "Explain social engineering attacks",
    "How do I analyze network traffic?",
    "What are the phases of incident response?"
  ]

  const clearChat = () => {
    setMessages([])
    toast.success('Chat history cleared!')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-4xl h-[85vh] max-h-[600px] sm:h-[80vh] sm:max-h-[700px] flex flex-col"
          >
            <Card className="flex-1 flex flex-col relative overflow-hidden">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
                animate={{ 
                  background: [
                    'linear-gradient(45deg, var(--primary)/5, transparent, var(--accent)/5)',
                    'linear-gradient(135deg, var(--accent)/5, transparent, var(--primary)/5)',
                    'linear-gradient(45deg, var(--primary)/5, transparent, var(--accent)/5)'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              <CardHeader className="border-b relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Robot size={28} className="text-primary" weight="fill" />
                    </motion.div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span className="gradient-text">AstraCyber AI Assistant</span>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          ✨ Powered by AI
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Your personal cybersecurity learning companion
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Clear Chat
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 relative z-10">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {(messages || []).length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Brain size={48} className="text-primary mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-lg font-semibold mb-2">Welcome to AstraCyber! 🚀</h3>
                      <p className="text-muted-foreground mb-6">
                        I'm here to help you master cybersecurity concepts. Ask me anything!
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
                        {quickQuestions.map((question, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-left h-auto p-3 w-full hover:bg-primary/5"
                              onClick={() => setInput(question)}
                            >
                              <Question size={16} className="mr-2 flex-shrink-0" />
                              <span className="text-xs">{question}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {(messages || []).map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User size={16} />
                          ) : (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                              <Robot size={16} />
                            </motion.div>
                          )}
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground border'
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Robot size={16} />
                          </motion.div>
                        </div>
                        <div className="bg-secondary rounded-lg p-3 border">
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-muted-foreground rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ 
                                  duration: 1, 
                                  repeat: Infinity, 
                                  delay: i * 0.2 
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Ask me anything about cybersecurity... 🔒"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="min-h-[60px] resize-none"
                        disabled={isLoading}
                      />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoading}
                        size="lg"
                        className="h-[60px] relative overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="relative">
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkle size={20} />
                            </motion.div>
                          ) : (
                            <PaperPlaneRight size={20} />
                          )}
                        </span>
                      </Button>
                    </motion.div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    💡 Tip: Ask about specific cybersecurity topics, request explanations, or get quiz help!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}