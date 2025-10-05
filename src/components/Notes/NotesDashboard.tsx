/**
 * Notes Dashboard - Main interface for managing notes and folders
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  FolderPlus, 
  Grid3x3, 
  List, 
  Pin,
  Calendar,
  Tag,
  Download,
  Upload,
  Sparkles,
  Mic,
  FileText,
  Folder,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '../ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { toast } from 'sonner'

import { Note, Folder as FolderType, storageManager, formatDate, truncateText } from '../../lib/storage'
import { FolderView } from './FolderView'
import { NoteEditor } from './NoteEditor'
import { AINoteModal } from './AINoteModal'

interface NotesState {
  notes: Note[]
  folders: FolderType[]
  loading: boolean
  searchQuery: string
  selectedFolder: string | null
  viewMode: 'grid' | 'list'
  sortBy: 'date' | 'title' | 'folder'
  filterBy: 'all' | 'pinned' | 'recent' | 'ai-generated'
}

interface NotesDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function NotesDashboard({ isOpen, onClose }: NotesDashboardProps) {
  const [state, setState] = useState<NotesState>({
    notes: [],
    folders: [],
    loading: true,
    searchQuery: '',
    selectedFolder: null,
    viewMode: 'grid',
    sortBy: 'date',
    filterBy: 'all'
  })

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [showNoteEditor, setShowNoteEditor] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showFolderDialog, setShowFolderDialog] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const [notes, folders] = await Promise.all([
        storageManager.getNotes(),
        storageManager.getFolders()
      ])
      setState(prev => ({ 
        ...prev, 
        notes, 
        folders, 
        loading: false 
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load notes')
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      folderId: state.selectedFolder || 'default',
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      tags: [],
      type: 'text'
    }
    setSelectedNote(newNote)
    setShowNoteEditor(true)
  }

  const handleEditNote = (note: Note) => {
    setSelectedNote(note)
    setShowNoteEditor(true)
  }

  const handleSaveNote = async (note: Note) => {
    try {
      await storageManager.saveNote(note)
      await loadData()
      setShowNoteEditor(false)
      setSelectedNote(null)
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await storageManager.deleteNote(noteId)
      await loadData()
      toast.success('Note deleted')
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handlePinNote = async (note: Note) => {
    try {
      await storageManager.saveNote({ ...note, isPinned: !note.isPinned })
      await loadData()
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned')
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleCreateFolder = async (name: string, color: string = '#3B82F6') => {
    try {
      const newFolder: FolderType = {
        id: Date.now().toString(),
        name,
        createdAt: new Date().toISOString(),
        color,
        icon: 'Folder'
      }
      await storageManager.saveFolder(newFolder)
      await loadData()
      setShowFolderDialog(false)
      toast.success('Folder created')
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const handleExportBackup = async () => {
    try {
      const backup = await storageManager.exportBackup()
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `astra-notes-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Backup exported successfully')
    } catch (error) {
      console.error('Error exporting backup:', error)
      toast.error('Failed to export backup')
    }
  }

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const backup = JSON.parse(text)
      await storageManager.importBackup(backup)
      await loadData()
      toast.success('Backup imported successfully')
    } catch (error) {
      console.error('Error importing backup:', error)
      toast.error('Failed to import backup')
    }
  }

  const filteredAndSortedNotes = React.useMemo(() => {
    let filtered = state.notes

    // Apply search filter
    if (state.searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
      )
    }

    // Apply folder filter
    if (state.selectedFolder) {
      filtered = filtered.filter(note => note.folderId === state.selectedFolder)
    }

    // Apply type filter
    switch (state.filterBy) {
      case 'pinned':
        filtered = filtered.filter(note => note.isPinned)
        break
      case 'recent':
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(note => new Date(note.createdAt) > sevenDaysAgo)
        break
      case 'ai-generated':
        filtered = filtered.filter(note => note.type === 'ai-generated')
        break
    }

    // Apply sorting
    switch (state.sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'folder':
        filtered.sort((a, b) => a.folderId.localeCompare(b.folderId))
        break
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
    }

    // Pinned notes always come first
    const pinned = filtered.filter(note => note.isPinned)
    const unpinned = filtered.filter(note => !note.isPinned)
    
    return [...pinned, ...unpinned]
  }, [state.notes, state.searchQuery, state.selectedFolder, state.filterBy, state.sortBy])

  const getFolderName = (folderId: string) => {
    const folder = state.folders.find(f => f.id === folderId)
    return folder?.name || 'Unknown Folder'
  }

  const getFolderColor = (folderId: string) => {
    const folder = state.folders.find(f => f.id === folderId)
    return folder?.color || '#3B82F6'
  }

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
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold gradient-text">AI Notes & Knowledge Base</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes, tags, content..."
                value={state.searchQuery}
                onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={state.viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, viewMode: 'grid' }))}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={state.viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, viewMode: 'list' }))}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

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
                    All Notes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, filterBy: 'pinned' }))}>
                    Pinned Notes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, filterBy: 'recent' }))}>
                    Recent (7 days)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, filterBy: 'ai-generated' }))}>
                    AI Generated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, sortBy: 'date' }))}>
                    Last Modified
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, sortBy: 'title' }))}>
                    Title A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setState(prev => ({ ...prev, sortBy: 'folder' }))}>
                    Folder
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
                  <DropdownMenuItem onClick={handleExportBackup}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Backup
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <label className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Backup
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                    </label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-full overflow-hidden">
          {/* Sidebar - Folders */}
          <div className="w-64 border-r bg-muted/30 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Folders</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFolderDialog(true)}
              >
                <FolderPlus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                variant={state.selectedFolder === null ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setState(prev => ({ ...prev, selectedFolder: null }))}
              >
                <FileText className="w-4 h-4 mr-2" />
                All Notes ({state.notes.length})
              </Button>

              {state.folders.map((folder) => {
                const noteCount = state.notes.filter(n => n.folderId === folder.id).length
                return (
                  <Button
                    key={folder.id}
                    variant={state.selectedFolder === folder.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setState(prev => ({ ...prev, selectedFolder: folder.id }))}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: folder.color }}
                    />
                    {folder.name} ({noteCount})
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Notes Grid/List */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading notes...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button onClick={handleCreateNote} className="spark-button">
                    <Plus className="w-4 h-4 mr-2" />
                    New Note
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

                {/* Notes Display */}
                {filteredAndSortedNotes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                    <p className="text-muted-foreground mb-4">
                      {state.searchQuery ? 'Try adjusting your search terms' : 'Create your first note to get started'}
                    </p>
                    <Button onClick={handleCreateNote}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Note
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    className={`grid gap-4 ${
                      state.viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                    }`}
                    layout
                  >
                    <AnimatePresence>
                      {filteredAndSortedNotes.map((note) => (
                        <motion.div
                          key={note.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -2 }}
                          className="relative"
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                              note.isPinned ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                            }`}
                            onClick={() => handleEditNote(note)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-base line-clamp-2">
                                  {note.title}
                                  {note.isPinned && (
                                    <Pin className="w-4 h-4 inline ml-1 text-primary" />
                                  )}
                                </CardTitle>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleEditNote(note)}>
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handlePinNote(note)}>
                                      {note.isPinned ? 'Unpin' : 'Pin'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteNote(note.id)}
                                      className="text-destructive"
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                {truncateText(note.content.replace(/[#*`]/g, ''), 120)}
                              </p>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: getFolderColor(note.folderId) }}
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {getFolderName(note.folderId)}
                                  </span>
                                </div>
                                
                                {note.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {note.tags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {note.tags.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{note.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{formatDate(note.updatedAt)}</span>
                                  {note.type === 'ai-generated' && (
                                    <Sparkles className="w-3 h-3 text-primary" />
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modals */}
        <NoteEditor
          isOpen={showNoteEditor}
          onClose={() => {
            setShowNoteEditor(false)
            setSelectedNote(null)
          }}
          note={selectedNote}
          folders={state.folders}
          onSave={handleSaveNote}
        />

        <AINoteModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          onSave={handleSaveNote}
          folders={state.folders}
        />

        {/* Create Folder Dialog */}
        <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <FolderView
              onSave={handleCreateFolder}
              onCancel={() => setShowFolderDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}