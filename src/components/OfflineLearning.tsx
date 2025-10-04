import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Switch } from './ui/switch'
import { 
  Download, 
  Cloud, 
  WifiHigh,
  WifiSlash,
  CheckCircle,
  Clock,
  HardDrives,
  ArrowClockwise,
  Trash,
  Play,
  Pause,
  Eye
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface OfflineContent {
  id: string
  title: string
  type: 'course' | 'quiz' | 'resource'
  size: string
  downloadedAt: Date
  lastAccessed?: Date
  progress: number
  isComplete: boolean
  moduleId?: string
  estimatedTime: string
}

interface DownloadProgress {
  contentId: string
  progress: number
  status: 'downloading' | 'complete' | 'error' | 'paused'
}

interface OfflineLearningProps {
  isOpen: boolean
  onClose: () => void
  userData?: any
}

export function OfflineLearning({ isOpen, onClose, userData }: OfflineLearningProps) {
  const [offlineContent, setOfflineContent] = useKV<OfflineContent[]>('offline-content', [])
  const [downloadQueue, setDownloadQueue] = useState<DownloadProgress[]>([])
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine)
  const [storageUsed, setStorageUsed] = useState<number>(0)
  const [storageQuota, setStorageQuota] = useState<number>(0)
  const [availableContent, setAvailableContent] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState<'downloaded' | 'available' | 'settings'>('downloaded')

  useEffect(() => {
    if (isOpen) {
      checkStorageUsage()
      loadAvailableContent()
      
      // Listen for online/offline events
      const handleOnline = () => setIsOfflineMode(false)
      const handleOffline = () => setIsOfflineMode(true)
      
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [isOpen])

  const checkStorageUsage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        setStorageUsed(estimate.usage || 0)
        setStorageQuota(estimate.quota || 0)
      } catch (error) {
        console.error('Error checking storage:', error)
      }
    }
  }

  const loadAvailableContent = async () => {
    // Simulate available content - in real app, this would come from the server
    const content = [
      {
        id: 'course-1',
        title: 'Network Security Fundamentals',
        type: 'course',
        size: '125 MB',
        estimatedTime: '4 hours',
        description: 'Complete course on network security basics',
        modules: 8
      },
      {
        id: 'course-2',
        title: 'Cryptography Essentials',
        type: 'course',
        size: '98 MB',
        estimatedTime: '3 hours',
        description: 'Learn encryption, hashing, and digital signatures',
        modules: 6
      },
      {
        id: 'quiz-pack-1',
        title: 'Security+ Practice Quizzes',
        type: 'quiz',
        size: '15 MB',
        estimatedTime: '2 hours',
        description: '200+ practice questions for Security+ certification',
        questions: 200
      },
      {
        id: 'resource-1',
        title: 'Cybersecurity Reference Library',
        type: 'resource',
        size: '45 MB',
        estimatedTime: 'Reference',
        description: 'Comprehensive reference materials and cheat sheets',
        files: 25
      }
    ]
    setAvailableContent(content)
  }

  const startDownload = async (contentId: string) => {
    const content = availableContent.find(c => c.id === contentId)
    if (!content) return

    // Check storage space
    const estimatedSize = parseFloat(content.size) * 1024 * 1024 // Convert MB to bytes
    if (storageUsed + estimatedSize > storageQuota * 0.9) {
      toast.error('Not enough storage space. Please free up some space.')
      return
    }

    // Add to download queue
    const downloadProgress: DownloadProgress = {
      contentId,
      progress: 0,
      status: 'downloading'
    }
    
    setDownloadQueue(prev => [...prev, downloadProgress])
    toast.success(`Starting download: ${content.title}`)

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadQueue(prev => 
        prev.map(item => 
          item.contentId === contentId && item.status === 'downloading'
            ? { ...item, progress: Math.min(item.progress + Math.random() * 15, 100) }
            : item
        )
      )
    }, 500)

    // Complete download after simulation
    setTimeout(() => {
      clearInterval(interval)
      setDownloadQueue(prev => 
        prev.map(item => 
          item.contentId === contentId 
            ? { ...item, progress: 100, status: 'complete' }
            : item
        )
      )

      // Add to offline content
      const offlineItem: OfflineContent = {
        id: contentId,
        title: content.title,
        type: content.type,
        size: content.size,
        downloadedAt: new Date(),
        progress: 0,
        isComplete: false,
        estimatedTime: content.estimatedTime
      }

      setOfflineContent(prev => [...(prev || []), offlineItem])
      toast.success(`Downloaded: ${content.title}`)
      
      // Remove from download queue after a moment
      setTimeout(() => {
        setDownloadQueue(prev => prev.filter(item => item.contentId !== contentId))
      }, 2000)
    }, 3000 + Math.random() * 2000)
  }

  const pauseDownload = (contentId: string) => {
    setDownloadQueue(prev => 
      prev.map(item => 
        item.contentId === contentId 
          ? { ...item, status: 'paused' }
          : item
      )
    )
    toast.info('Download paused')
  }

  const resumeDownload = (contentId: string) => {
    setDownloadQueue(prev => 
      prev.map(item => 
        item.contentId === contentId 
          ? { ...item, status: 'downloading' }
          : item
      )
    )
    toast.info('Download resumed')
  }

  const cancelDownload = (contentId: string) => {
    setDownloadQueue(prev => prev.filter(item => item.contentId !== contentId))
    toast.info('Download cancelled')
  }

  const deleteOfflineContent = (contentId: string) => {
    setOfflineContent(prev => (prev || []).filter(item => item.id !== contentId))
    checkStorageUsage()
    toast.success('Content deleted')
  }

  const clearAllOfflineContent = () => {
    setOfflineContent([])
    checkStorageUsage()
    toast.success('All offline content cleared')
  }

  const syncProgress = async () => {
    if (isOfflineMode) {
      toast.error('Cannot sync while offline')
      return
    }

    toast.success('Progress synced with cloud')
    // In real app, sync progress data with server
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStoragePercentage = () => {
    if (storageQuota === 0) return 0
    return (storageUsed / storageQuota) * 100
  }

  const isContentDownloaded = (contentId: string) => {
    return (offlineContent || []).some(item => item.id === contentId)
  }

  const isContentDownloading = (contentId: string) => {
    return downloadQueue.some(item => item.contentId === contentId)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-5xl h-[85vh] max-h-[600px] sm:h-[90vh] sm:max-h-[700px] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Download size={20} className="text-white" weight="fill" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Offline Learning</h2>
                <p className="text-muted-foreground">Learn anywhere, even without internet</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isOfflineMode ? (
                  <WifiSlash size={20} className="text-red-500" />
                ) : (
                  <WifiHigh size={20} className="text-green-500" />
                )}
                <span className="text-sm font-medium">
                  {isOfflineMode ? 'Offline' : 'Online'}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 p-1 bg-secondary/30 rounded-lg">
            {[
              { id: 'downloaded', label: 'Downloaded', icon: HardDrives },
              { id: 'available', label: 'Available', icon: Cloud },
              { id: 'settings', label: 'Settings', icon: ArrowClockwise }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={selectedTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setSelectedTab(tab.id as any)}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {selectedTab === 'downloaded' && (
              <motion.div
                key="downloaded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Downloaded Content</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={syncProgress} disabled={isOfflineMode}>
                      <ArrowClockwise size={16} className="mr-2" />
                      Sync Progress
                    </Button>
                    {(offlineContent || []).length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearAllOfflineContent}>
                        <Trash size={16} className="mr-2" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>

                {(offlineContent || []).length === 0 ? (
                  <div className="text-center py-12">
                    <HardDrives size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h4 className="text-lg font-medium mb-2">No offline content yet</h4>
                    <p className="text-muted-foreground mb-4">Download courses, quizzes, and resources to learn offline</p>
                    <Button onClick={() => setSelectedTab('available')}>
                      Browse Available Content
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(offlineContent || []).map((content, index) => (
                      <motion.div
                        key={content.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-1">{content.title}</CardTitle>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{content.size}</span>
                                  <span>{content.estimatedTime}</span>
                                  <span>Downloaded {content.downloadedAt.toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={content.isComplete ? 'default' : 'secondary'}>
                                  {content.type}
                                </Badge>
                                <Button variant="ghost" size="sm" onClick={() => deleteOfflineContent(content.id)}>
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex-1 mr-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>{content.progress}%</span>
                                </div>
                                <Progress value={content.progress} className="h-2" />
                              </div>
                              <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                                <Play size={16} className="mr-2" />
                                {content.progress > 0 ? 'Continue' : 'Start'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {selectedTab === 'available' && (
              <motion.div
                key="available"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Available for Download</h3>
                  <p className="text-muted-foreground">Download content to access it offline</p>
                </div>

                {/* Download Queue */}
                {downloadQueue.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Downloads in Progress</h4>
                    <div className="space-y-3">
                      {downloadQueue.map((download) => {
                        const content = availableContent.find(c => c.id === download.contentId)
                        return (
                          <Card key={download.contentId}>
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{content?.title}</span>
                                <div className="flex items-center gap-2">
                                  {download.status === 'downloading' && (
                                    <Button size="sm" variant="ghost" onClick={() => pauseDownload(download.contentId)}>
                                      <Pause size={14} />
                                    </Button>
                                  )}
                                  {download.status === 'paused' && (
                                    <Button size="sm" variant="ghost" onClick={() => resumeDownload(download.contentId)}>
                                      <Play size={14} />
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost" onClick={() => cancelDownload(download.contentId)}>
                                    <Trash size={14} />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress value={download.progress} className="flex-1 h-2" />
                                <span className="text-sm text-muted-foreground">{Math.round(download.progress)}%</span>
                              </div>
                              {download.status === 'paused' && (
                                <p className="text-sm text-amber-600 mt-1">Download paused</p>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {availableContent.map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">{content.title}</CardTitle>
                              <p className="text-muted-foreground text-sm mb-2">{content.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{content.size}</span>
                                <span>{content.estimatedTime}</span>
                                {content.modules && <span>{content.modules} modules</span>}
                                {content.questions && <span>{content.questions} questions</span>}
                                {content.files && <span>{content.files} files</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{content.type}</Badge>
                              {isContentDownloaded(content.id) ? (
                                <Badge variant="default" className="bg-green-600">
                                  <CheckCircle size={14} className="mr-1" />
                                  Downloaded
                                </Badge>
                              ) : isContentDownloading(content.id) ? (
                                <Badge variant="secondary">
                                  <Clock size={14} className="mr-1" />
                                  Downloading
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => startDownload(content.id)}
                                  disabled={isOfflineMode}
                                  className="bg-gradient-to-r from-primary to-accent"
                                >
                                  <Download size={16} className="mr-2" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                <h3 className="text-lg font-semibold">Offline Settings</h3>

                {/* Storage Usage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrives size={20} />
                      Storage Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Used Storage</span>
                        <span>{formatBytes(storageUsed)} / {formatBytes(storageQuota)}</span>
                      </div>
                      <Progress value={getStoragePercentage()} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {getStoragePercentage().toFixed(1)}% of available storage used
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Sync Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowClockwise size={20} />
                      Sync Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-sync progress</p>
                        <p className="text-sm text-muted-foreground">Automatically sync progress when online</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Download over cellular</p>
                        <p className="text-sm text-muted-foreground">Allow downloads using mobile data</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                {/* Maintenance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" onClick={checkStorageUsage} className="w-full justify-start">
                      <ArrowClockwise size={16} className="mr-2" />
                      Refresh Storage Info
                    </Button>
                    <Button variant="outline" onClick={clearAllOfflineContent} className="w-full justify-start">
                      <Trash size={16} className="mr-2" />
                      Clear All Downloaded Content
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}