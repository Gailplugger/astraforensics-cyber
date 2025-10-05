import React from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Warning, ArrowClockwise, Bug, WifiX } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface BackendErrorBoundaryState {
  hasError: boolean
  errorType: 'spark-api' | 'network' | 'unknown'
  errorMessage: string
  retryCount: number
}

interface BackendErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class BackendErrorBoundary extends React.Component<
  BackendErrorBoundaryProps,
  BackendErrorBoundaryState
> {
  private maxRetries = 3

  constructor(props: BackendErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      errorType: 'unknown',
      errorMessage: '',
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<BackendErrorBoundaryState> {
    // Categorize the error
    let errorType: 'spark-api' | 'network' | 'unknown' = 'unknown'
    
    if (error.message.includes('Spark') || error.message.includes('spark')) {
      errorType = 'spark-api'
    } else if (error.message.includes('Network') || error.message.includes('fetch')) {
      errorType = 'network'
    }

    return {
      hasError: true,
      errorType,
      errorMessage: error.message
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Backend Error Boundary caught an error:', error, errorInfo)
    
    // Log to Spark if available
    if (typeof window !== 'undefined' && (window as any).spark) {
      try {
        console.log('[Backend Error]', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack
        })
      } catch (sparkError) {
        console.warn('Failed to log error to Spark:', sparkError)
      }
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        retryCount: prevState.retryCount + 1
      }))
    } else {
      // Max retries reached, show permanent error
      this.setState({
        errorType: 'unknown',
        errorMessage: 'Maximum retry attempts exceeded. Please refresh the page.'
      })
    }
  }

  render() {
    if (this.state.hasError) {
      const { errorType, errorMessage, retryCount } = this.state
      
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={new Error(errorMessage)} retry={this.handleRetry} />
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="border-destructive/20 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  {errorType === 'spark-api' && <Bug className="h-8 w-8 text-destructive" />}
                  {errorType === 'network' && <WifiX className="h-8 w-8 text-destructive" />}
                  {errorType === 'unknown' && <Warning className="h-8 w-8 text-destructive" />}
                </div>
                <CardTitle className="text-destructive">
                  {errorType === 'spark-api' && 'Backend Service Error'}
                  {errorType === 'network' && 'Network Connection Error'}
                  {errorType === 'unknown' && 'Application Error'}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <Warning className="h-4 w-4" />
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>
                    {errorType === 'spark-api' && 
                      'The application backend is experiencing issues. This may affect AI features and data saving.'
                    }
                    {errorType === 'network' && 
                      'Unable to connect to the backend services. Please check your internet connection.'
                    }
                    {errorType === 'unknown' && 
                      'An unexpected error occurred while running the application.'
                    }
                  </AlertDescription>
                </Alert>

                {import.meta.env.DEV && (
                  <div className="bg-muted/50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Error Details (Development):
                    </h4>
                    <pre className="text-xs text-destructive overflow-auto max-h-24 whitespace-pre-wrap">
                      {errorMessage}
                    </pre>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {retryCount < this.maxRetries && (
                    <Button 
                      onClick={this.handleRetry}
                      className="w-full"
                      variant="outline"
                    >
                      <ArrowClockwise className="h-4 w-4 mr-2" />
                      Try Again ({this.maxRetries - retryCount} attempts left)
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => window.location.reload()}
                    className="w-full"
                    variant={retryCount >= this.maxRetries ? "default" : "secondary"}
                  >
                    Refresh Page
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    If the problem persists, please contact support
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}