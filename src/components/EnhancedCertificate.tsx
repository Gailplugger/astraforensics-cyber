import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { 
  Certificate, 
  Download, 
  Share, 
  Trophy, 
  Star,
  ShieldCheck,
  Medal,
  Printer,
  Eye,
  X
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'

interface CertificateData {
  id: string
  studentName: string
  courseName: string
  completionDate: Date
  score: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+'
  moduleId: string
  skills: string[]
  duration: string
  certificateType: 'completion' | 'achievement' | 'mastery'
}

interface EnhancedCertificateProps {
  isOpen: boolean
  onClose: () => void
  certificateData: CertificateData
  userData?: any
}

const certificateGradients = {
  'A+': 'from-yellow-400 via-yellow-500 to-yellow-600',
  'A': 'from-blue-400 via-blue-500 to-blue-600',
  'B+': 'from-green-400 via-green-500 to-green-600',
  'B': 'from-purple-400 via-purple-500 to-purple-600',
  'C+': 'from-gray-400 via-gray-500 to-gray-600'
}

const certificateTypes = {
  completion: { icon: Certificate, label: 'Certificate of Completion', color: 'blue' },
  achievement: { icon: Trophy, label: 'Achievement Certificate', color: 'yellow' },
  mastery: { icon: Medal, label: 'Mastery Certificate', color: 'purple' }
}

export function EnhancedCertificate({ isOpen, onClose, certificateData, userData }: EnhancedCertificateProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'download'>('preview')
  const certificateRef = useRef<HTMLDivElement>(null)
  const [certificates, setCertificates] = useKV<CertificateData[]>('user-certificates', [])

  const downloadCertificate = async () => {
    if (!certificateRef.current) return

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(certificateRef.current, {
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: 800
      })

      const link = document.createElement('a')
      link.download = `AstraForensics-Certificate-${certificateData.courseName.replace(/\s+/g, '-')}-${certificateData.studentName.replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Save certificate to user's collection
      setCertificates(prev => {
        const currentList = prev || []
        const existing = currentList.find(cert => cert.id === certificateData.id)
        if (existing) return currentList
        return [...currentList, certificateData]
      })

      toast.success('Certificate downloaded successfully!')
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast.error('Failed to download certificate. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const shareCertificate = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${certificateData.courseName} Certificate`,
          text: `I just completed ${certificateData.courseName} on AstraForensics with a score of ${certificateData.score}%!`,
          url: window.location.href
        })
      } else {
        // Fallback to copying link
        await navigator.clipboard.writeText(
          `I just earned my ${certificateData.courseName} certificate on AstraForensics with a score of ${certificateData.score}%! 🎓 #Cybersecurity #AstraForensics`
        )
        toast.success('Certificate text copied to clipboard!')
      }
    } catch (error) {
      toast.error('Failed to share certificate')
    }
  }

  const printCertificate = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow && certificateRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>AstraForensics Certificate</title>
            <style>
              body { margin: 0; padding: 20px; }
              @media print {
                body { margin: 0; padding: 0; }
                .certificate { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            ${certificateRef.current.outerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (!isOpen) return null

  const TypeIcon = certificateTypes[certificateData.certificateType].icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] max-h-[600px] sm:h-[90vh] sm:max-h-[700px] p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <TypeIcon size={20} className="text-white" weight="fill" />
              </div>
              <div>
                <DialogTitle className="text-xl">Professional Certificate</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {certificateTypes[certificateData.certificateType].label}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'preview' ? 'download' : 'preview')}
              >
                <Eye size={16} className="mr-2" />
                {viewMode === 'preview' ? 'Download View' : 'Preview'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-center">
            {/* Certificate Design */}
            <motion.div
              ref={certificateRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                w-[1200px] h-[800px] relative bg-white rounded-2xl shadow-2xl overflow-hidden
                ${viewMode === 'download' ? 'print-optimized' : ''}
              `}
              style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
                border: '8px solid #1e293b'
              }}
            >
              {/* Decorative Border */}
              <div className="absolute inset-4 border-4 border-double border-slate-400 rounded-xl">
                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 w-16 h-16 opacity-20">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-full"></div>
                </div>
                <div className="absolute top-4 right-4 w-16 h-16 opacity-20">
                  <div className="w-full h-full bg-gradient-to-bl from-accent to-primary rounded-full"></div>
                </div>
                <div className="absolute bottom-4 left-4 w-16 h-16 opacity-20">
                  <div className="w-full h-full bg-gradient-to-tr from-primary to-accent rounded-full"></div>
                </div>
                <div className="absolute bottom-4 right-4 w-16 h-16 opacity-20">
                  <div className="w-full h-full bg-gradient-to-tl from-accent to-primary rounded-full"></div>
                </div>

                {/* Header */}
                <div className="text-center pt-12 pb-6">
                  {/* Logo Area */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <ShieldCheck size={32} className="text-white" weight="fill" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-slate-800">AstraForensics</h1>
                      <p className="text-lg text-slate-600">Cybersecurity Learning Platform</p>
                    </div>
                  </div>

                  {/* Certificate Type */}
                  <div className="mb-4">
                    <div className={`inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r ${certificateGradients[certificateData.grade]} text-white rounded-full`}>
                      <TypeIcon size={20} weight="fill" />
                      <span className="font-semibold text-lg">
                        {certificateTypes[certificateData.certificateType].label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="text-center px-16 pb-8">
                  <p className="text-xl text-slate-600 mb-6">This is to certify that</p>
                  
                  <h2 className="text-5xl font-bold text-slate-800 mb-8 border-b-2 border-slate-300 pb-4 inline-block">
                    {certificateData.studentName}
                  </h2>
                  
                  <p className="text-xl text-slate-600 mb-4">has successfully completed</p>
                  
                  <h3 className="text-3xl font-semibold text-primary mb-6">
                    {certificateData.courseName}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-8 my-8 px-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{certificateData.score}%</div>
                      <div className="text-sm text-slate-600">Final Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{certificateData.grade}</div>
                      <div className="text-sm text-slate-600">Grade Achieved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{certificateData.duration}</div>
                      <div className="text-sm text-slate-600">Course Duration</div>
                    </div>
                  </div>

                  {/* Skills Earned */}
                  <div className="mb-8">
                    <p className="text-lg text-slate-600 mb-3">Skills Demonstrated:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {certificateData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-16 left-0 right-0 px-16">
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="w-48 border-t border-slate-400 mb-2"></div>
                      <p className="text-sm text-slate-600">Certificate Date</p>
                      <p className="font-medium text-slate-800">
                        {certificateData.completionDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-2">
                        <Medal size={32} className="text-white" weight="fill" />
                      </div>
                      <p className="text-xs text-slate-500">Verified Certificate</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-48 border-t border-slate-400 mb-2"></div>
                      <p className="text-sm text-slate-600">Certificate ID</p>
                      <p className="font-medium text-slate-800 font-mono text-xs">
                        AF-{certificateData.id.toUpperCase().slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Watermark */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <p className="text-xs text-slate-400">
                    © 2024 AstraForensics - Advanced Cybersecurity Learning Platform
                  </p>
                </div>

                {/* Achievement Stars */}
                {certificateData.score >= 90 && (
                  <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                    <div className="flex flex-col gap-2">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.2 }}
                        >
                          <Star size={24} className="text-yellow-400" weight="fill" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QR Code Placeholder */}
                <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                  <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center">
                    <div className="text-xs text-slate-500 text-center">
                      QR Code<br />Verification
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t p-6 bg-card/50">
          <div className="flex justify-center gap-4">
            <Button
              onClick={downloadCertificate}
              disabled={isDownloading}
              className="bg-gradient-to-r from-primary to-accent text-white"
            >
              <Download size={16} className="mr-2" />
              {isDownloading ? 'Downloading...' : 'Download PNG'}
            </Button>
            
            <Button
              variant="outline"
              onClick={printCertificate}
            >
              <Printer size={16} className="mr-2" />
              Print
            </Button>
            
            <Button
              variant="outline"
              onClick={shareCertificate}
            >
              <Share size={16} className="mr-2" />
              Share
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Your certificate will be saved to your profile automatically
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}