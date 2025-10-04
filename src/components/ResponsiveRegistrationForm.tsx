import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { Shield, User, Envelope, Phone, GraduationCap } from '@phosphor-icons/react'

interface UserData {
  name: string
  class: string
  email: string
  phone: string
  registeredAt: string
}

interface RegistrationFormProps {
  onRegistrationComplete: (userData: UserData) => void
}

export function RegistrationForm({ onRegistrationComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [, setUserData] = useKV<UserData | null>('user-data', null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const { name, class: userClass, email, phone } = formData
    
    if (!name.trim()) {
      toast.error('Please enter your full name')
      return false
    }
    
    if (!userClass.trim()) {
      toast.error('Please enter your class/grade')
      return false
    }
    
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    
    if (!phone.trim()) {
      toast.error('Please enter your phone number')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const userData: UserData = {
        ...formData,
        registeredAt: new Date().toISOString()
      }
      
      await setUserData(userData)
      toast.success('Registration successful! Welcome to AstraForensics! 🎉')
      onRegistrationComplete(userData)
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Responsive Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield size={28} className="text-primary sm:w-8 sm:h-8" weight="bold" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AstraForensics
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Join our AI-powered cybersecurity learning platform
          </p>
        </motion.div>

        {/* Mobile-Optimized Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="card-hover border-2 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl font-semibold flex items-center space-x-2">
                <span>Create Your Account</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              </CardTitle>
              <CardDescription className="text-sm">
                Enter your details to start your cybersecurity journey
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3.5 text-muted-foreground sm:w-4 sm:h-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      disabled={isSubmitting}
                      autoComplete="name"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label htmlFor="class" className="text-sm font-medium">
                    Class/Grade/Level
                  </Label>
                  <div className="relative">
                    <GraduationCap size={16} className="absolute left-3 top-3.5 text-muted-foreground sm:w-4 sm:h-4" />
                    <Input
                      id="class"
                      type="text"
                      placeholder="e.g., Grade 12, Bachelor's, Professional"
                      value={formData.class}
                      onChange={(e) => handleInputChange('class', e.target.value)}
                      className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      disabled={isSubmitting}
                      autoComplete="organization-title"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Envelope size={16} className="absolute left-3 top-3.5 text-muted-foreground sm:w-4 sm:h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2"
                >
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-muted-foreground sm:w-4 sm:h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      disabled={isSubmitting}
                      autoComplete="tel"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-11 mt-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="anime-spinner rounded-full h-4 w-4 border-2 border-transparent border-t-current"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Shield size={16} />
                        <span>Start Learning Cybersecurity</span>
                        <span>🚀</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mobile-friendly footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-xs sm:text-sm text-muted-foreground space-y-2"
        >
          <p>By registering, you agree to our learning platform terms</p>
          <div className="flex items-center justify-center space-x-2">
            <span>🔒</span>
            <span>Your data is secure and protected</span>
          </div>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <span>Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ❤️
            </motion.span>
            <span>by</span>
            <motion.span 
              className="font-semibold text-primary"
              whileHover={{ scale: 1.05 }}
            >
              AstraForensics
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}