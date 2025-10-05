/**
 * Spark API Utilities
 * 
 * This file provides type-safe wrappers for the Spark global API
 * and handles common error scenarios for backend operations.
 */

// Type definitions for better TypeScript support
export interface SparkUser {
  avatarUrl: string
  email: string
  id: string
  isOwner: boolean
  login: string
}

export interface SparkAPI {
  llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string
  llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
  user: () => Promise<SparkUser>
  kv: {
    keys: () => Promise<string[]>
    get: <T>(key: string) => Promise<T | undefined>
    set: <T>(key: string, value: T) => Promise<void>
    delete: (key: string) => Promise<void>
  }
}

// Safe wrapper for accessing the Spark API
export function getSparkAPI(): SparkAPI {
  if (typeof window === 'undefined') {
    throw new Error('Window is not available (server-side rendering)')
  }
  
  if (!window.spark) {
    throw new Error('Spark API is not available. Make sure you are running in a Spark environment.')
  }
  
  return (window as any).spark
}

// Health check for Spark API
export async function checkSparkHealth(): Promise<boolean> {
  try {
    const spark = getSparkAPI()
    
    // Test KV operations
    await spark.kv.set('health-check', { timestamp: Date.now() })
    await spark.kv.get('health-check')
    await spark.kv.delete('health-check')
    
    sparkLog('Spark API health check passed')
    return true
  } catch (error) {
    sparkError('Spark API health check failed', error)
    return false
  }
}

// Enhanced error handling for LLM calls
export async function callLLM(
  prompt: string, 
  modelName: string = 'gpt-4o', 
  jsonMode: boolean = false,
  retries: number = 3
): Promise<string> {
  try {
    const spark = getSparkAPI()
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await spark.llm(prompt, modelName, jsonMode)
        
        if (!response || response.trim().length === 0) {
          throw new Error('Empty response from LLM')
        }
        
        // Validate JSON response if jsonMode is enabled
        if (jsonMode) {
          try {
            JSON.parse(response)
          } catch (jsonError) {
            throw new Error(`Invalid JSON response: ${jsonError}`)
          }
        }
        
        return response
      } catch (error) {
        sparkError(`LLM call attempt ${attempt} failed`, error)
        
        if (attempt === retries) {
          throw new Error(`LLM call failed after ${retries} attempts: ${error}`)
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
    
    throw new Error('Maximum retries exceeded')
  } catch (error) {
    sparkError('LLM call failed completely', error)
    // Return a fallback response instead of throwing
    return jsonMode ? '{"error": "LLM service unavailable"}' : 'I apologize, but I am currently unable to process your request. Please try again later.'
  }
}

// Enhanced error handling for KV operations
export async function setKVSafely<T>(key: string, value: T): Promise<boolean> {
  try {
    const spark = getSparkAPI()
    await spark.kv.set(key, value)
    return true
  } catch (error) {
    console.error(`Failed to set KV ${key}:`, error)
    return false
  }
}

export async function getKVSafely<T>(key: string, defaultValue?: T): Promise<T | undefined> {
  try {
    const spark = getSparkAPI()
    const result = await spark.kv.get<T>(key)
    return result !== undefined ? result : defaultValue
  } catch (error) {
    console.error(`Failed to get KV ${key}:`, error)
    return defaultValue
  }
}

export async function deleteKVSafely(key: string): Promise<boolean> {
  try {
    const spark = getSparkAPI()
    await spark.kv.delete(key)
    return true
  } catch (error) {
    console.error(`Failed to delete KV ${key}:`, error)
    return false
  }
}

// User information with error handling
export async function getCurrentUser(): Promise<SparkUser | null> {
  try {
    const spark = getSparkAPI()
    return await spark.user()
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}

// Helper for creating LLM prompts with proper template literal handling
export function createPrompt(template: TemplateStringsArray, ...values: any[]): string {
  try {
    if (!isSparkAvailable()) {
      // Fallback: manually construct the prompt
      let result = template[0]
      for (let i = 0; i < values.length; i++) {
        result += String(values[i]) + template[i + 1]
      }
      return result
    }
    
    const spark = getSparkAPI()
    return spark.llmPrompt(template, ...values)
  } catch (error) {
    sparkError('Failed to create LLM prompt', error)
    // Fallback: manually construct the prompt
    let result = template[0]
    for (let i = 0; i < values.length; i++) {
      result += String(values[i]) + template[i + 1]
    }
    return result
  }
}

// Check if Spark environment is available
export function isSparkAvailable(): boolean {
  return typeof window !== 'undefined' && 
         window.spark !== undefined && 
         typeof window.spark === 'object'
}

// Development mode helper
export function isDevelopmentMode(): boolean {
  return import.meta.env.DEV || false
}

// Log helper that respects environment
export function sparkLog(message: string, data?: any): void {
  if (isDevelopmentMode()) {
    console.log(`[Spark] ${message}`, data || '')
  }
}

// Error helper
export function sparkError(message: string, error?: any): void {
  console.error(`[Spark Error] ${message}`, error || '')
}

// Initialize backend health check
export async function initializeBackend(): Promise<boolean> {
  try {
    sparkLog('Initializing backend systems...')
    
    if (!isSparkAvailable()) {
      sparkError('Spark API not available - running in fallback mode')
      return false // Allow app to continue in fallback mode
    }
    
    const healthCheck = await checkSparkHealth()
    if (!healthCheck) {
      sparkError('Backend health check failed - some features may be limited')
      return false // Allow app to continue with limited functionality
    }
    
    sparkLog('Backend initialization successful')
    return true
  } catch (error) {
    sparkError('Backend initialization failed', error)
    return false // Allow app to continue in fallback mode
  }
}