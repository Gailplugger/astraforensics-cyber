import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { 
  Medal, 
  Download, 
  ShareNetwork, 
  Trophy,
  Star,
  Sparkle,
  X
} from '@phosphor-icons/react'
import certificateTemplate from '@/assets/images/certificate-template.svg'

interface Certificate {
  id: string
  moduleId: string
  moduleName: string
  studentName: string
  completedAt: string
  score: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C'
}

interface CertificateModalProps {
  certificate: Certificate
  isOpen: boolean
  onClose: () => void
}

interface CertificateGalleryProps {
  userData: { name: string }
}

function CertificateModal({ certificate, isOpen, onClose }: CertificateModalProps) {
  const handleDownload = () => {
    // Create a downloadable certificate
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    // Certificate background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, '#FEF3C7')
    gradient.addColorStop(1, '#FBBF24')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // Border
    ctx.strokeStyle = '#D97706'
    ctx.lineWidth = 4
    ctx.strokeRect(20, 20, 760, 560)

    // Inner border
    ctx.strokeStyle = '#D97706'
    ctx.lineWidth = 2
    ctx.setLineDash([10, 10])
    ctx.strokeRect(40, 40, 720, 520)
    ctx.setLineDash([])

    // Title
    ctx.fillStyle = '#92400E'
    ctx.font = 'bold 48px serif'
    ctx.textAlign = 'center'
    ctx.fillText('CERTIFICATE', 400, 120)

    ctx.font = '32px serif'
    ctx.fillText('of Achievement', 400, 160)

    // Content
    ctx.font = '24px sans-serif'
    ctx.fillStyle = '#451A03'
    ctx.fillText('This certifies that', 400, 220)

    ctx.font = 'bold 36px sans-serif'
    ctx.fillStyle = '#92400E'
    ctx.fillText(certificate.studentName, 400, 270)

    ctx.font = '24px sans-serif'
    ctx.fillStyle = '#451A03'
    ctx.fillText('has successfully completed', 400, 320)

    ctx.font = 'bold 28px sans-serif'
    ctx.fillStyle = '#B45309'
    ctx.fillText(certificate.moduleName, 400, 370)

    ctx.font = '20px sans-serif'
    ctx.fillText(`Score: ${certificate.score}% (Grade: ${certificate.grade})`, 400, 420)

    // Date and signature
    ctx.font = '18px sans-serif'
    ctx.fillStyle = '#92400E'
    ctx.textAlign = 'left'
    ctx.fillText(`Date: ${new Date(certificate.completedAt).toLocaleDateString()}`, 100, 500)
    
    ctx.textAlign = 'right'
    ctx.fillText('AstraForensics Learning Platform', 700, 500)

    // Download
    const link = document.createElement('a')
    link.download = `${certificate.moduleName}-certificate.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate - ${certificate.moduleName}`,
          text: `I just completed ${certificate.moduleName} on AstraForensics with a score of ${certificate.score}%!`,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback - copy to clipboard
      await navigator.clipboard.writeText(
        `I just completed ${certificate.moduleName} on AstraForensics with a score of ${certificate.score}%! 🎓✨`
      )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Medal size={24} className="text-yellow-600" weight="fill" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-foreground">Certificate of Achievement</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Certificate Preview */}
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-8 rounded-lg border-4 border-amber-300 shadow-lg">
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="flex justify-center"
                    >
                      <div className="bg-red-600 rounded-full p-4">
                        <Trophy size={32} className="text-yellow-300" weight="fill" />
                      </div>
                    </motion.div>

                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-3xl font-bold text-amber-900"
                    >
                      CERTIFICATE
                    </motion.h3>
                    
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-lg text-amber-800"
                    >
                      of Achievement
                    </motion.p>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="space-y-2"
                    >
                      <p className="text-sm text-amber-700">This certifies that</p>
                      <p className="text-xl font-bold text-amber-900">{certificate.studentName}</p>
                      <p className="text-sm text-amber-700">has successfully completed</p>
                      <p className="text-lg font-semibold text-amber-800">{certificate.moduleName}</p>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="flex justify-between items-center pt-4 border-t border-amber-300"
                    >
                      <div className="text-left">
                        <p className="text-xs text-amber-700">Date</p>
                        <p className="text-sm font-medium text-amber-800">
                          {new Date(certificate.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Score: {certificate.score}%
                        </Badge>
                        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                          Grade: {certificate.grade}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-amber-700">Issued by</p>
                        <p className="text-sm font-medium text-amber-800">AstraForensics</p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Sparkle animations */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkle size={24} className="text-yellow-500" weight="fill" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.3, 1] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.5
                  }}
                  className="absolute -bottom-2 -left-2"
                >
                  <Star size={20} className="text-amber-500" weight="fill" />
                </motion.div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={handleDownload} className="flex-1">
                  <Download size={18} className="mr-2" />
                  Download Certificate
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <ShareNetwork size={18} className="mr-2" />
                  Share Achievement
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function CertificateGallery({ userData }: CertificateGalleryProps) {
  const [certificates] = useKV<Certificate[]>('certificates', [])
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  if (!certificates || certificates.length === 0) {
    return (
      <Card className="p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Medal size={48} className="mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No Certificates Yet</h3>
          <p className="text-muted-foreground">
            Complete learning modules and pass quizzes to earn your first certificate!
          </p>
        </motion.div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Trophy size={24} className="text-yellow-600" weight="fill" />
        <h2 className="text-2xl font-bold text-foreground">My Certificates</h2>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          {certificates.length} Earned
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate, index) => (
          <motion.div
            key={certificate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="cursor-pointer"
            onClick={() => setSelectedCertificate(certificate)}
          >
            <Card className="card-hover border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Medal size={32} className="mx-auto text-yellow-600" weight="fill" />
                  </motion.div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground">{certificate.moduleName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Completed {new Date(certificate.completedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {certificate.score}%
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Grade {certificate.grade}
                    </Badge>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="pt-2"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      View Certificate
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          isOpen={!!selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  )
}