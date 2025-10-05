/**
 * Backend Health Check and Validation Script
 * 
 * This script validates all backend functionality and ensures
 * the application is working correctly with the Spark platform.
 */

import { 
  initializeBackend, 
  isSparkAvailable, 
  checkSparkHealth,
  callLLM,
  setKVSafely,
  getKVSafely,
  deleteKVSafely,
  getCurrentUser,
  sparkLog,
  sparkError
} from './spark-api'

export interface HealthCheckResult {
  component: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: any
}

export class BackendValidator {
  private results: HealthCheckResult[] = []

  async runFullHealthCheck(): Promise<HealthCheckResult[]> {
    this.results = []
    
    sparkLog('Starting comprehensive backend health check...')
    
    await this.checkSparkEnvironment()
    await this.checkKVOperations()
    await this.checkLLMFunctionality()
    await this.checkUserAPI()
    await this.checkDataPersistence()
    
    sparkLog('Backend health check completed', { 
      total: this.results.length,
      passed: this.results.filter(r => r.status === 'pass').length,
      failed: this.results.filter(r => r.status === 'fail').length,
      warnings: this.results.filter(r => r.status === 'warning').length
    })
    
    return this.results
  }

  private async checkSparkEnvironment(): Promise<void> {
    try {
      if (!isSparkAvailable()) {
        this.addResult('Spark Environment', 'fail', 'Spark API is not available')
        return
      }
      
      const healthCheck = await checkSparkHealth()
      if (healthCheck) {
        this.addResult('Spark Environment', 'pass', 'Spark API is available and responsive')
      } else {
        this.addResult('Spark Environment', 'fail', 'Spark API health check failed')
      }
    } catch (error) {
      this.addResult('Spark Environment', 'fail', 'Error checking Spark environment', error)
    }
  }

  private async checkKVOperations(): Promise<void> {
    const testKey = 'health-check-test'
    const testValue = { test: true, timestamp: Date.now() }
    
    try {
      // Test set operation
      const setResult = await setKVSafely(testKey, testValue)
      if (!setResult) {
        this.addResult('KV Storage - Set', 'fail', 'Failed to set test value')
        return
      }
      
      // Test get operation
      const getValue = await getKVSafely<any>(testKey)
      if (!getValue || getValue.test !== true) {
        this.addResult('KV Storage - Get', 'fail', 'Failed to retrieve test value')
        return
      }
      
      // Test delete operation
      const deleteResult = await deleteKVSafely(testKey)
      if (!deleteResult) {
        this.addResult('KV Storage - Delete', 'warning', 'Failed to delete test value')
      }
      
      this.addResult('KV Storage', 'pass', 'All KV operations working correctly')
    } catch (error) {
      this.addResult('KV Storage', 'fail', 'Error during KV operations test', error)
    }
  }

  private async checkLLMFunctionality(): Promise<void> {
    try {
      const testPrompt = 'Say "Hello, AstraForensics!" if you can read this.'
      const response = await callLLM(testPrompt, 'gpt-4o-mini', false)
      
      if (response && response.length > 0) {
        this.addResult('LLM Functionality', 'pass', 'LLM API is responding correctly')
      } else {
        this.addResult('LLM Functionality', 'fail', 'LLM returned empty response')
      }
    } catch (error) {
      this.addResult('LLM Functionality', 'fail', 'Error testing LLM functionality', error)
    }
  }

  private async checkUserAPI(): Promise<void> {
    try {
      const user = await getCurrentUser()
      if (user && user.id) {
        this.addResult('User API', 'pass', 'User information retrieved successfully', {
          userId: user.id,
          login: user.login,
          isOwner: user.isOwner
        })
      } else {
        this.addResult('User API', 'warning', 'User information not available')
      }
    } catch (error) {
      this.addResult('User API', 'fail', 'Error retrieving user information', error)
    }
  }

  private async checkDataPersistence(): Promise<void> {
    const testKeys = ['user-data', 'module-progress', 'quiz-scores', 'user-certificates']
    let accessibleKeys = 0
    
    try {
      for (const key of testKeys) {
        try {
          await getKVSafely(key)
          accessibleKeys++
        } catch (error) {
          sparkError(`Failed to access key: ${key}`, error)
        }
      }
      
      if (accessibleKeys === testKeys.length) {
        this.addResult('Data Persistence', 'pass', 'All application data keys accessible')
      } else if (accessibleKeys > 0) {
        this.addResult('Data Persistence', 'warning', `${accessibleKeys}/${testKeys.length} data keys accessible`)
      } else {
        this.addResult('Data Persistence', 'fail', 'No application data keys accessible')
      }
    } catch (error) {
      this.addResult('Data Persistence', 'fail', 'Error checking data persistence', error)
    }
  }

  private addResult(component: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any): void {
    this.results.push({
      component,
      status,
      message,
      details
    })
  }

  getSystemStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    const failCount = this.results.filter(r => r.status === 'fail').length
    const warnCount = this.results.filter(r => r.status === 'warning').length
    
    if (failCount === 0 && warnCount === 0) {
      return 'healthy'
    } else if (failCount === 0 && warnCount > 0) {
      return 'degraded'
    } else {
      return 'unhealthy'
    }
  }

  generateReport(): string {
    const status = this.getSystemStatus()
    let report = `Backend Health Report - Status: ${status.toUpperCase()}\n`
    report += `Timestamp: ${new Date().toISOString()}\n\n`
    
    this.results.forEach(result => {
      const statusIcon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
      report += `${statusIcon} ${result.component}: ${result.message}\n`
      if (result.details) {
        report += `   Details: ${JSON.stringify(result.details, null, 2)}\n`
      }
    })
    
    return report
  }
}

// Export singleton instance for easy usage
export const backendValidator = new BackendValidator()

// Auto-run health check in development
if (import.meta.env.DEV) {
  setTimeout(async () => {
    try {
      await backendValidator.runFullHealthCheck()
      console.log('🔍 Backend Health Report:')
      console.log(backendValidator.generateReport())
    } catch (error) {
      console.error('❌ Failed to run backend health check:', error)
    }
  }, 2000)
}