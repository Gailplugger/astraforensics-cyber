import { useState } from 'react'
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
    
    if (!phone.trim() || !/^\+?[\d\s-()]{10,}$/.test(phone)) {
      toast.error('Please enter a valid phone number')
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
      toast.success('Registration successful! Welcome to AstraForensics')
      onRegistrationComplete(userData)
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield size={32} className="text-primary" weight="bold" />
            <h1 className="text-3xl font-bold text-foreground">AstraForensics</h1>
          </div>
          <p className="text-muted-foreground">
            Join our cybersecurity learning platform
          </p>
        </div>

        {/* Registration Form */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Create Your Account</CardTitle>
            <CardDescription>
              Enter your details to start your cybersecurity journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class" className="text-sm font-medium">
                  Class/Grade
                </Label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="class"
                    type="text"
                    placeholder="e.g., 12th Grade, Bachelor's, etc."
                    value={formData.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Envelope size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Join AstraForensics'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          Made by{' '}
          <span className="font-semibold text-primary">AstraForensics</span>
        </div>
      </div>
    </div>
  )
}