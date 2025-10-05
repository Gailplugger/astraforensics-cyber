/**
 * NoteEditor - Rich text editor for creating and editing notes
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  X,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Pin,
  Tag,
  Folder,
  Mic,
  MicOff,
  Sparkles,
  FileText,
  Upload,
  Eye,
  Edit3
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select'
import { toast } from 'sonner'

import { Note, Folder as FolderType } from '../../lib/storage'
import { aiAssistant, voiceManager } from '../../lib/ai'

interface NoteEditorProps {
  isOpen: boolean
  onClose: () => void
  note: Note | null
  folders: FolderType[]
  onSave: (note: Note) => void
}

export function NoteEditor({ isOpen, onClose, note, folders, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [folderId, setFolderId] = useState('default')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [isProcessing, setIsProcessing] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setFolderId(note.folderId)
      setTags(note.tags)
      setIsPinned(note.isPinned)
    } else {
      // Reset for new note
      setTitle('')
      setContent('')
      setFolderId('default')
      setTags([])
      setIsPinned(false)
    }
  }, [note])

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    const noteData: Note = {
      id: note?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      folderId,
      tags,
      isPinned,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: note?.type || 'text'
    }

    onSave(noteData)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave()
    }
  }

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end)
    
    setContent(newContent)
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const formatText = (type: string) => {
    switch (type) {
      case 'bold':
        insertText('**', '**')
        break
      case 'italic':
        insertText('*', '*')
        break
      case 'h1':
        insertText('\n# ', '\n')
        break
      case 'h2':
        insertText('\n## ', '\n')
        break
      case 'h3':
        insertText('\n### ', '\n')
        break
      case 'ul':
        insertText('\n- ', '\n')
        break
      case 'ol':
        insertText('\n1. ', '\n')
        break
      case 'quote':
        insertText('\n> ', '\n')
        break
      case 'code':
        insertText('`', '`')
        break
    }
  }

  const handleVoiceInput = async () => {
    if (!voiceManager.isSupported) {
      toast.error('Voice input not supported in your browser')
      return
    }

    if (isListening) {
      voiceManager.stopListening()
      setIsListening(false)
      return
    }

    try {
      setIsListening(true)
      toast.info('Listening... Speak now')
      
      const transcript = await voiceManager.startListening()
      setContent(prev => prev + (prev ? '\n\n' : '') + transcript)
      toast.success('Voice input added')
    } catch (error) {
      console.error('Voice input error:', error)
      toast.error('Failed to capture voice input')
    } finally {
      setIsListening(false)
    }
  }

  const handleAIEnhance = async (action: string) => {
    if (!content.trim()) {
      toast.error('Please enter some content first')
      return
    }

    setIsProcessing(true)
    try {
      let result = ''
      
      switch (action) {
        case 'summarize':
          result = await aiAssistant.summarizeNote(content)
          break
        case 'expand':
          result = await aiAssistant.expandNote(content)
          break
        case 'simplify':
          result = await aiAssistant.simplifyNote(content)
          break
      }
      
      setContent(result)
      toast.success(`Content ${action}d successfully`)
    } catch (error) {
      console.error(`Error ${action}ing content:`, error)
      toast.error(`Failed to ${action} content`)
    } finally {
      setIsProcessing(false)
    }
  }

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 rounded">$1</code>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary pl-4 italic">$1</blockquote>')
      .replace(/\n/g, '<br>')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">
              {note ? 'Edit Note' : 'Create New Note'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isPinned ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsPinned(!isPinned)}
            >
              <Pin className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b p-3 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('bold')}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('italic')}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('h1')}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('h2')}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('h3')}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('ul')}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('ol')}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('quote')}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('code')}
              title="Code"
            >
              <Code className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              variant={isListening ? 'default' : 'ghost'}
              size="sm"
              onClick={handleVoiceInput}
              disabled={!voiceManager.isSupported}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIEnhance('summarize')}
              disabled={isProcessing}
              title="AI Summarize"
            >
              <Sparkles className="w-4 h-4" />
              Summarize
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIEnhance('expand')}
              disabled={isProcessing}
              title="AI Expand"
            >
              <Sparkles className="w-4 h-4" />
              Expand
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIEnhance('simplify')}
              disabled={isProcessing}
              title="AI Simplify"
            >
              <Sparkles className="w-4 h-4" />
              Simplify
            </Button>
          </div>
        </div>

        {/* Note Details */}
        <div className="border-b p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium"
                onKeyPress={handleKeyPress}
              />
            </div>
            <div>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: folder.color }}
                        />
                        {folder.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="flex-1 overflow-hidden">
              <Textarea
                ref={textareaRef}
                placeholder="Start writing your note... You can use Markdown formatting."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-full resize-none border-0 focus:ring-0 text-base leading-relaxed"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 overflow-auto p-4">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {content.length} characters · Cmd+Enter to save
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}