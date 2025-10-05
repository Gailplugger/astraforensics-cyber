/**
 * Storage System for Notes and To-Do Management
 * Supports both LocalStorage and IndexedDB with offline capabilities
 */

import { toast } from 'sonner'

export interface Note {
  id: string
  folderId: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  isPinned: boolean
  tags: string[]
  type: 'text' | 'ai-generated' | 'voice' | 'imported'
  mediaFiles?: MediaFile[]
}

export interface MediaFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
}

export interface Folder {
  id: string
  name: string
  createdAt: string
  color?: string
  icon?: string
  parentId?: string
}

export interface TodoTask {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  subtasks?: SubTask[]
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface DailyReflection {
  id: string
  date: string
  question: string
  answer?: string
  aiGenerated: boolean
}

export interface BackupData {
  notes: Note[]
  folders: Folder[]
  todos: TodoTask[]
  reflections: DailyReflection[]
  exportedAt: string
  version: string
}

// IndexedDB Database Setup
const DB_NAME = 'AstraForensicsNotes'
const DB_VERSION = 1

class IndexedDBStorage {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object stores
        if (!db.objectStoreNames.contains('notes')) {
          const notesStore = db.createObjectStore('notes', { keyPath: 'id' })
          notesStore.createIndex('folderId', 'folderId', { unique: false })
          notesStore.createIndex('createdAt', 'createdAt', { unique: false })
          notesStore.createIndex('isPinned', 'isPinned', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('folders')) {
          db.createObjectStore('folders', { keyPath: 'id' })
        }
        
        if (!db.objectStoreNames.contains('todos')) {
          const todosStore = db.createObjectStore('todos', { keyPath: 'id' })
          todosStore.createIndex('category', 'category', { unique: false })
          todosStore.createIndex('completed', 'completed', { unique: false })
          todosStore.createIndex('priority', 'priority', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('reflections')) {
          const reflectionsStore = db.createObjectStore('reflections', { keyPath: 'id' })
          reflectionsStore.createIndex('date', 'date', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media', { keyPath: 'id' })
        }
      }
    })
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async get<T>(storeName: string, id: string): Promise<T | null> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(id)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async put<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

// Storage Manager
class StorageManager {
  private indexedDB = new IndexedDBStorage()
  private fallbackToLocalStorage = false

  async init(): Promise<void> {
    try {
      await this.indexedDB.init()
    } catch (error) {
      console.warn('IndexedDB not available, falling back to LocalStorage:', error)
      this.fallbackToLocalStorage = true
    }
  }

  // Notes Management
  async getNotes(): Promise<Note[]> {
    try {
      if (this.fallbackToLocalStorage) {
        const notes = localStorage.getItem('astra-notes')
        return notes ? JSON.parse(notes) : []
      }
      return await this.indexedDB.getAll<Note>('notes')
    } catch (error) {
      console.error('Error getting notes:', error)
      return []
    }
  }

  async saveNote(note: Note): Promise<void> {
    try {
      if (this.fallbackToLocalStorage) {
        const notes = await this.getNotes()
        const updatedNotes = notes.filter(n => n.id !== note.id).concat(note)
        localStorage.setItem('astra-notes', JSON.stringify(updatedNotes))
      } else {
        await this.indexedDB.put('notes', note)
      }
      toast.success('Note saved successfully')
    } catch (error) {
      console.error('Error saving note:', error)
      toast.error('Failed to save note')
    }
  }

  async deleteNote(id: string): Promise<void> {
    try {
      if (this.fallbackToLocalStorage) {
        const notes = await this.getNotes()
        const updatedNotes = notes.filter(n => n.id !== id)
        localStorage.setItem('astra-notes', JSON.stringify(updatedNotes))
      } else {
        await this.indexedDB.delete('notes', id)
      }
      toast.success('Note deleted successfully')
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error('Failed to delete note')
    }
  }

  // Folders Management
  async getFolders(): Promise<Folder[]> {
    try {
      if (this.fallbackToLocalStorage) {
        const folders = localStorage.getItem('astra-folders')
        return folders ? JSON.parse(folders) : this.getDefaultFolders()
      }
      const folders = await this.indexedDB.getAll<Folder>('folders')
      return folders.length > 0 ? folders : this.getDefaultFolders()
    } catch (error) {
      console.error('Error getting folders:', error)
      return this.getDefaultFolders()
    }
  }

  private getDefaultFolders(): Folder[] {
    return [
      {
        id: 'default',
        name: 'General Notes',
        createdAt: new Date().toISOString(),
        color: '#3B82F6',
        icon: 'FileText'
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        createdAt: new Date().toISOString(),
        color: '#EF4444',
        icon: 'Shield'
      },
      {
        id: 'study',
        name: 'Study Materials',
        createdAt: new Date().toISOString(),
        color: '#10B981',
        icon: 'BookOpen'
      }
    ]
  }

  async saveFolder(folder: Folder): Promise<void> {
    try {
      if (this.fallbackToLocalStorage) {
        const folders = await this.getFolders()
        const updatedFolders = folders.filter(f => f.id !== folder.id).concat(folder)
        localStorage.setItem('astra-folders', JSON.stringify(updatedFolders))
      } else {
        await this.indexedDB.put('folders', folder)
      }
      toast.success('Folder saved successfully')
    } catch (error) {
      console.error('Error saving folder:', error)
      toast.error('Failed to save folder')
    }
  }

  async deleteFolder(id: string): Promise<void> {
    try {
      // Move notes from deleted folder to default
      const notes = await this.getNotes()
      const affectedNotes = notes.filter(note => note.folderId === id)
      
      for (const note of affectedNotes) {
        await this.saveNote({ ...note, folderId: 'default' })
      }

      if (this.fallbackToLocalStorage) {
        const folders = await this.getFolders()
        const updatedFolders = folders.filter(f => f.id !== id)
        localStorage.setItem('astra-folders', JSON.stringify(updatedFolders))
      } else {
        await this.indexedDB.delete('folders', id)
      }
      toast.success('Folder deleted successfully')
    } catch (error) {
      console.error('Error deleting folder:', error)
      toast.error('Failed to delete folder')
    }
  }

  // Todo Management
  async getTodos(): Promise<TodoTask[]> {
    try {
      if (this.fallbackToLocalStorage) {
        const todos = localStorage.getItem('astra-todos')
        return todos ? JSON.parse(todos) : []
      }
      return await this.indexedDB.getAll<TodoTask>('todos')
    } catch (error) {
      console.error('Error getting todos:', error)
      return []
    }
  }

  async saveTodo(todo: TodoTask): Promise<void> {
    try {
      if (this.fallbackToLocalStorage) {
        const todos = await this.getTodos()
        const updatedTodos = todos.filter(t => t.id !== todo.id).concat(todo)
        localStorage.setItem('astra-todos', JSON.stringify(updatedTodos))
      } else {
        await this.indexedDB.put('todos', todo)
      }
      toast.success('Task saved successfully')
    } catch (error) {
      console.error('Error saving todo:', error)
      toast.error('Failed to save task')
    }
  }

  async deleteTodo(id: string): Promise<void> {
    try {
      if (this.fallbackToLocalStorage) {
        const todos = await this.getTodos()
        const updatedTodos = todos.filter(t => t.id !== id)
        localStorage.setItem('astra-todos', JSON.stringify(updatedTodos))
      } else {
        await this.indexedDB.delete('todos', id)
      }
      toast.success('Task deleted successfully')
    } catch (error) {
      console.error('Error deleting todo:', error)
      toast.error('Failed to delete task')
    }
  }

  // Daily Reflections
  async getReflections(): Promise<DailyReflection[]> {
    try {
      if (this.fallbackToLocalStorage) {
        const reflections = localStorage.getItem('astra-reflections')
        return reflections ? JSON.parse(reflections) : []
      }
      return await this.indexedDB.getAll<DailyReflection>('reflections')
    } catch (error) {
      console.error('Error getting reflections:', error)
      return []
    }
  }

  async saveReflection(reflection: DailyReflection): Promise<void> {
    try {
      if (this.fallbackToLocalStorage) {
        const reflections = await this.getReflections()
        const updatedReflections = reflections.filter(r => r.id !== reflection.id).concat(reflection)
        localStorage.setItem('astra-reflections', JSON.stringify(updatedReflections))
      } else {
        await this.indexedDB.put('reflections', reflection)
      }
    } catch (error) {
      console.error('Error saving reflection:', error)
    }
  }

  // Backup and Restore
  async exportBackup(): Promise<BackupData> {
    const [notes, folders, todos, reflections] = await Promise.all([
      this.getNotes(),
      this.getFolders(),
      this.getTodos(),
      this.getReflections()
    ])

    return {
      notes,
      folders,
      todos,
      reflections,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    }
  }

  async importBackup(backupData: BackupData): Promise<void> {
    try {
      // Clear existing data
      if (this.fallbackToLocalStorage) {
        localStorage.removeItem('astra-notes')
        localStorage.removeItem('astra-folders')
        localStorage.removeItem('astra-todos')
        localStorage.removeItem('astra-reflections')
      } else {
        await Promise.all([
          this.indexedDB.clear('notes'),
          this.indexedDB.clear('folders'),
          this.indexedDB.clear('todos'),
          this.indexedDB.clear('reflections')
        ])
      }

      // Import data
      await Promise.all([
        ...backupData.notes.map(note => this.saveNote(note)),
        ...backupData.folders.map(folder => this.saveFolder(folder)),
        ...backupData.todos.map(todo => this.saveTodo(todo)),
        ...backupData.reflections.map(reflection => this.saveReflection(reflection))
      ])

      toast.success('Backup imported successfully')
    } catch (error) {
      console.error('Error importing backup:', error)
      toast.error('Failed to import backup')
    }
  }

  // Search functionality
  async searchNotes(query: string): Promise<Note[]> {
    const notes = await this.getNotes()
    const lowercaseQuery = query.toLowerCase()
    
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  async searchTodos(query: string): Promise<TodoTask[]> {
    const todos = await this.getTodos()
    const lowercaseQuery = query.toLowerCase()
    
    return todos.filter(todo => 
      todo.title.toLowerCase().includes(lowercaseQuery) ||
      todo.description?.toLowerCase().includes(lowercaseQuery) ||
      todo.category.toLowerCase().includes(lowercaseQuery) ||
      todo.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }
}

// Export singleton instance
export const storageManager = new StorageManager()

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const truncateText = (text: string, length: number = 100): string => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

export const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return 'Image'
  if (type.startsWith('video/')) return 'Video'
  if (type.startsWith('audio/')) return 'Music'
  if (type.includes('pdf')) return 'FileText'
  if (type.includes('document') || type.includes('text')) return 'FileText'
  return 'File'
}