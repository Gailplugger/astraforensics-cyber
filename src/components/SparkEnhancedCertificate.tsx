import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Dialog, DialogContent } from './ui/dialog'
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
  X,
  Sparkle,
  Lightning,
  Crown,
  TrendUp,
  Clock
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

interface SparkEnhancedCertificateProps {
  isOpen: boolean
  onClose: () => void
  certificateData: CertificateData
  userData?: any
}

const certificateGradients = {
  'A+': 'var(--gradient-cert-platinum)',
  'A': 'var(--gradient-cert-gold)',
  'B+': 'from-emerald-400 via-emerald-500 to-emerald-600',
  'B': 'from-blue-400 via-blue-500 to-blue-600',
  'C+': 'from-slate-400 via-slate-500 to-slate-600'
}

const certificateTypes = {
  completion: { 
    icon: Certificate, 
    label: 'Certificate of Completion', 
    color: 'blue',
    sparkColor: 'var(--spark-electric)'
  },
  achievement: { 
    icon: Trophy, 
    label: 'Achievement Certificate', 
    color: 'yellow',
    sparkColor: 'var(--spark-energy)'
  },
  mastery: { 
    icon: Crown, 
    label: 'Mastery Certificate', 
    color: 'purple',
    sparkColor: 'var(--spark-plasma)'
  }
}

const SparkParticle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full"
    style={{ 
      background: `linear-gradient(45deg, var(--spark-electric), var(--spark-neon))`,
      boxShadow: '0 0 4px var(--spark-electric)'
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      x: [0, Math.random() * 200 - 100],
      y: [0, Math.random() * 200 - 100]
    }}
    transition={{ 
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 3
    }}
  />
)

export function SparkEnhancedCertificate({ isOpen, onClose, certificateData, userData }: SparkEnhancedCertificateProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'download'>('preview')
  const [showSparkles, setShowSparkles] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setShowSparkles(true)
      const timer = setTimeout(() => setShowSparkles(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const downloadCertificate = async () => {
    if (!certificateRef.current) return

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(certificateRef.current, {
        useCORS: true,
        allowTaint: true,
        width: 1400,
        height: 900
      })

      const link = document.createElement('a')
      link.download = `AstraForensics-Certificate-${certificateData?.courseName?.replace(/\s+/g, '-') || 'Course'}-${certificateData?.studentName?.replace(/\s+/g, '-') || 'Student'}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Certificate downloaded successfully!', {
        description: 'Your certificate has been saved in high quality'
      })
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
          title: `${certificateData?.courseName || 'Course'} Certificate - AstraForensics`,
          text: `🎓 I just completed ${certificateData?.courseName || 'a course'} on AstraForensics with a score of ${certificateData?.score || 0}%! #Cybersecurity #AstraForensics #Achievement`,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(
          `🎓 I just earned my ${certificateData?.courseName || 'course'} certificate on AstraForensics with a score of ${certificateData?.score || 0}%! ⚡ #Cybersecurity #AstraForensics #Achievement`
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
      const printContent = certificateRef.current.outerHTML
      printWindow.document.write(`
        <html>
          <head>
            <title>AstraForensics Certificate - ${certificateData?.courseName}</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                background: white;
                font-family: 'Inter', sans-serif;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .certificate { 
                  page-break-inside: avoid; 
                  width: 100%;
                  height: 100vh;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (!isOpen || !certificateData) return null

  const TypeIcon = certificateTypes[certificateData.certificateType || 'completion'].icon
  const isPlatinum = certificateData.grade === 'A+'
  const isGold = certificateData.grade === 'A'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-background via-card to-background">
        {/* Spark Particles Background */}
        <AnimatePresence>
          {showSparkles && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
              {[...Array(20)].map((_, i) => (
                <SparkParticle key={i} delay={i * 0.1} />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div 
          className="p-6 border-b bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="cyber-grid absolute inset-0 opacity-30"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 rounded-full flex items-center justify-center spark-glow"
                style={{ background: certificateTypes[certificateData.certificateType || 'completion'].sparkColor }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 300 }}
              >
                <TypeIcon size={24} className="text-white" weight="fill" />
              </motion.div>
              <div>
                <motion.h2 
                  className="text-2xl font-bold gradient-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Professional Certificate
                </motion.h2>
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {certificateTypes[certificateData.certificateType || 'completion'].label}
                </motion.p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'preview' ? 'download' : 'preview')}
                className="spark-button"
              >
                <Eye size={16} className="mr-2" />
                {viewMode === 'preview' ? 'Download View' : 'Preview'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Certificate Content */}
        <div className="flex-1 p-6 overflow-auto custom-scrollbar">
          <div className="flex justify-center">
            <motion.div
              ref={certificateRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
              className="relative"
              style={{ 
                width: '1400px', 
                height: '900px',
                minWidth: '1400px',
                minHeight: '900px'
              }}
            >
              {/* Main Certificate */}
              <div
                className="w-full h-full relative rounded-3xl shadow-2xl overflow-hidden"
                style={{ 
                  background: isPlatinum 
                    ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%, #f8fafc 100%)'
                    : isGold
                    ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 25%, #fde68a 50%, #fef3c7 75%, #fffbeb 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
                }}
              >
                {/* Decorative Border */}
                <div className="absolute inset-6 border-4 border-double rounded-2xl"
                     style={{ 
                       borderColor: isPlatinum ? '#94a3b8' : isGold ? '#d97706' : '#64748b'
                     }}>
                  
                  {/* Animated Corner Decorations */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-20 h-20 rounded-full spark-float-${(i % 3) + 1}`}
                      style={{
                        background: certificateTypes[certificateData.certificateType].sparkColor,
                        opacity: 0.2,
                        top: i < 2 ? '1rem' : 'auto',
                        bottom: i >= 2 ? '1rem' : 'auto',
                        left: i % 2 === 0 ? '1rem' : 'auto',
                        right: i % 2 === 1 ? '1rem' : 'auto',
                      }}
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ 
                        duration: 2, 
                        delay: i * 0.2,
                        rotate: { repeat: Infinity, duration: 10, ease: "linear" }
                      }}
                    />
                  ))}

                  {/* Header Section */}
                  <div className="text-center pt-16 pb-8">
                    {/* Logo and Title */}
                    <motion.div 
                      className="flex items-center justify-center gap-6 mb-8"
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      <motion.div 
                        className="w-20 h-20 rounded-full flex items-center justify-center relative"
                        style={{ background: 'var(--gradient-spark)' }}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      >
                        <ShieldCheck size={40} className="text-white" weight="fill" />
                        <div className="absolute inset-0 rounded-full spark-glow"></div>
                      </motion.div>
                      <div>
                        <motion.h1 
                          className="text-5xl font-bold mb-2"
                          style={{ 
                            color: isPlatinum ? '#334155' : isGold ? '#92400e' : '#334155',
                            fontFamily: 'Orbitron, monospace'
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7, duration: 0.6 }}
                        >
                          AstraForensics
                        </motion.h1>
                        <motion.p 
                          className="text-xl"
                          style={{ color: isPlatinum ? '#64748b' : isGold ? '#a16207' : '#64748b' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9 }}
                        >
                          Advanced Cybersecurity Learning Platform
                        </motion.p>
                      </div>
                    </motion.div>

                    {/* Certificate Type Badge */}
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1, type: "spring", stiffness: 300 }}
                    >
                      <div className={`inline-flex items-center gap-3 px-8 py-3 rounded-full text-white text-xl font-semibold relative overflow-hidden`}
                           style={{ background: certificateGradients[certificateData.grade || 'C+'] }}>
                        <TypeIcon size={24} weight="fill" />
                        <span>{certificateTypes[certificateData.certificateType || 'completion'].label}</span>
                        {isPlatinum && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Main Content */}
                  <div className="text-center px-20 pb-12">
                    <motion.p 
                      className="text-2xl mb-8"
                      style={{ color: isPlatinum ? '#64748b' : isGold ? '#a16207' : '#64748b' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      This is to certify that
                    </motion.p>
                    
                    <motion.h2 
                      className="text-6xl font-bold mb-10 pb-4 inline-block border-b-4"
                      style={{ 
                        color: isPlatinum ? '#1e293b' : isGold ? '#92400e' : '#1e293b',
                        borderColor: isPlatinum ? '#94a3b8' : isGold ? '#d97706' : '#64748b'
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                    >
                      {certificateData?.studentName || 'Student'}
                    </motion.h2>
                    
                    <motion.p 
                      className="text-2xl mb-6"
                      style={{ color: isPlatinum ? '#64748b' : isGold ? '#a16207' : '#64748b' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6 }}
                    >
                      has successfully completed
                    </motion.p>
                    
                    <motion.h3 
                      className="text-4xl font-semibold mb-8 gradient-text"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.8 }}
                    >
                      {certificateData?.courseName || 'Course'}
                    </motion.h3>
                    
                    {/* Statistics Grid */}
                    <motion.div 
                      className="grid grid-cols-3 gap-12 my-12 px-12"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2, staggerChildren: 0.1 }}
                    >
                      {[
                        { label: 'Final Score', value: `${certificateData?.score || 0}%`, icon: TrendUp },
                        { label: 'Grade Achieved', value: certificateData?.grade || 'N/A', icon: Star },
                        { label: 'Course Duration', value: certificateData?.duration || 'N/A', icon: Clock }
                      ].map((stat, index) => (
                        <motion.div 
                          key={index}
                          className="text-center p-4 rounded-xl relative"
                          style={{ background: isPlatinum ? 'rgba(148, 163, 184, 0.1)' : isGold ? 'rgba(217, 119, 6, 0.1)' : 'rgba(100, 116, 139, 0.1)' }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 2 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <stat.icon size={32} className="mx-auto mb-2" style={{ color: certificateTypes[certificateData.certificateType].sparkColor }} />
                          <div className="text-3xl font-bold" style={{ color: isPlatinum ? '#1e293b' : isGold ? '#92400e' : '#1e293b' }}>
                            {stat.value}
                          </div>
                          <div className="text-sm" style={{ color: isPlatinum ? '#64748b' : isGold ? '#a16207' : '#64748b' }}>
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Skills Section */}
                    <motion.div 
                      className="mb-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.3 }}
                    >
                      <p className="text-xl mb-4" style={{ color: isPlatinum ? '#64748b' : isGold ? '#a16207' : '#64748b' }}>
                        Skills Demonstrated:
                      </p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {certificateData?.skills?.map((skill, index) => (
                          <motion.span
                            key={index}
                            className="px-4 py-2 rounded-full text-sm font-medium"
                            style={{ 
                              background: isPlatinum ? 'rgba(148, 163, 184, 0.2)' : isGold ? 'rgba(217, 119, 6, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                              color: isPlatinum ? '#334155' : isGold ? '#92400e' : '#334155'
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2.5 + index * 0.1 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-20 left-0 right-0 px-20">
                    <div className="flex justify-between items-end">
                      <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.7 }}
                      >
                        <div className="w-56 border-t-2 mb-3" style={{ borderColor: isPlatinum ? '#94a3b8' : isGold ? '#d97706' : '#64748b' }}></div>
                        <p className="text-sm" style={{ color: isPlatinum ? '#64748b' : isGold ? '#a16207' : '#64748b' }}>Certificate Date</p>
                        <p className="font-medium text-lg" style={{ color: isPlatinum ? '#1e293b' : isGold ? '#92400e' : '#1e293b' }}>
                          {certificateData?.completionDate ? 
                            (typeof certificateData.completionDate === 'string' ? 
                              new Date(certificateData.completionDate) : 
                              certificateData.completionDate
                            ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.9, type: "spring", stiffness: 300 }}
                      >
                        <motion.div 
                          className="w-24 h-24 rounded-full flex items-center justify-center mb-3 mx-auto spark-glow"
                          style={{ background: 'var(--gradient-spark)' }}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 1 }}
                        >
                          <Medal size={40} className="text-white" weight="fill" />
                        </motion.div>
                        <p className="text-xs" style={{ color: isPlatinum ? '#64748b' : isGold ? '#a16207' : '#64748b' }}>
                          Verified Certificate
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3.1 }}
                      >
                        <div className="w-56 border-t-2 mb-3" style={{ borderColor: isPlatinum ? '#94a3b8' : isGold ? '#d97706' : '#64748b' }}></div>
                        <p className="text-sm" style={{ color: isPlatinum ? '#64748b' : isGold ? '#a16207' : '#64748b' }}>Certificate ID</p>
                        <p className="font-medium font-mono text-sm" style={{ color: isPlatinum ? '#1e293b' : isGold ? '#92400e' : '#1e293b' }}>
                          AF-{certificateData?.id?.toUpperCase().slice(0, 12) || 'UNKNOWN'}
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Achievement Stars for High Scores */}
                  {(certificateData?.score || 0) >= 90 && (
                    <div className="absolute top-1/2 left-12 transform -translate-y-1/2">
                      <div className="flex flex-col gap-3">
                        {[...Array(isPlatinum ? 5 : 3)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ 
                              delay: 3.3 + i * 0.1, 
                              type: "spring", 
                              stiffness: 300 
                            }}
                          >
                            {isPlatinum ? (
                              <Sparkle size={28} className="text-slate-400 certificate-sparkle" weight="fill" />
                            ) : (
                              <Star size={28} className="text-yellow-400 certificate-sparkle" weight="fill" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Official Seal */}
                  <motion.div 
                    className="absolute top-1/3 right-16 transform -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0, rotate: -90 }}
                    animate={{ opacity: 0.9, scale: 1, rotate: -15 }}
                    transition={{ delay: 3.5, duration: 1.2, type: "spring" }}
                  >
                    <div 
                      className="w-36 h-36 rounded-full flex items-center justify-center border-4 relative"
                      style={{ 
                        background: isPlatinum 
                          ? 'radial-gradient(circle, rgba(148, 163, 184, 0.2), rgba(148, 163, 184, 0.4))'
                          : isGold 
                          ? 'radial-gradient(circle, rgba(217, 119, 6, 0.2), rgba(217, 119, 6, 0.4))'
                          : 'radial-gradient(circle, rgba(100, 116, 139, 0.2), rgba(100, 116, 139, 0.4))',
                        borderColor: isPlatinum ? '#94a3b8' : isGold ? '#d97706' : '#64748b'
                      }}
                    >
                      <div className="text-center">
                        <Lightning size={32} className="mx-auto mb-1" style={{ color: certificateTypes[certificateData.certificateType].sparkColor }} />
                        <div className="text-xs font-bold" style={{ color: isPlatinum ? '#334155' : isGold ? '#92400e' : '#334155' }}>
                          VERIFIED
                        </div>
                        <div className="text-xs" style={{ color: isPlatinum ? '#64748b' : isGold ? '#a16207' : '#64748b' }}>
                          2024
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* QR Code Placeholder */}
                  <motion.div 
                    className="absolute bottom-24 right-12"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.7 }}
                  >
                    <div 
                      className="w-24 h-24 rounded-lg flex items-center justify-center text-center"
                      style={{ 
                        background: isPlatinum ? 'rgba(148, 163, 184, 0.2)' : isGold ? 'rgba(217, 119, 6, 0.2)' : 'rgba(100, 116, 139, 0.2)'
                      }}
                    >
                      <div className="text-xs" style={{ color: isPlatinum ? '#64748b' : isGold ? '#a16207' : '#64748b' }}>
                        QR Code<br />Verification
                      </div>
                    </div>
                  </motion.div>

                  {/* Watermark */}
                  <motion.div 
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4 }}
                  >
                    <p className="text-xs" style={{ color: isPlatinum ? '#94a3b8' : isGold ? '#d97706' : '#94a3b8' }}>
                      © 2024 AstraForensics - Advanced Cybersecurity Learning Platform | Spark-Powered Certificates
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="border-t p-6 bg-gradient-to-r from-card/50 via-background/50 to-card/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex justify-center gap-4">
            <Button
              onClick={downloadCertificate}
              disabled={isDownloading}
              className="spark-button px-6 py-3"
              size="lg"
            >
              <Download size={18} className="mr-2" />
              {isDownloading ? 'Downloading...' : 'Download Certificate'}
            </Button>
            
            <Button
              variant="outline"
              onClick={printCertificate}
              className="px-6 py-3"
              size="lg"
            >
              <Printer size={18} className="mr-2" />
              Print
            </Button>
            
            <Button
              variant="outline"
              onClick={shareCertificate}
              className="px-6 py-3"
              size="lg"
            >
              <Share size={18} className="mr-2" />
              Share Achievement
            </Button>
          </div>
          
          <motion.p 
            className="text-center text-sm text-muted-foreground mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            ⚡ Your certificate features advanced Spark animations and will be saved to your profile automatically
          </motion.p>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}