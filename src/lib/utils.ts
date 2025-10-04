import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts a timestamp to a Date object
 * Handles cases where timestamp might be a string or already a Date
 */
export function toDate(timestamp: Date | string | number): Date {
  if (timestamp instanceof Date) {
    return timestamp
  }
  
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const date = new Date(timestamp)
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp provided:', timestamp)
      return new Date() // Return current date as fallback
    }
    return date
  }
  
  console.warn('Unknown timestamp type:', typeof timestamp, timestamp)
  return new Date() // Return current date as fallback
}

/**
 * Safely formats a timestamp to locale time string
 */
export function formatTime(timestamp: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  try {
    const date = toDate(timestamp)
    return date.toLocaleTimeString([], options || { hour: '2-digit', minute: '2-digit' })
  } catch (error) {
    console.warn('Error formatting time:', error)
    return 'Invalid time'
  }
}

/**
 * Safely formats a timestamp to locale date string
 */
export function formatDate(timestamp: Date | string | number): string {
  try {
    const date = toDate(timestamp)
    return date.toDateString()
  } catch (error) {
    console.warn('Error formatting date:', error)
    return 'Invalid date'
  }
}
