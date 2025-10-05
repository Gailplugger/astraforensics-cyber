import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  User,
  Camera,
  FloppyDisk as Save,
  X,
  Upload,
  UserCircle,
  EnvelopeSimple as Mail,
  Phone,
  GraduationCap,
  Calendar,
  Shield,
  Trophy,
  Target
} from '@phosphor-icons/react'

interface UserProfile {
  name: string
  username: string
  email: string
  phone: string
  class: string
  registeredAt: string
  profilePicture?: string
  bio?: string
  achievements?: string[]
  totalScore?: number
  completedModules?: number
}

interface ProfileSettingsProps {
  isOpen: boolean
  onClose: () => void
  userData: UserProfile
  onUpdate: (updatedData: UserProfile) => void
}

export function ProfileSettings({ isOpen, onClose, userData, onUpdate }: ProfileSettingsProps) {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userData || {
    name: '',
    username: '',
    email: '',
    phone: '',
    class: '',
    registeredAt: new Date().toISOString()
  })
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [certificates] = useKV<any[]>('user-certificates', [])
  const [moduleProgress] = useKV<any[]>('module-progress', [])

  // Update profile when userData changes
  useEffect(() => {
    if (userData) {
      setEditedProfile(userData)
    }
  }, [userData])

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target?.result as string
        setEditedProfile(prev => ({
          ...prev,
          profilePicture: base64String
        }))
        setIsUploading(false)
        toast.success('Profile picture uploaded!')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setIsUploading(false)
      toast.error('Failed to upload image')
    }
  }

  const handleSave = async () => {
    if (!editedProfile.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (!editedProfile.username.trim()) {
      toast.error('Username is required')
      return
    }

    if (editedProfile.username.length < 3) {
      toast.error('Username must be at least 3 characters')
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onUpdate(editedProfile)
      toast.success('Profile updated successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const generateAvatar = (name: string) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=3B82F6&textColor=ffffff`
  }

  const getProfileStats = () => {
    const completedModules = moduleProgress?.filter(p => p.completed)?.length || 0
    const totalCertificates = certificates?.length || 0
    const averageScore = (moduleProgress && moduleProgress.length > 0)
      ? Math.round(moduleProgress.reduce((sum, p) => sum + (p.quizScore || 0), 0) / moduleProgress.length)
      : 0

    return { completedModules, totalCertificates, averageScore }
  }

  const stats = getProfileStats()

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <User size={20} className="text-primary" />
                <span>Profile Settings</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Profile Picture Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="relative inline-block">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar className="w-32 h-32 border-4 border-primary/20">
                      <AvatarImage 
                        src={editedProfile.profilePicture || generateAvatar(editedProfile.name)}
                        alt={editedProfile.name}
                      />
                      <AvatarFallback className="text-2xl">
                        {editedProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    {isUploading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Camera size={20} />
                      </motion.div>
                    ) : (
                      <Camera size={20} />
                    )}
                  </motion.button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{editedProfile.name}</h3>
                  <p className="text-muted-foreground">@{editedProfile.username || 'username'}</p>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="text-center p-4">
                    <div className="space-y-2">
                      <Trophy size={24} className="mx-auto text-yellow-600" />
                      <div className="text-2xl font-bold">{stats.totalCertificates}</div>
                      <div className="text-sm text-muted-foreground">Certificates</div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="text-center p-4">
                    <div className="space-y-2">
                      <GraduationCap size={24} className="mx-auto text-blue-600" />
                      <div className="text-2xl font-bold">{stats.completedModules}</div>
                      <div className="text-sm text-muted-foreground">Modules</div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="text-center p-4">
                    <div className="space-y-2">
                      <Target size={24} className="mx-auto text-green-600" />
                      <div className="text-2xl font-bold">{stats.averageScore}%</div>
                      <div className="text-sm text-muted-foreground">Avg Score</div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <UserCircle size={16} />
                    <span>Full Name</span>
                  </Label>
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="username" className="flex items-center space-x-2">
                    <User size={16} />
                    <span>Username</span>
                  </Label>
                  <Input
                    id="username"
                    value={editedProfile.username}
                    onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="Enter a unique username"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail size={16} />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone size={16} />
                    <span>Phone</span>
                  </Label>
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <Label htmlFor="class" className="flex items-center space-x-2">
                    <GraduationCap size={16} />
                    <span>Class/Organization</span>
                  </Label>
                  <Input
                    id="class"
                    value={editedProfile.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    placeholder="Enter your class or organization"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2"
                >
                  <Label className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>Member Since</span>
                  </Label>
                  <Input
                    value={new Date(editedProfile.registeredAt).toLocaleDateString()}
                    disabled
                    className="bg-muted"
                  />
                </motion.div>
              </div>

              {/* Bio Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="space-y-2"
              >
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={editedProfile.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-input rounded-md resize-none h-20 text-sm"
                  maxLength={200}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {(editedProfile.bio || '').length}/200
                </div>
              </motion.div>

              {/* Achievements */}
              {certificates && certificates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-2"
                >
                  <Label className="flex items-center space-x-2">
                    <Shield size={16} />
                    <span>Recent Achievements</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {certificates.slice(0, 3).map((cert, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        🏆 {cert.courseName || cert.moduleName}
                      </Badge>
                    ))}
                    {certificates.length > 3 && (
                      <Badge variant="outline">
                        +{certificates.length - 3} more
                      </Badge>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex gap-3 pt-4 border-t"
              >
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                  disabled={isSaving}
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
                
                <Button
                  onClick={handleSave}
                  disabled={isSaving || isUploading}
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                >
                  {isSaving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Save size={16} />
                    </motion.div>
                  ) : (
                    <Save size={16} className="mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </motion.div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}