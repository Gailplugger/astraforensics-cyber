/**
 * TodoDashboard - Main interface for managing tasks and to-do lists
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Tag,
  CheckSquare,
  Square,
  Star,
  Clock,
  AlertTriangle,
  Trash2,
  Edit,
  MoreHorizontal,
  Sparkles,
  Download,
  Upload,
  SortAsc,
  Target
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Checkbox } from '../ui/checkbox'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '../ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'

import { TodoTask, storageManager, formatDate } from '../../lib/storage'
import { AITaskModal } from './AITaskModal'

interface TodoState {
  todos: TodoTask[]
  loading: boolean
  searchQuery: string
  selectedCategory: string | null
  viewMode: 'all' | 'pending' | 'completed'
  sortBy: 'date' | 'priority' | 'title' | 'category'
  filterBy: 'all' | 'high' | 'medium' | 'low' | 'overdue'
}

interface TodoDashboardProps {
  isOpen: boolean
  onClose: () => void
}

const PRIORITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981'
}

const PRIORITY_ICONS = {
  high: AlertTriangle,
  medium: Clock,
  low: Target
}

const CATEGORIES = [
  'Study',
  'Cybersecurity',
  'Certification',
  'Personal',
  'Work',
  'Projects',
  'Learning',
  'Research'
]

export function TodoDashboard({ isOpen, onClose }: TodoDashboardProps) {
  const [state, setState] = useState<TodoState>({
    todos: [],
    loading: true,
    searchQuery: '',
    selectedCategory: null,
    viewMode: 'all',
    sortBy: 'date',
    filterBy: 'all'
  })

  const [showTaskEditor, setShowTaskEditor] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TodoTask | null>(null)
  const [editingTask, setEditingTask] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadTodos()
    }
  }, [isOpen])

  const loadTodos = async () => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const todos = await storageManager.getTodos()
      setState(prev => ({ ...prev, todos, loading: false }))
    } catch (error) {
      console.error('Error loading todos:', error)
      toast.error('Failed to load tasks')
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const handleCreateTask = () => {
    const newTask: TodoTask = {
      id: Date.now().toString(),
      title: '',
      description: '',
      completed: false,
      priority: 'medium',
      category: state.selectedCategory || 'Study',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    }
    setSelectedTask(newTask)
    setEditingTask(newTask.id)
  }

  const handleSaveTask = async (task: TodoTask) => {
    try {
      await storageManager.saveTodo(task)
      await loadTodos()
      setEditingTask(null)
      setSelectedTask(null)
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleToggleComplete = async (task: TodoTask) => {
    try {
      const updatedTask = { 
        ...task, 
        completed: !task.completed,
        updatedAt: new Date().toISOString()
      }
      await storageManager.saveTodo(updatedTask)
      await loadTodos()
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉')
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await storageManager.deleteTodo(taskId)
      await loadTodos()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleEditTask = (task: TodoTask) => {
    setSelectedTask(task)
    setEditingTask(task.id)
  }

  const handleExportTasks = async () => {
    try {
      const backup = await storageManager.exportBackup()
      const taskData = {
        todos: backup.todos,
        exportedAt: backup.exportedAt
      }
      
      const blob = new Blob([JSON.stringify(taskData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `astra-tasks-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Tasks exported successfully')
    } catch (error) {
      console.error('Error exporting tasks:', error)
      toast.error('Failed to export tasks')
    }
  }

  const filteredAndSortedTodos = React.useMemo(() => {
    let filtered = state.todos

    // Apply search filter
    if (state.searchQuery) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        todo.category.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        todo.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
      )
    }

    // Apply category filter
    if (state.selectedCategory) {
      filtered = filtered.filter(todo => todo.category === state.selectedCategory)
    }

    // Apply view mode filter
    switch (state.viewMode) {
      case 'pending':
        filtered = filtered.filter(todo => !todo.completed)
        break
      case 'completed':
        filtered = filtered.filter(todo => todo.completed)
        break
    }

    // Apply priority/status filter
    switch (state.filterBy) {
      case 'high':
      case 'medium':
      case 'low':
        filtered = filtered.filter(todo => todo.priority === state.filterBy)
        break
      case 'overdue':
        const now = new Date()
        filtered = filtered.filter(todo => 
          todo.dueDate && new Date(todo.dueDate) < now && !todo.completed
        )
        break
    }

    // Apply sorting
    switch (state.sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
        break
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category))
        break
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
    }

    return filtered
  }, [state.todos, state.searchQuery, state.selectedCategory, state.viewMode, state.filterBy, state.sortBy])

  const getTaskStats = () => {
    const total = state.todos.length
    const completed = state.todos.filter(t => t.completed).length
    const pending = total - completed
    const overdue = state.todos.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
    ).length

    return { total, completed, pending, overdue }
  }

  const stats = getTaskStats()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-lg shadow-2xl w-full max-w-7xl h-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="border-b bg-card/50 backdrop-blur-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold gradient-text">AI Task Manager</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-lg font-bold">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Total Tasks</div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-lg font-bold">{stats.completed}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <div>
                  <div className="text-lg font-bold">{stats.pending}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <div>
                  <div className="text-lg font-bold">{stats.overdue}</div>
                  <div className="text-xs text-muted-foreground">Overdue</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks, categories, tags..."
                value={state.searchQuery}
                onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode */}
              <Tabs 
                value={state.viewMode} 
                onValueChange={(v) => setState(prev => ({ ...prev, viewMode: v as any }))}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Done</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Filters */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, filterBy: 'all' }))}>
                    All Tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, filterBy: 'high' }))}>
                    High Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, filterBy: 'medium' }))}>
                    Medium Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, filterBy: 'low' }))}>
                    Low Priority
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, filterBy: 'overdue' }))}>
                    Overdue
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortAsc className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, sortBy: 'date' }))}>
                    Last Modified
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, sortBy: 'priority' }))}>
                    Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, sortBy: 'title' }))}>
                    Title A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, sortBy: 'category' }))}>
                    Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportTasks}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Tasks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-full overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-64 border-r bg-muted/30 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Categories</h3>
            </div>

            <div className="space-y-2">
              <Button
                variant={state.selectedCategory === null ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setState(prev => ({ ...prev, selectedCategory: null }))}
              >
                <Target className="w-4 h-4 mr-2" />
                All Tasks ({state.todos.length})
              </Button>

              {CATEGORIES.map((category) => {
                const taskCount = state.todos.filter(t => t.category === category).length
                if (taskCount === 0) return null
                
                return (
                  <Button
                    key={category}
                    variant={state.selectedCategory === category ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setState(prev => ({ ...prev, selectedCategory: category }))}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    {category} ({taskCount})
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Tasks List */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading tasks...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button onClick={handleCreateTask} className="spark-button">
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAIModal(true)}
                    className="border-dashed border-2 hover:border-primary"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                  </Button>
                </div>

                {/* Tasks Display */}
                {filteredAndSortedTodos.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                    <p className="text-muted-foreground mb-4">
                      {state.searchQuery ? 'Try adjusting your search terms' : 'Create your first task to get started'}
                    </p>
                    <Button onClick={handleCreateTask}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredAndSortedTodos.map((task) => {
                        const PriorityIcon = PRIORITY_ICONS[task.priority]
                        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
                        const isEditing = editingTask === task.id

                        return (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                              task.completed 
                                ? 'bg-muted/50 border-muted' 
                                : isOverdue 
                                  ? 'bg-destructive/5 border-destructive/20' 
                                  : 'bg-card border-border hover:border-primary'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => handleToggleComplete(task)}
                                className="mt-1"
                              />
                              
                              <div className="flex-1 min-w-0">
                                {isEditing ? (
                                  <TaskEditor
                                    task={selectedTask!}
                                    onSave={handleSaveTask}
                                    onCancel={() => {
                                      setEditingTask(null)
                                      setSelectedTask(null)
                                    }}
                                  />
                                ) : (
                                  <>
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                        {task.title || 'Untitled Task'}
                                      </h4>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="w-4 h-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                          <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="text-destructive"
                                          >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                    
                                    {task.description && (
                                      <p className={`text-sm mb-3 ${task.completed ? 'text-muted-foreground' : ''}`}>
                                        {task.description}
                                      </p>
                                    )}
                                    
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                          <PriorityIcon 
                                            className="w-3 h-3" 
                                            style={{ color: PRIORITY_COLORS[task.priority] }}
                                          />
                                          <span className="text-xs text-muted-foreground capitalize">
                                            {task.priority}
                                          </span>
                                        </div>
                                        
                                        <Badge variant="secondary" className="text-xs">
                                          {task.category}
                                        </Badge>
                                        
                                        {task.dueDate && (
                                          <div className={`flex items-center gap-1 text-xs ${
                                            isOverdue ? 'text-destructive' : 'text-muted-foreground'
                                          }`}>
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(task.dueDate)}
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="text-xs text-muted-foreground">
                                        {formatDate(task.updatedAt)}
                                      </div>
                                    </div>
                                    
                                    {task.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {task.tags.map((tag) => (
                                          <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* AI Task Modal */}
        <AITaskModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          onSave={handleSaveTask}
        />
      </motion.div>
    </div>
  )
}

// Inline Task Editor Component
interface TaskEditorProps {
  task: TodoTask
  onSave: (task: TodoTask) => void
  onCancel: () => void
}

function TaskEditor({ task, onSave, onCancel }: TaskEditorProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [priority, setPriority] = useState(task.priority)
  const [category, setCategory] = useState(task.category)
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  )

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const updatedTask: TodoTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      updatedAt: new Date().toISOString()
    }

    onSave(updatedTask)
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="font-medium"
        autoFocus
      />
      
      <Input
        placeholder="Description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="text-sm"
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="px-3 py-1 text-sm border rounded-md"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1 text-sm border rounded-md"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-3 py-1 text-sm border rounded-md"
        />
        
        <div className="flex gap-1">
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}