import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Certificate, 
  Download, 
  Share,
  Calendar,
  User,
  Medal,
  Star,
  Sparkle,
  CheckCircle
} from '@phosphor-icons/react'

interface CertificateData {
  id: string
  studentName: string
  courseName: string
  completionDate: string
  score: number
  modules: string[]
  certificateNumber: string
  issueDate: string
}

interface ProfessionalCertificateProps {
  certificateData: CertificateData
  onDownload?: () => void
  onShare?: () => void
}

export function ProfessionalCertificate({ certificateData, onDownload, onShare }: ProfessionalCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      // Simulate certificate generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create download link
      const element = certificateRef.current
      if (element) {
        // In a real app, you'd use html2canvas or similar
        toast.success('Certificate downloaded successfully!')
        onDownload?.()
      }
    } catch (error) {
      toast.error('Failed to download certificate')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = () => {
    const shareText = `🎉 I just earned my ${certificateData.courseName} certification from AstraForensics! Score: ${certificateData.score}% 🚀 #CybersecurityEducation #AstraForensics`
    
    if (navigator.share) {
      navigator.share({
        title: 'AstraForensics Certificate',
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success('Certificate info copied to clipboard!')
    }
    onShare?.()
  }

  return (
    <div className="space-y-6">
      {/* Certificate Display */}
      <motion.div
        ref={certificateRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-4 border-yellow-300 shadow-2xl">
          {/* Decorative border pattern */}
          <div className="absolute inset-0 p-4">
            <div className="w-full h-full border-4 border-double border-yellow-400/30 rounded-lg"></div>
          </div>
          
          {/* Background pattern */}
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{ duration: 20, repeat: Infinity }}
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 2px, transparent 2px), radial-gradient(circle at 80% 50%, #6366f1 2px, transparent 2px)',
              backgroundSize: '40px 40px'
            }}
          />

          <CardContent className="p-12 text-center relative z-10">
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-4 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Certificate size={48} className="text-yellow-600" weight="fill" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    CERTIFICATE OF COMPLETION
                  </h1>
                  <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
                </div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Medal size={48} className="text-yellow-600" weight="fill" />
                </motion.div>
              </div>
              
              <p className="text-xl text-gray-600 font-semibold">
                AstraForensics Cybersecurity Learning Platform
              </p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <p className="text-lg text-gray-600 mb-4">This is to certify that</p>
                <motion.h2
                  className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  {certificateData.studentName}
                </motion.h2>
                <p className="text-lg text-gray-600">has successfully completed the course</p>
              </div>

              <motion.div
                className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {certificateData.courseName}
                </h3>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Score: {certificateData.score}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-blue-600" />
                    <span>Completed: {new Date(certificateData.completionDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>

              {/* Modules completed */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">Modules Completed:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {certificateData.modules.map((module, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Star size={12} className="mr-1" />
                        {module}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-8 border-t-2 border-gray-200">
                <div className="text-left">
                  <div className="w-32 h-px bg-gray-400 mb-2"></div>
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="text-sm font-semibold">{new Date(certificateData.issueDate).toLocaleDateString()}</p>
                </div>
                
                <motion.div
                  className="text-center"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2 mx-auto border-4 border-yellow-300">
                    <Sparkle size={32} className="text-white" weight="fill" />
                  </div>
                  <p className="text-xs text-gray-600">Official Seal</p>
                </motion.div>

                <div className="text-right">
                  <div className="w-32 h-px bg-gray-400 mb-2 ml-auto"></div>
                  <p className="text-sm text-gray-600">Certificate No.</p>
                  <p className="text-sm font-semibold">{certificateData.certificateNumber}</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute top-4 left-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Star size={24} className="text-yellow-400" weight="fill" />
            </motion.div>
            <motion.div
              className="absolute top-4 right-4"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Star size={20} className="text-blue-400" weight="fill" />
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <Sparkle size={16} className="text-purple-400" weight="fill" />
            </motion.div>
            <motion.div
              className="absolute bottom-4 right-4"
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <Sparkle size={18} className="text-green-400" weight="fill" />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center justify-center space-x-4"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkle size={20} />
              </motion.div>
            ) : (
              <Download size={20} />
            )}
            <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Share size={20} />
            <span>Share Achievement</span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}