import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  CheckCircle, 
  Warning, 
  X, 
  ArrowClockwise, 
  WifiHigh,
  WifiX,
  Gear,
  Info
} from '@phosphor-icons/react'
import { backendValidator, HealthCheckResult } from '@/lib/backend-validator'
import { isSparkAvailable, initializeBackend } from '@/lib/spark-api'

interface ErrorRecoveryProps {
  isOpen: boolean
  onClose: () => void
  onRetry?: () => void
}

export function ErrorRecovery({ isOpen, onClose, onRetry }: ErrorRecoveryProps) {
  const [healthResults, setHealthResults] = useState<HealthCheckResult[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'degraded' | 'unhealthy'>('unhealthy')

  useEffect(() => {
    if (isOpen) {
      runHealthCheck()
    }
  }, [isOpen])

  const runHealthCheck = async () => {
    setIsChecking(true)
    try {
      const results = await backendValidator.runFullHealthCheck()
      setHealthResults(results)
      setSystemStatus(backendValidator.getSystemStatus())
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await initializeBackend()
      await runHealthCheck()
      
      if (systemStatus === 'healthy' || systemStatus === 'degraded') {
        onRetry?.()
        onClose()
      }
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <Warning className="w-4 h-4 text-yellow-500" />
      case 'fail':
        return <X className="w-4 h-4 text-red-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'fail':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getSystemStatusInfo = () => {
    switch (systemStatus) {
      case 'healthy':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          title: 'System Healthy',
          description: 'All backend services are operational',
          color: 'border-green-200 bg-green-50'
        }
      case 'degraded':
        return {
          icon: <Warning className="w-6 h-6 text-yellow-500" />,
          title: 'System Degraded',
          description: 'Some features may have limited functionality',
          color: 'border-yellow-200 bg-yellow-50'
        }
      case 'unhealthy':
        return {
          icon: <X className="w-6 h-6 text-red-500" />,
          title: 'System Issues',
          description: 'Multiple backend services are experiencing problems',
          color: 'border-red-200 bg-red-50'
        }
    }
  }

  const getProgressValue = () => {
    const totalChecks = healthResults.length
    const passedChecks = healthResults.filter(r => r.status === 'pass').length
    return totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0
  }

  if (!isOpen) return null

  const statusInfo = getSystemStatusInfo()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden"
      >
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: isChecking ? 360 : 0 }}
                transition={{ duration: 1, repeat: isChecking ? Infinity : 0, ease: "linear" }}
              >
                <Shield className="w-6 h-6 text-primary" />
              </motion.div>
              <div>
                <CardTitle className="text-xl">System Health Check</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Diagnosing backend connectivity and services
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* System Status Overview */}
          <div className={`rounded-lg p-4 mb-6 border ${statusInfo.color}`}>
            <div className="flex items-center space-x-3">
              {statusInfo.icon}
              <div>
                <h3 className="font-semibold">{statusInfo.title}</h3>
                <p className="text-sm opacity-75">{statusInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">System Health</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(getProgressValue())}%
              </span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>

          {/* Health Check Results */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold flex items-center space-x-2">
              <Gear className="w-4 h-4" />
              <span>Service Status</span>
            </h4>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {healthResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.component}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1 opacity-75">
                    {result.message}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Connection Status */}
          <Alert className="mb-6">
            <div className="flex items-center space-x-2">
              {isSparkAvailable() ? (
                <WifiHigh className="w-4 h-4 text-green-500" />
              ) : (
                <WifiX className="w-4 h-4 text-red-500" />
              )}
              <span className="font-medium">
                {isSparkAvailable() ? 'Connected to Spark Platform' : 'Offline Mode Active'}
              </span>
            </div>
            <AlertDescription className="mt-2">
              {isSparkAvailable() 
                ? 'Backend services are accessible and responding.'
                : 'Running in offline mode with limited functionality. Some features may not be available.'
              }
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={runHealthCheck}
              variant="outline"
              disabled={isChecking}
              className="flex-1"
            >
              <ArrowClockwise className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking...' : 'Recheck'}
            </Button>
            
            <Button
              onClick={handleRetry}
              disabled={isRetrying || systemStatus === 'healthy'}
              className="flex-1"
            >
              <ArrowClockwise className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry Connection'}
            </Button>
          </div>

          {/* Helpful Tips */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h5 className="font-medium mb-2">Troubleshooting Tips:</h5>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Check your internet connection</li>
              <li>• Refresh the page if issues persist</li>
              <li>• Some features work offline with limited functionality</li>
              <li>• Contact support if problems continue</li>
            </ul>
          </div>
        </CardContent>
      </motion.div>
    </motion.div>
  )
}